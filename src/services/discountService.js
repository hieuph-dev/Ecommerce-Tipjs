'use strict' // Giam thieu ro ri bo nho

const {
    BadRequestError,
    NotFoundError
} = require('../core/errorResponse')

const { 
    convertToObjectIdMongodb 
} = require('../utils')

const { 
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    checkDiscountExists
} = require('../models/repositories/discountRepo')

const { 
    findAllProducts 
} = require('../models/repositories/productRepo')

const discount = require('../models/discountModel')

/*
    Discount services
    1 - Generator discount code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Admin | Shop]
    6 - Cancel discount code [User]
*/

class DiscountService {
    
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name,
            description, type, value, max_value, max_uses, uses_count,
            users_used, max_uses_per_user
        } = payload

        // Kiem tra
        // if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
        //     throw new BadRequestError('Discount code has expired!')
        // }
        
        if(new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end date!')
        }

        // Create index for discount code 
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists!')
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
        })

        return newDiscount
    }

    static async updateDiscountCode() {
        // Tu lam giong product 
    }

    /*
        Get all discount codes available with products [USERS]
    */
    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit, page
    }) {
        // Create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if(!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exists!')
        }

        const {discount_applies_to, discount_product_ids} = foundDiscount
        let products
        if(discount_applies_to === 'all') {
            // Get all products
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if(discount_applies_to === 'specific') {
            // Get the product ids
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    /*
        Get all discount codes [SHOP]
    */
    static async getAllDiscountCodesByShop({
        limit, page,
        shopId
    }) {
        const discounts = await findAllDiscountCodesSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            select: ['discount_code', 'discount_name'],
            model: discount
        })

        return discounts
    }

    /*
        Apply Discount Code
        products = [
            {
                productId,
                shopId,
                quantity,
                name,
                price,
            },
            {
                productId,
                shopId,
                quantity,
                name,
                price,
            },
        ]
    */
   static async getDiscountAmount({codeId, userId, shopId, products}) {
    
    const foundDiscount = await checkDiscountExists({
        model: discount,
        filter: {
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }
    })

    if(!foundDiscount) throw new NotFoundError(`Discount doesn't exists!`)

    const {
        discount_is_active,
        discount_max_uses,
        discount_min_order_value,
        discount_users_used,
        discount_start_date,
        discount_end_date,
        discount_max_uses_per_user,
        discount_type,
        discount_value
    } = foundDiscount

    if(!discount_is_active) throw new NotFoundError(`Discount expired!`)
    if(!discount_max_uses) throw new NotFoundError(`Discounts are run out!`)
    
    // if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
    //     throw new NotFoundError(`Discount code has expired!`)
    // }

    // Check xem co gia tri toi thieu hay ko
    let totalOrder = 0
    if(discount_min_order_value > 0) {
        // Get total    
        totalOrder = products.reduce((acc, product) => {
            return acc + (product.quantity * product.price)
        }, 0)

        if(totalOrder < discount_min_order_value) {
            throw new NotFoundError(`Discount requires a minimum order value of ${discount_min_order_value}!`)
        }
    }

    if(discount_max_uses_per_user > 0) {
        const userUsedDiscount = discount_users_used.find(user => user.userId === userId)
        if(userUsedDiscount) {
            // ... hoan thanh phan con lai
        }
    }

    // Check xem discount nay la fixed_amount or percentage
    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    return {
        totalOrder,
        discount: amount,
        totalPrice: totalOrder - amount
    } 
   }

   static async deleteDiscountCode({shopId, codeId}) {
    const deleted = await discount.findOneAndDelete({
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
    })

    return deleted
   }

   /*
        Cancel discount code 
   */
   static async cancelDiscountCode({codeId, shopId, userId}) {
    const foundDiscount = await checkDiscountExists({
        model: discount,
        filter: {
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }
    })

    if(!foundDiscount) throw new NotFoundError(`Discount doesn't exist`)

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
        $pull: {
            discount_users_used: userId,
        },
        $inc: {
            discount_max_uses: 1,
            discount_uses_count: -1
        }
    })

    return result
   }
}

module.exports = DiscountService
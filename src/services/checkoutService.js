'use strict'
const {
    BadRequestError,
    NotFoundError
} = require('../core/errorResponse')
const { order } = require('../models/orderModel')

const { 
    findCartById 
} = require("../models/repositories/cartRepo")

const { 
    checkProductByServer 
} = require('../models/repositories/productRepo')

const {
    getDiscountAmount
} = require('../services/discountService')

const { 
    acquireLock, 
    releaseLock
} = require('./redisService')

class CheckoutService {
    // Login and without login
    /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [],
                    item_products: [
                        {
                            price, 
                            quantity,
                            productId
                        }
                    ],
                },
                {
                    shopId,
                    shop_discounts: [
                        {
                            shopId,
                            discountId,
                            codeId
                        }
                    ],
                    item_products: [
                        {
                            price, 
                            quantity,
                            productId
                        }
                    ],
                },
            ]
        }
    */

    static async checkoutReview({
        cartId, userId, shop_order_ids = []
    }) {
        // Check cartId ton tai khong?
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequestError('Cart does not exists!')
        
        const checkout_order = {
            totalPrice: 0, // tong tien hang
            feeShip: 0, // phi van chuyen
            totalDiscount: 0, // tong giam gia
            totalCheckout: 0, // tong thanh toan
        }, shop_order_ids_new = []

        // Tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const {shopId, shop_discounts = [], item_products = []} = shop_order_ids[i]

            // Check product available 
            const checkProductServer = await checkProductByServer(item_products)
            console.log(`checkProductServer::`, checkProductServer)
            if(!checkProductServer[0]) throw new BadRequestError('Order wrong!!!')

            // Tong tien don hang 
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // Tong tien truoc khi xu ly
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // New shop_discounts ton tai > 0, check xem co hop le hay khong?
            if(shop_discounts.length > 0) {
                // Gia su chi co mot discount
                // Get amount discount
                const {totalPrice = 0, discount = 0} = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                // Tong cong discount giam gia
                checkout_order.totalDiscount += discount

                // Neu tien giam gia > 0 thi giam gia
                if(discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            
            // Tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    // Order
    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const {shop_order_ids_new, checkout_order} = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        // Check lai mot lan nua xem co vuot ton kho hay khong?
        // Get new array Products
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log(`[1]::`, products)
        const acquireLock = []
        for (let i = 0; i < products.length; i++) {
            const {productId, quantity} = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireLock.push(keyLock ? true : false)
            if(keyLock) {
                await releaseLock(keyLock)
            }
        }

        // Check neu co mot san pham het hang trong kho
        if(acquireProduct.includes(false)) {
            throw new BadRequestError('Mot so san pham da duoc cap nhat, vui long quay lai gio hang...')
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        })

        // Truong hop: Neu insert thanh cong, thi remove product co trong cart
        if(newOrder) {
            // Remove product in my cart
        }

        return newOrder
    }

    /*
        1> Query Orders [Users]
    */
   static async getOrdersByUser() {

   }
    /*
        2> Query Order Using Id [Users]
    */
   static async getOneOrderByUser() {

   }
    /*
        3> Cancel Orders [Users]
    */
   static async cancelOrderByUser() {

   }
    /*
        4> Update Order Status [Shop | Admin]
    */
   static async updateOrderStatusByShop() {

   }
}

module.exports = CheckoutService
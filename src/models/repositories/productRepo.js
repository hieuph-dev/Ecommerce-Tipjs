'use strict'

const {product, electronic, clothing, furniture} = require('../../models/productModel')
const {Types} = require('mongoose')
const {getSelectData, unGetSelectData, convertToObjectIdMongodb} = require('../../utils/')

// Find all drafts
const findAllDraftsForShop = async ({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

// Find all published products
const findAllPublishForShop = async ({query, limit, skip}) => {
    return await queryProduct({query, limit, skip})
}

// Search product by keyword
const searchProductByUser = async ({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isPublished: true,
        $text: {$search: regexSearch}
    }, {score: {$meta: 'textScore'}})
    .sort({score: {$meta: 'textScore'}})
    .lean()

    return results
}

// Publish product from draft
const publishProductByShop = async({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true    
    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount
}

// Unpublish product by Id
const unPublishProductByShop = async({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false    
    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount
}

// Find all products
const findAllProducts = async ({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return products
}

// Find product by Id
const findProduct = async ({product_id, unSelect}) => {
    return await product.findById(product_id).select(unGetSelectData(unSelect))
}

// Update product by Id
const updateProductById = async({
    productId,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    })
}

const queryProduct = async ({query, limit, skip}) => { // Lấy ds sp theo yc dưới
    return await product.find(query)
        .populate('product_shop', 'name email -_id') // Chỉ lấy các field dc truyền vào
        .sort({updateAt: -1}) // Sắp xếp giảm dần ( Mới nhất trước)
        .skip(skip) // Phân trang
        .limit(limit) // Giới hạn số lượng sp trả về trong 1 lần truy vấn
        .lean() // 
        .exec() // Thực thi truy vấn và trả về Promise
}

const getProductById = async (productId) => {
    return await product.findOne({_id: convertToObjectIdMongodb(productId)}).lean()
}

const checkProductByServer = async (products) => {
    return await Promise.all(products.map(async product => {
        const foundProduct = await getProductById(product.productId)
        if(foundProduct) {
            return {
                price: foundProduct.product_price,
                quantity: product.quantity,
                productId: product.productId,
            }
        }
    }))
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop, 
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById,
    checkProductByServer
}
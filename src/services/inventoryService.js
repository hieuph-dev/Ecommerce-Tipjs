'use strict'

const { 
    BadRequestError, 
    NotFoundError 
} = require('../core/errorResponse')

const {
    inventory
} = require('../models/inventoryModel')

const { 
    getProductById 
} = require('../models/repositories/productRepo')

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = '134, Mai Hac De, HCMC'
    }) {
        const product = await getProductById(productId)
        if(!product) {
            throw new NotFoundError('Product not found')
        }

        const query = {inven_shopId: shopId, inven_productId: productId},
        updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }, options = {upsert: true, new: true}

        return await inventory.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService
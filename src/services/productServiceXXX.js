'use strict'

const {product, clothing, electronic, furniture} = require('../models/productModel')
const {BadRequestError, ForbiddenError} = require('../core/errorResponse')
const { 
    findAllDraftsForShop, 
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
} = require('../models/repositories/productRepo')
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils')
const { insertInventory } = require('../models/repositories/inventoryRepo')

// Define Factory class to create Product
class ProductFactory {
    /*
        type: 'Clothing',
        payload
     */

    static productRegistry = {} // Key-class

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

        return new productClass(payload).updateProduct(productId)
    }

    // Put //
    static async publishProductByShop({product_shop, product_id}) {
        return await publishProductByShop({product_shop, product_id})
    }

    static async unPublishProductByShop({product_shop, product_id}) {
        return await unPublishProductByShop({product_shop, product_id})
    }
    // End Put // 



    // Query
    static async findAllDraftsForShop( {product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isDraft: true}
        return await findAllDraftsForShop({query, limit, skip})
    }

    static async findAllPublishForShop( {product_shop, limit = 50, skip = 0}) {
        const query = {product_shop, isPublished: true}
        return await findAllPublishForShop({query, limit, skip})
    }

    static async searchProducts({keySearch}) {
        return await searchProductByUser({keySearch})
    }

    static async findAllProducts({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}) {
        return await findAllProducts({limit, sort, filter, page,
            select: ['product_name', 'product_price', 'product_thumb', 'product_shop']
        })
    }

    static async findProduct({product_id}) {
        return await findProduct({product_id, unSelect: ['__v', 'product_variations']})
    }
}



// Define base product class
class Product {
    constructor({
        product_name, product_thumb, product_description, product_price, product_quantity, 
        product_type, product_shop, product_attributes, 
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // Create new product
    async createProduct(product_id) {
        const newProduct = await product.create({...this, _id: product_id})
        if(newProduct) {
            // Add product_stock in inventory collection
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }

        return newProduct
    }

    // Update product
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({productId, bodyUpdate, model: product})
    }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
    // Tao moi san pham
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct;
    }

    // Update san pham 
    async updateProduct(productId) {
        /*
            {
                a: undefined,
                b: null
            }
        */
       // 1. Remove attribute has null undefined
       const objectParams = removeUndefinedObject(this) 
       
       // 2. Check xem update o cho nao
       if (objectParams.product_attributes) {
            // Update child
            await updateProductById({
                productId, 
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), 
                model: clothing
            })
       }

       const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
       return updateProduct
    }
}

// Define sub-class for different product types Electronics
class Electronics extends Product {
    // Tao moi san pham
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new BadRequestError('Create new Electronics error')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct;
    }

    
}

// Define sub-class for different product types Furniture
class Furnitures extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) throw new BadRequestError('Create new Furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct;
    }
}

// Register product types
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furnitures', Furnitures)


// ProductFactory.registerProductType('Furnitures', Furnitures)

module.exports = ProductFactory;


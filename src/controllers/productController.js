'use strict'

const ProductService = require('../services/productService')
const ProductServiceV2 = require('../services/productServiceXXX')
const {SuccessResponse} = require('../core/successResponse')

// Điều khiển các endpoint 
class ProductController {

    // Create new product controller
    createProduct = async (req, res, next) => {

        // new SuccessResponse({
        //     message: 'Create new Product success!',
        //     metadata: await ProductService.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId
        //     })
        // }).send(res)
        
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    // Update product controller
    updateProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update Product Success!',
            metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    // Publish controller
    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product by shop success!',
            metadata: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    // Unpublish controller
    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish product by shop success!',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    
    // Query //
    /**
     * @desc Get all Drafts controller
     * @param {Number} limit 
     * @param {Number} skip 
     * @param {JSON} 
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft success!',
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    // Get all publish products controller
    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Publish success!',
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    // Get list search product controller
    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Search product success!',
            metadata: await ProductServiceV2.searchProducts(req.params)
        }).send(res)
    }

    // Find all products controller
    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list find all products success!',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res)
    }

    // Find product controller
    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get product success!',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }

    // EndQuery //
}

module.exports = new ProductController()
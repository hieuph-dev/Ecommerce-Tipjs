'use strict'

const CartService = require('../services/cartService')
const {SuccessResponse} = require('../core/successResponse')

class CartController {

    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Created new cart success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Updated cart success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'Deleted cart success',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Took list cart success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()
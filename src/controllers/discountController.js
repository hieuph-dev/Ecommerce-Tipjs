'use strict'

const DiscountService = require('../services/discountService')
const {SuccessResponse} = require('../core/successResponse')

class DiscountController {

    createDiscountCode = async(req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodes = async(req, res, next) => {
        new SuccessResponse({
            message: 'Successful Get All Discount Codes',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getDiscountAmount = async(req, res, next) => {
        new SuccessResponse({
            message: 'Successful Get Discount Amount',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }

    getAllDiscountCodesWithProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Successful Get All Discount Codes With Product',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res)
    }
}

module.exports = new DiscountController()
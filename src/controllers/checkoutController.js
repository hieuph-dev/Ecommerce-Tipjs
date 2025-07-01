'use strict'

const CheckoutService = require("../services/checkoutService")
const {SuccessResponse} = require('../core/successResponse')

class CheckoutController {

    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Checkout review successfully!',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
}

module.exports = new CheckoutController()
'use strict'

const { OK, CREATED, SuccessResponse } = require('../core/successResponse')
const AccessService = require('../services/accessService')

// Điều khiển các endpoint (signup, login, logout).
class AccessController {

    handlerRefreshToken = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Get token success!',
        //     metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        // }).send(res)

        // v2 fixed, no need access token
        new SuccessResponse({
            message: 'Get token success!',
            metadata: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout successfully!',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {
            // return res.status(201).json(await AccessService.signUp(req.body)) 
            // => Controller không xử lý logic trực tiếp mà gọi tới AccessService.
            new CREATED({
                message: 'Registered OK!',
                metadata: await AccessService.signUp(req.body),
                options: {
                    limit: 10
                }
            }).send(res)
    }
}

module.exports = new AccessController()
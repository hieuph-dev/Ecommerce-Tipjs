'use strict'

const JWT = require('jsonwebtoken')
const {AuthFailureError, NotFoundError} = require('../core/errorResponse')
const asyncHandler = require('../helpers/asyncHandler')

// Service
const { findByUserId } = require('../services/keyTokenService')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}

// Tạo cặp token.
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // Access token
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (error, decode) =>{
            if(error) {
                console.error(`Error verify::`, error)
            } else {
                console.log(`Decode verify::`, decode)
            }
        })
        
        return {
            accessToken,
            refreshToken,
        }
    } catch (error) {
        console.error("Error creating token pair:", error)
        return null
    }
}

// Xác thực token. [KHÔNG SỬ DỤNG CÁI NÀY NỮA]
const authentication = asyncHandler(async (req, res, next) => {
    /*
        1 - Check userId missing
        2 - Get access token
        3 - Verify token
        4 - Check user in dbs
        5 - Check key store with this userId
        6 - OK all => return next()
    */

   // 1
   const userId = req.headers[HEADER.CLIENT_ID]
   if(!userId) throw new AuthFailureError('Invalid Request')

    // 2
   const keyStore = await findByUserId(userId)
   if(!keyStore) throw new NotFoundError('Not found Key Store')

    // 3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid User Id')
        req.keyStore = keyStore
        req.user = decodeUser
        return next()

    } catch (error) {
        throw error
    }

})

// Xác thực token V2.
const authenticationV2 = asyncHandler(async (req, res, next) => {
    /*
        1 - Check userId missing
        2 - Get access token
        3 - Verify token
        4 - Check user in dbs
        5 - Check key store with this userId
        6 - OK all => return next()
    */

   // 1
   const userId = req.headers[HEADER.CLIENT_ID]
   if(!userId) throw new AuthFailureError('Invalid Request')

    // 2
   const keyStore = await findByUserId(userId)
   if(!keyStore) throw new NotFoundError('Not found Key Store')

    // 3
    if(req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid User Id')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request1')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid User Id')
        req.keyStore = keyStore
        req.user = decodeUser
        return next()

    } catch (error) {
        throw error
    }

})

const verifyJWT = async(token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
}
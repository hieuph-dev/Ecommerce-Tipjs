'use strict'

const shopModel = require("../models/shopModel")
const bcrypt = require('bcrypt') 
const crypto = require('node:crypto') 
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/errorResponse")

// Service //
const KeyTokenService = require("./keyTokenService")
const { findByEmail } = require("./shopService")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

// Xử lý logic nghiệp vụ cho signup, login, logout.
class AccessService {

    /*
        Check this token used V1
    */
    static handlerRefreshToken = async(refreshToken) => {
        // Check xem token nay da duoc su dung chua
        const foundToken = await KeyTokenService.findByRefreshTokensUsed(refreshToken)
        // Neu co
        if(foundToken) {
            // Decode xem may la thang nao
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log("[1]---------", {userId, email})

            // Xoa tat ca token trong key store
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something went wrong! Please relogin')
        }

        // Khong, qua ngon
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if(!holderToken) throw new AuthFailureError('Shop not registered1')

        // Verify token
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]--', {userId, email})

        // Check userId
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop not registered2')

        // Create 1 cap moi
        const tokens = await createTokenPair(
            {userId, email}, 
            holderToken.publicKey, 
            holderToken.privateKey
        )

        // Update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // Da duoc su dung de lay token moi roi
            }
        })

        return {
            user: {userId, email},
            tokens
        }
        
    }
    
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*
        Check this token used V2
    */
    static handlerRefreshTokenV2 = async({keyStore, user, refreshToken}) => {
        const {userId, email} = user;

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something went wrong! Please relogin')
        }

        if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered 1')

        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop not registered 2')

            // Create 1 cap moi
            const tokens = await createTokenPair(
                {userId, email}, 
                keyStore.publicKey, 
                keyStore.privateKey
            )
    
            // Update token
            await keyStore.updateOne({
                $set: {
                    refreshToken: tokens.refreshToken
                },
                $addToSet: {
                    refreshTokensUsed: refreshToken // Da duoc su dung de lay token moi roi
                }
            })
    
            return {
                user,
                tokens
            }
    }

    static logout = async(keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log('delKey', {delKey})
        return delKey
        
    }
    
    /*
        1 - Check email in dbs
        2 - Match password
        3 - Create AT and RT and save
        4 - Generate tokens
        5 - Get data return login  
     */
    static login = async({email, password, refreshToken = null}) => {

        // 1.
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new BadRequestError('Shop not registered')

        // 2.
        const match = bcrypt.compare(password, foundShop.password)
        if(!match) throw new AuthFailureError('Authentication error')

        // 3. Created privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        // 4. Generate token
        const {_id: userId} = foundShop
        const tokens = await createTokenPair(
            {userId, email}, 
            publicKey, 
            privateKey
        )

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userId
        })
        return {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundShop}),
            tokens
        }
    }

    static signUp = async({name, email, password}) => {
        // try {
            // Step1: Check email exists
            const holderShop = await shopModel.findOne({email}).lean()
            if(holderShop) { // kiểm tra tồn tại
                throw new BadRequestError('Error: Shop already registered!')
            } 

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({ // Lưu shop vào database   
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP]
            })

            if(newShop) {
                // Created privateKey, publicKey
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                // => ✔ Dùng crypto.randomBytes(64).toString('hex') để tạo khóa.
                    // ✔ Cặp khóa này sẽ được dùng để mã hóa token (JWT).
                console.log("Generate a key pair:",{privateKey, publicKey}) // save collection KeyStore

                // Lưu cặp khóa collection "Keys"
                const keyStore = await KeyTokenService.createKeyToken({ 
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if(!keyStore) {
                    // throw new BadRequestError('Error: Shop already registered!')
                    return {
                        code: 'xxxx',
                        message: 'Key store error!'
                    }
                }

                // Created token pair
                const tokens = await createTokenPair(
                    {userId: newShop._id, email}, 
                    publicKey, 
                    privateKey
                )
                console.log(`Created Token Success::`, tokens)
                
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }

        // } catch(error) {
        //     console.error(error);
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    } 
}

module.exports = AccessService
// Quản lý keyStore.
'use strict'

const keyTokenModel = require("../models/keyTokenModel")
const {Types} = require("mongoose")

class KeyTokenService {

    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // -- Level 0
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens.publicKey : null

            // -- Level 1
            const filter = {user: userId}
            const update = {
                publicKey, 
                privateKey, 
                refreshTokensUsed: [], 
                refreshToken
            }
            const options = {
                upsert: true, 
                new: true
            }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null

        } catch (error) {
            return error
        }
    }

    static findByUserId = async(userId) => {
        return await keyTokenModel.findOne({user: new Types.ObjectId(userId)})
    }

    static removeKeyById = async(id) => {
        // return await keyTokenModel.deleteOne({_id: id})
        return await keyTokenModel.deleteOne(id)
    }
    
    static findByRefreshTokenUsed = async(refreshToken) => {
        return await keyTokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
    }

    static findByRefreshToken = async(refreshToken) => {
        return await keyTokenModel.findOne({refreshToken})
    }

    static deleteKeyById = async(userId) => {
        // return await keyTokenModel.deleteOne({user: userId})
        return await keyTokenModel.deleteOne({user: new Types.ObjectId(userId)})
    }

}

module.exports = KeyTokenService
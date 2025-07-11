'use strict'

const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema({
    order_userId: {type: Number, required: true},
    order_checkout: {type: Object, default: {}},
    /*
        order_checkout = {
            totalPrice,
            totalApplyDiscount,
            feeShip
        }
    */
    order_shipping: {type: Object, default: {}},
    /*
        street,
        city,
        state,
        country
    */
    order_payment: {type: Object, default: {}},
    order_products: {type: Array, required: true},
    order_trackingNumber: {type: String, default: '#0000118052022'},
    order_status: {type: String, enum: ['pending', 'confirmed', 'shipping' ,'delivered', 'cancelled'], default: 'pending'},
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
})

module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}
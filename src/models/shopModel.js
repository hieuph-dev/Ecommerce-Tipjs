// Lưu thông tin người dùng (shop).
'use strict'

const { model, Schema, Types } = require('mongoose'); // Erase if already required// Declare the Schema of the Mongo modelvar userSchema = new mongoose.Schema({    name:{        type:String,        required:true,        unique:true,        index:true,    },    email:{        type:String,        required:true,        unique:true,    },    mobile:{        type:String,        required:true,        unique:true,    },    password:{        type:String,        required:true,    },});

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

// Declare the Schema of the Mongo model
const shopSchema = new Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 150
    }, 
    email: {
        type: String,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,    
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive' 
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);
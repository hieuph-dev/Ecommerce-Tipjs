// Lưu thông tin mã giảm giá
"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: "fixed_amount", // or percentage
    },
    discount_value: {
      // 10.000, 10%
      type: Number,
      required: true,
    },
    discount_code: {
      // Discount code
      type: String,
      required: true,
    },
    discount_start_date: {
      // Ngay bat dau
      type: Date,
      required: true,
    },
    discount_end_date: {
      // Ngay ket thuc
      type: Date,
      required: true,
    },
    discount_max_uses: {
      // SL discount dc ap dung
      type: Number,
      required: true,
    },
    discount_uses_count: {
      // So discount da su dung
      type: Number,
      required: true,
    },
    discount_users_used: {
      // Nhung ai da su dung discount
      type: Array,
      default: [], // or percentage
    },
    discount_max_uses_per_user: {
      // So luong discount toi da 1 nguoi dung
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_max_value: {
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },

    discount_is_active: {
      type: Boolean,
      default: true,
    },

    discount_applies_to: {
      type: String,
      required: true,
      enum: ['all', 'specific']
    },
    discount_product_ids: {
      // So san pham duoc ap dung
      type: Array,
      default: []
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);

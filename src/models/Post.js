const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AppError = require("../utils/AppError");

const PostSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên sản phẩm"],
    },
    price: {
      type: Number,
      required: [true, "Vui lòng nhập giá sản phẩm"],
    },
    negotiable: {
      type: Boolean,
      default: true,
    },
    note: {
      type: String,
      required: [true, "Vui lòng nhập mô tả sản phẩm"],
    },
    quantity: {
      type: Number,
      required: [true, "Vui lòng bổ sung số lượng"],
    },
    images: [String],
    brand: String,
    boughtLink: String,
    location: {
      type: String,
      required: [true, "Vui lòng nhập vị trí giao hàng"],
    },
    soldOut: {
      type: Boolean,
      default: false,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    categoryParams: { type: Object, default: {} },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", PostSchema);

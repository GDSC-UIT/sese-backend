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
    condition: {
      type: String,
      required: [true, "Vui lòng nhập tình trạng sản phẩm"],
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
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    categoryParams: Object,
  },
  {
    timestamps: true,
  }
);
PostSchema.statics.search = function (field, keyword) {
  console.log("Searching");
  return this.find({
    [field]: new RegExp(keyword, "gi"),
  });
};

module.exports = mongoose.model("Post", PostSchema);

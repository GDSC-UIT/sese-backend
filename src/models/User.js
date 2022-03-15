const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { validateEmail } = require("../utils/validate");
const AppError = require("../utils/AppError");

const UserSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    signInProvider: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      validate: [validateEmail, "Vui lòng nhập email hợp lệ"],
    },
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên"],
      maxlength: 30,
    },
    avatar: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    birthDate: Date,
    phoneNumber: String,
    university: String,
    liveAt: String,
    interestedCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    evidence: new Schema({
      id: { type: String, required: true },
      type: {
        type: String,
        enum: ["student_card", "identity_card", "citizen_identity_card"],
        required: [true, "Vui lòng cung cấp loại bằng chứng xác minh"],
      },
      frontImg: {
        type: String,
        required: [true, "Vui lòng upload mặt trước"],
      },
      backImg: {
        type: String,
        required: [true, "Vui lòng upload mặt sau"],
      },
      status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending",
      },
      submittedAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    }),
  },
  {
    timestamps: true,
  }
);

// UserSchema.virtual('numPostedProducts', {
//   ref: 'Product', // The model to use
//   localField: '_id', // Find people where `localField`
//   foreignField: 'user', // is equal to `foreignField`
//   count: true, // And only get the number of docs
// });

UserSchema.pre("findOneAndUpdate", async function (next) {
  if (!this["_update"]) return next();

  if (
    typeof this["_update"]["isVerified"] === "boolean" &&
    this["_update"]["isVerified"]
  ) {
    this["_update"].verifiedAt = Date.now();
  }

  next();
});
module.exports = mongoose.model("User", UserSchema);

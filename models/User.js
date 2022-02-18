const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { validateEmail } = require('../utils/validate');
const AppError = require('../utils/AppError');
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
      validate: [validateEmail, 'Vui lòng nhập email hợp lệ'],
    },
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
      maxlength: 30,
    },
    avatar: {
      type: String,
      required: [true, 'Vui lòng upload ảnh'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
    },
    evidence: {
      id: { type: String, required: true },
      type: {
        type: String,
        enum: ['student_card', 'identity_card', 'citizen_identity_card'],
        required: [true, 'Vui lòng cung cấp loại bằng chứng xác minh'],
      },
      frontImg: {
        type: String,
        required: [true, 'Vui lòng upload mặt trước'],
      },
      backImg: {
        type: String,
        required: [true, 'Vui lòng upload mặt sau'],
      },
      status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
      },
      submittedAt: Date,
      updatedAt: Date,
    },
  },
  {
    timestamps: true,
  },
);
// UserSchema.pre('save', async function (next) {
//   next();
// });

//
UserSchema.pre('findOneAndUpdate', async function (next) {
  if (!this['_update']) return next();

  if (
    this['_update']['evidence'] &&
    typeof this['_update']['evidence'] === 'object'
  ) {
    console.log(' - evidence', this['_update']);
    this['_update'].evidence.updatedAt = Date.now();
  }

  if (
    typeof this['_update']['isVerified'] === 'boolean' &&
    this['_update']['isVerified']
  ) {
    console.log('Update');
    this['_update'].verifiedAt = Date.now();
  }

  next();
});
module.exports = mongoose.model('User', UserSchema);

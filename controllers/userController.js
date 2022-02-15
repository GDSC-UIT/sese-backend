const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const { excludeField } = require('../utils');

//@desc         get user information
//@route        GET /api/users
//@access       PRIVATE
exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    users,
  });
});
//@desc         update user information
//@route        PUT /api/users/me
//@access       PRIVATE
exports.updateUser = catchAsync(async (req, res, next) => {
  const filteredObj = excludeField(req.body, '_id', 'uid', 'signInProvider');
  
  const user = await User.findByIdAndUpdate(req.user._id.toString(), filteredObj, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    user,
  });
});

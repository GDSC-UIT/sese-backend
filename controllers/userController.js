const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const {
  filterObject,
  objIsEmpty,
  convertNestedObjectQuery,
} = require('../utils');
const AppError = require('../utils/AppError');

//@desc         update user information
//@route        PUT /api/users/me
//@access       PRIVATE
exports.updateUser = catchAsync(async (req, res, next) => {
  const filteredObj = filterObject(req.body, 'name', 'avatar');

  const user = await User.findByIdAndUpdate(req.user._id, filteredObj, {
    new: true,
    runValidators: true,
  }).lean();
  res.status(200).json({
    user,
  });
});

//@desc         update user verification request
//@route        PUT /api/users/me/verification
//@access       PRIVATE
exports.updateVerificationRequest = catchAsync(async (req, res, next) => {
  const { evidence } = filterObject(req.body, 'evidence');

  if (!evidence || objIsEmpty(evidence)) {
    return next(new AppError('Vui lòng nhập thông tin', 400));
  }
  const user = await User.findById(req.user._id);

  //First send verification request
  if (!user.evidence) {
    user.evidence = evidence;
    await user.save();
    return res.status(200).json({
      user: user,
    });
  }

  //Update
  evidence.updatedAt = Date.now();
  const updateQuery = convertNestedObjectQuery('evidence', evidence);
  const updatedUser = await User.findByIdAndUpdate(req.user._id, updateQuery, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    user: updatedUser,
  });
});

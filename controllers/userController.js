const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const { excludeFields, filterObject, objIsEmpty } = require('../utils');
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
  const filteredObj = filterObject(req.body, 'evidence');

  if (!filteredObj.evidence || objIsEmpty(filteredObj.evidence)) {
    return next(new AppError('Vui lòng nhập đầy đủ thông tin', 400));
  }
  const user = await User.findById(req.user._id);
  console.log('before:', user);
  console.log('Check:', user.evidence);
  console.log(objIsEmpty(user.evidence));
  if (!user.evidence || objIsEmpty(user.evidence)) {
    filteredObj.evidence.submittedAt = Date.now();
    filteredObj.evidence.status = 'pending';
    console.log('Voo day');
  }

  filteredObj.evidence.updatedAt = Date.now();
  user.evidence = filteredObj.evidence;

  console.log(user);
  await user.save();
  res.status(200).json({
    user,
  });
});

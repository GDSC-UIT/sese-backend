const catchAsync = require('../utils/catchAsync');

//@desc         get user information
//@route        GET /api/users
//@access       PUBLIC
exports.getUsers = catchAsync(async (req, res, next) => {

  res.status(200).json({
    message: 'Hello Sturee',
  });
});

const User = require('../../models/User');
const { convertBooleanQuery } = require('../../utils');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

//@desc         Get
//@route        GET /api/admin/verification-requests?status=''&isVerified=1 (or 0)
//@access       PRIVATE
const getVerificationRequests = catchAsync(async (req, res, next) => {
  let reqQuery = { ...req.query };
  console.log('before: ', req.query);
  if (req.query?.status) {
    reqQuery = {
      ...reqQuery,
      'evidence.status': req.query?.status,
    };
    delete reqQuery['status'];
  }
  convertBooleanQuery(reqQuery, 'isVerified');

  console.log('verify: ', reqQuery);
  const users = await User.find(reqQuery);
  res.status(200).json({
    users,
  });
});

module.exports = { getVerificationRequests };

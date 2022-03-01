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

  const users = await User.find(reqQuery);
  res.status(200).json({
    users,
  });
});

//@desc         Update status of verification request of user
//@route        PUT /api/admin/verification-requests/:evidenceId
//@access       PRIVATE
const updateVerificationRequest = catchAsync(async (req, res, next) => {
  const { evidenceId } = req.params;
  const { status } = req.body;

  const updatedData = {
    'evidence.status': status,
    'evidence.updatedAt': Date.now(),
  };

  if (status === 'verified') {
    updatedData.isVerified = true;
  } else {
    updatedData.isVerified = false;
    updatedData.verifiedAt = null;
  }

  const updatedUser = await User.findOneAndUpdate(
    {
      'evidence._id': evidenceId,
    },
    updatedData,
    { new: true, runValidators: true },
  );

  res.status(200).json({
    user: updatedUser,
  });
});
module.exports = { getVerificationRequests, updateVerificationRequest };

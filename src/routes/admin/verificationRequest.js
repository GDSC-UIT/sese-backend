const express = require('express');

const router = express.Router();
const { userVerificationController } = require('../../controllers/admin');

router.get('/', userVerificationController.getVerificationRequests);
router.put(
  '/:evidenceId',
  userVerificationController.updateVerificationRequest,
);

module.exports = router;

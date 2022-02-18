const express = require('express');

const router = express.Router();
const adminController = require('../../controllers/admin');

router.get('/', adminController.getVerificationRequests);
router.put('/:evidenceId', adminController.updateVerificationRequest);

module.exports = router;

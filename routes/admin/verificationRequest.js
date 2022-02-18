const express = require('express');

const router = express.Router();
const adminController = require('../../controllers/admin');

//Test
router.get('/', adminController.getVerificationRequests);

module.exports = router;

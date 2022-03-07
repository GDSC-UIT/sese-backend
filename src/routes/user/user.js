const express = require('express');

const router = express.Router();
const userController = require('../../controllers/user/userController');
const { protect } = require('../../middlewares/auth');

router.use(protect);
router.route('/me/verification').put(userController.updateVerificationRequest);
router.put('/me', userController.updateUser);

module.exports = router;

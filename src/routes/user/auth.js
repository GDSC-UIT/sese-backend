const express = require('express');

const router = express.Router();
const authController = require('../../controllers/user/authController');
const { protect } = require('../../middlewares/auth');

router.get('/', protect, authController.authenticate);
router.post('/login/social', authController.socialLogin);

//For testing
router.post('/login', authController.login);

module.exports = router;

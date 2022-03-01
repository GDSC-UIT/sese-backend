const express = require('express');

const router = express.Router();
const userRoute = require('./user');
const verificationRequestRoute = require('./verificationRequest');

const { login } = require('../../controllers/admin');
const { requireAdmin } = require('../../middlewares/auth');

router.post('/auth/login', login);

router.use(requireAdmin);
router.use('/users', userRoute);
router.use('/verification-requests', verificationRequestRoute);

module.exports = router;

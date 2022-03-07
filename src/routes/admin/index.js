const express = require('express');

const router = express.Router();
const userRoute = require('./user');
const verificationRequestRoute = require('./verificationRequest');
const categoryRoute = require('./category');
const subcategoryRoute = require('./subcategory');

const { login } = require('../../controllers/admin');
const { requireAdmin } = require('../../middlewares/auth');

router.post('/auth/login', login);

router.use('/categories', categoryRoute);
router.use('/subcategories', subcategoryRoute);
router.use(requireAdmin);
router.use('/users', userRoute);
router.use('/verification-requests', verificationRequestRoute);

module.exports = router;

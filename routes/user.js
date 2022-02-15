const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/auth');


router.get('/', protect, userController.getUsers);
router.put('/me', protect, userController.updateUser);

module.exports = router;

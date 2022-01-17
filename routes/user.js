const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
// const { protect } = require('../middlewares/auth');

router.get('/', userController.getUsers);

module.exports = router;

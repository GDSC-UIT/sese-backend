const express = require('express');

const router = express.Router();
const adminController = require('../../controllers/admin');

router.get('/', adminController.getUsers);

router.get('/:_id', adminController.getUser);

module.exports = router;

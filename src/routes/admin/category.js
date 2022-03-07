const express = require('express');

const router = express.Router();
const { categoryController } = require('../../controllers/admin');
const subcategoryRoute = require('./subcategory');

router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

router.post('/batch', categoryController.batchCreateCategories);
router.post('/batch-delete', categoryController.batchDeleteCategories);
router.route('/:id').put(categoryController.updateCategory);

router.use('/:id/subs', subcategoryRoute);

module.exports = router;

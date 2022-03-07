const express = require('express');

const router = express.Router({
  mergeParams: true,
});
const { subcategoryController } = require('../../controllers/admin');

router.route('/').get(subcategoryController.getSubcategories);
router.route('/batch').post(subcategoryController.batchCreateSubcategories);

router.post('/batch-delete', subcategoryController.batchDeleteSubcategories);
router.route('/:id').put(subcategoryController.updateSubcategory);

//params
router
  .route('/:id/params')
  .get(subcategoryController.getParamsOfSubcategory)
  .post(subcategoryController.createParamForSubcategory);
router.post(
  '/:id/params/batch-delete',
  subcategoryController.deleteParamsOfSubcategory,
);

router.put(
  '/:id/params/:paramId',
  subcategoryController.updateParamOfSubcategory,
);

//option
router
  .route('/:id/params/:paramId/options')
  .post(subcategoryController.createOptionsForParam);
router.post(
  '/:id/params/:paramId/options/batch-delete',
  subcategoryController.deleteOptionsOfParam,
);
router.put(
  '/:id/params/:paramId/options/:optionId',
  subcategoryController.updateOptionOfParam,
);

module.exports = router;

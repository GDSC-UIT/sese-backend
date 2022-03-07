//Subcategory

const Category = require('../../models/Category');
const Subcategory = require('../../models/Subcategory');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const mongoose = require('mongoose');
const { convertNestedObjectQuery } = require('../../utils');

//@desc         batch create categories
//@route        POST /api/categories/:id/subs
//@access       PRIVATE
const getSubcategories = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const data = await Subcategory.find({ category: id });
  console.log(data);
  res.status(200).json({
    message: 'get successfully!',
    subcategories: data,
  });
});
//@desc         batch create categories
//@route        POST /api/categories/batch
//@access       PRIVATE
const batchCreateSubcategories = catchAsync(async (req, res, next) => {
  const { subcategories } = req.body;
  const { id } = req.params;
  if (!subcategories || !Array.isArray(subcategories)) {
    return next(new AppError('Invalid data', 500));
  }
  if (id) {
    const category = await Category.findById(id);
    if (!category) {
      return next(new AppError('Category not exists!'));
    }
    subcategories.forEach((sub) => (sub.category = id));
  }
  const data = await Subcategory.create(subcategories);
  console.log(data);
  res.status(200).json({
    message: 'create successfully!',
    subcategories: data,
  });
});

//@desc         batch delete subcategories
//@route        PATCH /api/subcategories/batch
//@access       PRIVATE
const batchDeleteSubcategories = catchAsync(async (req, res, next) => {
  const { subcategories } = req.body;
  if (!subcategories || !Array.isArray(subcategories)) {
    return next(new AppError('Invalid data'));
  }
  await Subcategory.deleteMany({ _id: { $in: subcategories } });
  res.status(200).json({
    message: 'delete successfully!',
  });
});

//@desc         update category
//@route        POST /api/admin/subcategories/:id
//@access       PRIVATE
const updateSubcategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const newSubcategory = await Subcategory.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true, runValidators: true },
  );
  res.status(200).json({
    message: 'Success',
    subcategory: newSubcategory,
  });
});

//Thuộc tính riêng của từng subcategory

const getParamsOfSubcategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    return next(new AppError('Subcategory not exist!'));
  }

  res.status(200).json({
    message: 'get successfully!',
    params: subcategory.params,
  });
});

//@desc         add param to subcategory
//@route        POST /api/admin/subcategories/:id/params
//@access       PRIVATE
const createParamForSubcategory = catchAsync(async (req, res, next) => {
  const { label, required, type, options } = req.body;
  const { id } = req.params;
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    return next(new AppError('Subcategory not exist!'));
  }
  const _id = new mongoose.Types.ObjectId();

  subcategory.params.push({
    _id,
    param: _id,
    label,
    required,
    type,
    options: options ?? [],
  });

  await subcategory.save();
  res.status(200).json({
    message: 'Create successfully!',
    subcategory,
  });
});
//@desc         delete patch params to subcategory
//@route        PUT /api/admin/subcategories/:id/params/batch-delete
//@access       PRIVATE
const deleteParamsOfSubcategory = catchAsync(async (req, res, next) => {
  const { params } = req.body;
  const { id } = req.params;
  if (!params || !Array.isArray(params)) {
    return next(new AppError('Invalid data'));
  }
  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    return next(new AppError('Subcategory not exist!'));
  }
  // const _id = new mongoose.Types.ObjectId();
  params.forEach((p) => subcategory.params.pull(p));

  await subcategory.save();
  res.status(200).json({
    message: 'Delete successfully!',
  });
});
//@desc         update param to subcategory
//@route        PATCH /api/admin/subcategories/:id/params/:paramId
//@access       PRIVATE
const updateParamOfSubcategory = catchAsync(async (req, res, next) => {
  const { id, paramId } = req.params;
  const { label, required, type } = req.body;

  const update = convertNestedObjectQuery('params.$[]', {
    label,
    required,
    type,
  });
  if (type && !['dropdown', 'chip'].includes(type)) {
    update['params.$.options'] = [];
  }
  console.log(update);
  const subcategory = await Subcategory.findByIdAndUpdate(
    {
      _id: id,
      'params._id': paramId,
    },
    {
      $set: {
        ...update,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    message: 'Update successfully!',
    subcategory,
  });
});
//@desc         Create option for param
//@route        POST /api/admin/subcategories/:id/params/:paramId/options
//@access       PRIVATE
const createOptionsForParam = catchAsync(async (req, res, next) => {
  const { id, paramId } = req.params;
  const { options } = req.body;

  console.log(req.params);
  console.log(req.body);
  if (!options || !Array.isArray(options)) {
    return next(new AppError('Invalid data'));
  }

  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    return next(new AppError('subcategory not exist ', 404));
  }
  console.log(paramId);
  const param = subcategory.params.id(paramId);
  if (!param) {
    return next(new AppError('Param not exist ', 404));
  }
  if (param && ['dropdown', 'chip'].includes(param.type)) {
    param.options.push(...options);
    await subcategory.save();
  }

  res.status(200).json({
    message: 'Update successfully!',
    param,
  });
});
//@desc         delete batch option of param
//@route        POST /api/admin/subcategories/:id/params/:paramId/options/batch-delete
//@access       PRIVATE
const deleteOptionsOfParam = catchAsync(async (req, res, next) => {
  const { id, paramId } = req.params;
  const { options } = req.body;
  if (!options || !Array.isArray(options)) {
    return next(new AppError('Invalid data'));
  }
  const subcategory = await Subcategory.findById(id);

  if (!subcategory) {
    return next(new AppError('subcategory not exist ', 404));
  }
  const param = subcategory.params.id(paramId);

  if (!param) {
    return next(new AppError('param not exist ', 404));
  }
  if (['dropdown', 'chip'].includes(param.type)) {
    options.forEach((o) => param.options.pull(o));
    await subcategory.save();
  }

  res.status(200).json({
    message: 'Update successfully!',
  });
});
//@desc         update option of param
//@route        put /api/admin/subcategories/:id/params/:paramId/options/:optionId
//@access       PRIVATE
const updateOptionOfParam = catchAsync(async (req, res, next) => {
  const { id, paramId, optionId } = req.params;
  const { label } = req.body;

  const subcategory = await Subcategory.findById(id);
  if (!subcategory) {
    return next(new AppError('subcategory not exist ', 404));
  }
  const param = subcategory.params.id(paramId);

  if (!param) {
    return next(new AppError('Param not exist ', 404));
  }

  if (['dropdown', 'chip'].includes(param.type)) {
    const option = param.options.id(optionId);
    option.label = label;
    await subcategory.save();
  }

  res.status(200).json({
    message: 'Update successfully!',
    param,
  });
});

module.exports = {
  getSubcategories,
  getParamsOfSubcategory,
  batchCreateSubcategories,
  batchDeleteSubcategories,
  updateSubcategory,
  createParamForSubcategory,
  deleteParamsOfSubcategory,
  updateParamOfSubcategory,
  createOptionsForParam,
  deleteOptionsOfParam,
  updateOptionOfParam,
};

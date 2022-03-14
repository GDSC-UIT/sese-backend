const { convertBooleanQuery } = require('../../utils');
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const Category = require('../../models/Category');
const Subcategory = require('../../models/Subcategory');
const mongoose = require('mongoose');
//@desc         get all category
//@route        GET /api/admin/categories (or 0)
//@access       PRIVATE
const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({}).populate('subcategories').lean();
  res.status(200).json({
    message: 'Get all categories',
    categories,
  });
});

//@desc         Create new category
//@route        POST /api/admin/categories (or 0)
//@access       PRIVATE
const createCategory = catchAsync(async (req, res, next) => {
  const { category, subcategories } = req.body;

  const transformedSubcategories = subcategories.map((sub) => ({
    ...sub,
    params: sub.params.map((p) => {
      const newIdParam = new mongoose.Types.ObjectId();

      return {
        ...p,
        param: newIdParam,
        _id: newIdParam,
        options: p.options,
      };
    }),
  }));
  // const params = subcategories.params.map((p) => ({
  //   ...p,
  //   param,
  //   _id: param,
  //   options: p.options,
  // }));
  const session = await mongoose.startSession();
  const _id = new mongoose.Types.ObjectId();
  await session.withTransaction(async () => {
    await Category.create([{ _id, ...category }], {
      session: session,
    });

    for (const sub of transformedSubcategories) {
      sub.category = _id;
    }

    console.log(transformedSubcategories);
    await Subcategory.create(transformedSubcategories, { session: session });
    console.log('Subcategory created!');
  });
  session.endSession();
  const newCategory = await Category.findById(_id).populate('subcategories');
  res.status(200).json({
    message: 'Success',
    category: newCategory,
  });
});

//@desc         update category
//@route        POST /api/admin/categories/:id
//@access       PRIVATE
const updateCategory = catchAsync(async (req, res, next) => {
  const { name, icon } = req.body;

  const newCategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      icon,
    },
    { new: true, runValidators: true },
  );
  res.status(200).json({
    message: 'Success',
    category: newCategory,
  });
});

//@desc         batch delete categories
//@route        PATCH /api/categories/batch
//@access       PRIVATE
const batchDeleteCategories = catchAsync(async (req, res, next) => {
  const { categories } = req.body;
  if (!categories || !Array.isArray(categories)) {
    return next(new AppError('Invalid data'));
  }
  const result = await Category.deleteMany({ _id: { $in: categories } });
  res.status(200).json({
    message: 'delete successfully!',
    result,
  });
});
//@desc         batch create categories
//@route        POST /api/categories/batch
//@access       PRIVATE
const batchCreateCategories = catchAsync(async (req, res, next) => {
  const { categories } = req.body;
  if (!categories || !Array.isArray(categories)) {
    return next(new AppError('Invalid data'));
  }
  const result = await Category.create(categories);
  res.status(200).json({
    message: 'create successfully!',
    categories: result,
  });
});

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  batchDeleteCategories,
  batchCreateCategories,
};

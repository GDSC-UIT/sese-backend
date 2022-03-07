const catchAsync = require('../../utils/catchAsync');
const Post = require('../../models/Post');
const Subcategory = require('../../models/Subcategory');
const {
  filterObject,
  objIsEmpty,
  convertNestedObjectQuery,
} = require('../../utils');
const AppError = require('../../utils/AppError');
const { options } = require('../../routes/admin');

//@desc         get all post
//@route        PUT /api/posts
//@access       PRIVATE
const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find({}).lean();
  res.status(200).json({
    message: 'get all posts',
    posts,
  });
});

//@desc         get single post details
//@route        PUT /api/posts
//@access       PRIVATE
const getPostDetails = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).lean();
  if (!post) {
    return next(new AppError('Không tồn tại bài đăng này', 404));
  }
  console.log(post);
  const params = Object.keys(post.categoryParams);
  const subcategory = await Subcategory.findById(post.category);

  console.log('subcategory: ', subcategory);
  if (subcategory) {
    const categoryInfo = [];
    params.forEach((p) => {
      const info = getSingleCategoryDetails(
        subcategory.params,
        p,
        post.categoryParams[p],
      );
      if (info) categoryInfo.push(info);
    });

    post.categoryInfos = categoryInfo;
  }
  res.status(200).json({
    message: 'get post details',
    post,
  });
});

const listOptionsType = ['dropdown', 'chip'];
const getSingleCategoryDetails = (params, param, idOption) => {
  console.log('params:', params);
  const index = params.findIndex((p) => p.param === param);
  if (index !== -1) {
    const paramInfo = params[index];

    // Trường hợp thuộc tính của category không có options thì
    //idOption chính là value
    if (!listOptionsType.includes(paramInfo.type)) {
      return {
        id: param,
        value: idOption,
        label: params[index].label,
      };
    }

    const option = paramInfo.options.find(
      (option) => option._id.toString() === idOption,
    );

    if (option) {
      return {
        id: param,
        value: option.label,
        label: params[index].label,
      };
    }
  }

  return null;
};

//@desc         create new post
//@route        POST /api/posts/
//@access       PRIVATE
const createPost = catchAsync(async (req, res, next) => {
  const post = await Post.create({
    ...req.body,
    user: req.user._id,
  });
  res.status(200).json({
    message: 'create success',
    post,
  });
});

module.exports = {
  createPost,
  getAllPosts,
  getPostDetails,
};

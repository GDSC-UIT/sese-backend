const catchAsync = require("../../utils/catchAsync");
const Post = require("../../models/Post");
const Subcategory = require("../../models/Subcategory");
const AppError = require("../../utils/AppError");
const User = require("../../models/User");

function getRandom(arr, n) {
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

//@desc         get all post
//@route        PUT /api/posts
//@access       PRIVATE
const getAllPosts = catchAsync(async (req, res, next) => {
  const { q, type, ...query } = req.query;

  const postQuery = Post.find(query);
  if (q) {
    postQuery.find({
      name: new RegExp(q, "gi"),
    });
  }
  if (type === "new") {
    postQuery.sort("-createdAt");
  }

  let posts = await postQuery.populate("user");

  if (type === "recommendation") {
    const count = await Post.countDocuments();
    if (count > 5) {
      posts = getRandom(posts, 5);
    }
  }
  res.status(200).json({
    message: "get all posts",
    posts,
  });
});

//@desc         get single post details
//@route        PUT /api/posts
//@access       PRIVATE
const getPostDetails = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate("user")
    .populate("buyer", "name email avatar")
    .lean();
  if (!post) {
    return next(new AppError("Không tồn tại bài đăng này", 404));
  }
  if (post.categoryParams) {
    const params = Object.keys(post.categoryParams);
    const subcategory = await Subcategory.findById(post.subcategory);

    console.log("subcategory: ", subcategory);
    if (subcategory) {
      const categoryInfo = [];
      params.forEach((p) => {
        const info = getSingleCategoryDetails(
          subcategory.params,
          p,
          post.categoryParams[p]
        );
        if (info) categoryInfo.push(info);
      });

      post.categoryInfos = categoryInfo;
    }
  } else {
    post.categoryParams = {};
    post.categoryInfos = [];
  }

  res.status(200).json({
    message: "get post details",
    post,
  });
});

const listOptionsType = ["dropdown", "chip"];
const getSingleCategoryDetails = (params, param, idOption) => {
  console.log("params:", params);
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
      (option) => option._id.toString() === idOption
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
  const { category } = req.body;

  const sub = await Subcategory.findById(category);

  if (!sub) {
    return next(new AppError("Không tồn tại category này", 404));
  }

  const post = await Post.create({
    ...req.body,
    category: sub.category,
    subcategory: sub._id,
    user: req.user._id,
  });
  res.status(200).json({
    message: "create post successfully",
    post,
  });
});

//@desc         update new post
//@route        PUT /api/posts/:id
//@access       PRIVATE
const updatePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) {
    return next(new AppError("Không tồn tại bài đăng này", 404));
  }
  if (post.user.toString() !== req.user._id.toString()) {
    return next(new AppError("Không có quyền sửa bài đăng này", 403));
  }

  if (req.body.buyer) {
    const buyer = await User.findById(req.body.buyer);
    if (!buyer) {
      return next(new AppError("Không tồn tại người này", 404));
    }

    req.body.soldOut = true;
  }
  const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    message: "update post successfully",
    post: updatedPost,
  });
});

module.exports = {
  createPost,
  getAllPosts,
  getPostDetails,
  updatePost,
};

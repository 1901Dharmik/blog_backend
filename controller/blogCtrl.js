import Blog from "../models/blogModel.js";
import Comment from "../models/commentModel.js";
import asyncHandler from "express-async-handler";
import { slugify } from "../middlewares/validate.js";
import mongoose from "mongoose";

const createBlog = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (!body.slug && body.title) body.slug = slugify(body.title);
  const blog = await Blog.create(body);
  await blog.populate("author", "name avatarUrl bio");
  res.status(201).json(blog);
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  const category = req.query.category?.trim() || null;
  const sort = req.query.sort === "asc" ? { publishedDate: 1 } : { publishedDate: -1 };

  const filter = {};
  if (category) filter.category = category;
  if (req.query.published !== "false") filter.isPublished = true;

  const [blogs, total] = await Promise.all([
    Blog.find(filter).sort(sort).skip(skip).limit(limit).populate("author", "name avatarUrl bio").lean(),
    Blog.countDocuments(filter),
  ]);

  res.status(200).json({
    data: blogs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isSlug = !mongoose.Types.ObjectId.isValid(id) || id.length !== 24;
  const query = isSlug ? { slug: id } : { _id: id };
  const blog = await Blog.findOne(query).populate("author", "name avatarUrl bio");
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.status(200).json(blog);
});

const getBlogWithComments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isSlug = !mongoose.Types.ObjectId.isValid(id) || id.length !== 24;
  const blogDoc = await Blog.findOne(isSlug ? { slug: id } : { _id: id }).populate("author", "name avatarUrl bio");
  if (!blogDoc) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const commentPage = Math.max(1, parseInt(req.query.commentPage, 10) || 1);
  const commentLimit = Math.min(50, Math.max(1, parseInt(req.query.commentLimit, 10) || 10));
  const commentSkip = (commentPage - 1) * commentLimit;

  const [comments, commentTotal] = await Promise.all([
    Comment.find({ blog: blogDoc._id })
      .sort({ createdAt: -1 })
      .skip(commentSkip)
      .limit(commentLimit)
      .lean(),
    Comment.countDocuments({ blog: blogDoc._id }),
  ]);

  const ratingAgg = await Comment.aggregate([
    { $match: { blog: blogDoc._id, rating: { $gte: 1, $lte: 5 } } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const averageRating = ratingAgg[0] ? Math.round(ratingAgg[0].avg * 10) / 10 : null;
  const ratingCount = ratingAgg[0] ? ratingAgg[0].count : 0;

  const blog = blogDoc.toObject();
  blog.comments = comments;
  blog.commentsPagination = {
    page: commentPage,
    limit: commentLimit,
    total: commentTotal,
    totalPages: Math.ceil(commentTotal / commentLimit),
  };
  blog.averageRating = averageRating;
  blog.ratingCount = ratingCount;

  res.status(200).json(blog);
});

const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("author", "name avatarUrl bio");
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.status(200).json(blog);
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  await Comment.deleteMany({ blog: blog._id });
  res.status(200).json({ message: "Blog deleted" });
});

const rateUsefulness = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // 'heart' | 'thumbsUp' | 'lightbulb' | 'plus'
  const valid = ["heart", "thumbsUp", "lightbulb", "plus"];
  if (!type || !valid.includes(type)) {
    res.status(400);
    throw new Error(`type must be one of: ${valid.join(", ")}`);
  }
  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { [`usefulnessRatings.${type}`]: 1 } },
    { new: true }
  );
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.status(200).json(blog.usefulnessRatings);
});

export {
  createBlog,
  getAllBlogs,
  getBlog,
  getBlogWithComments,
  updateBlog,
  deleteBlog,
  rateUsefulness,
};

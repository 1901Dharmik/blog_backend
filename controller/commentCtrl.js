import Comment from "../models/commentModel.js";
import Blog from "../models/blogModel.js";
import asyncHandler from "express-async-handler";

const createComment = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  const comment = await Comment.create({
    ...req.body,
    blog: blogId,
  });
  res.status(201).json(comment);
});

const getCommentsByBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    Comment.find({ blog: blogId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Comment.countDocuments({ blog: blogId }),
  ]);

  const ratingAgg = await Comment.aggregate([
    { $match: { blog: blog._id, rating: { $gte: 1, $lte: 5 } } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const averageRating = ratingAgg[0] ? Math.round(ratingAgg[0].avg * 10) / 10 : null;

  res.status(200).json({
    data: comments,
    averageRating,
    ratingCount: ratingAgg[0] ? ratingAgg[0].count : 0,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

const getComment = asyncHandler(async (req, res) => {
  const { blogId, commentId } = req.params;
  const comment = await Comment.findOne({ _id: commentId, blog: blogId });
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  res.status(200).json(comment);
});

const updateComment = asyncHandler(async (req, res) => {
  const { blogId, commentId } = req.params;
  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, blog: blogId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  res.status(200).json(comment);
});

const deleteComment = asyncHandler(async (req, res) => {
  const { blogId, commentId } = req.params;
  const comment = await Comment.findOneAndDelete({ _id: commentId, blog: blogId });
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }
  res.status(200).json({ message: "Comment deleted" });
});

export {
  createComment,
  getCommentsByBlog,
  getComment,
  updateComment,
  deleteComment,
};

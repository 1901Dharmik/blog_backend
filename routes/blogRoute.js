import express from "express";
import validate from "../middlewares/validate.js";
import {
  createBlog,
  getAllBlogs,
  getBlog,
  getBlogWithComments,
  updateBlog,
  deleteBlog,
  rateUsefulness,
} from "../controller/blogCtrl.js";
import {
  createComment,
  getCommentsByBlog,
  getComment,
  updateComment,
  deleteComment,
} from "../controller/commentCtrl.js";

const router = express.Router();

const blogCreateRules = {
  title: { required: true, type: "string", minLength: 1, maxLength: 500 },
  content: { required: true, type: "string", minLength: 1 },
  author: { required: true, type: "objectId" },
  category: { required: false, type: "string", maxLength: 100 },
  slug: { required: false, type: "string", maxLength: 300 },
  mainImageUrl: { required: false, type: "string" },
  excerpt: { required: false, type: "string" },
  publishedDate: { required: false, type: "string" },
  isPublished: { required: false, type: "boolean" },
};

const blogUpdateRules = {
  title: { required: false, type: "string", minLength: 1, maxLength: 500 },
  content: { required: false, type: "string", minLength: 1 },
  author: { required: false, type: "objectId" },
  category: { required: false, type: "string", maxLength: 100 },
  slug: { required: false, type: "string", maxLength: 300 },
  mainImageUrl: { required: false, type: "string" },
  excerpt: { required: false, type: "string" },
  publishedDate: { required: false, type: "string" },
  isPublished: { required: false, type: "boolean" },
};

const commentCreateRules = {
  commenterName: { required: true, type: "string", minLength: 1, maxLength: 200 },
  commenterEmail: { required: false, type: "string", maxLength: 320 },
  text: { required: true, type: "string", minLength: 1, maxLength: 5000 },
  rating: { required: false, type: "number", min: 1, max: 5 },
  commenterAvatarUrl: { required: false, type: "string" },
};

const commentUpdateRules = {
  commenterName: { required: false, type: "string", minLength: 1, maxLength: 200 },
  commenterEmail: { required: false, type: "string", maxLength: 320 },
  text: { required: false, type: "string", minLength: 1, maxLength: 5000 },
  rating: { required: false, type: "number", min: 1, max: 5 },
  commenterAvatarUrl: { required: false, type: "string" },
};

// Blog CRUD
router.post("/", validate(blogCreateRules), createBlog);
router.get("/", getAllBlogs);
router.get("/with-comments/:id", getBlogWithComments); // get one with comments + average rating (id or slug)
router.get("/:id", getBlog); // get one by id or slug
router.put("/:id", validate(blogUpdateRules), updateBlog);
router.delete("/:id", deleteBlog);

// Article usefulness rating (heart, thumbsUp, lightbulb, plus)
router.post("/:id/rate-usefulness", rateUsefulness);

// Nested comment routes
router.post("/:blogId/comments", validate(commentCreateRules), createComment);
router.get("/:blogId/comments", getCommentsByBlog);
router.get("/:blogId/comments/:commentId", getComment);
router.put("/:blogId/comments/:commentId", validate(commentUpdateRules), updateComment);
router.delete("/:blogId/comments/:commentId", deleteComment);

export default router;

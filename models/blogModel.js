import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "Articles",
    },
    mainImageUrl: {
      type: String,
      default: null,
    },
    excerpt: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: [true, "Author is required"],
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
    // Aggregate usefulness (heart, thumbs up, etc.) - optional for "Rate usefulness" feature
    usefulnessRatings: {
      heart: { type: Number, default: 0 },
      thumbsUp: { type: Number, default: 0 },
      lightbulb: { type: Number, default: 0 },
      plus: { type: Number, default: 0 },
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

blogSchema.index({ publishedDate: -1 });
blogSchema.index({ category: 1, publishedDate: -1 });

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;

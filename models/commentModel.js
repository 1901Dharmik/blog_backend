import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "Blog reference is required"],
    },
    commenterName: {
      type: String,
      required: [true, "Commenter name is required"],
      trim: true,
    },
    commenterEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    commenterAvatarUrl: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      default: null,
    },
  },
  { timestamps: true }
);

commentSchema.index({ blog: 1, createdAt: -1 });

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;

const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    isEdited: { type: Boolean, default: false },
    comment: { type: String },
    performedBy: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);

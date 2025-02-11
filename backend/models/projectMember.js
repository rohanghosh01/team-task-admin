const mongoose = require("mongoose");
const { Schema } = mongoose;

// Project Member Schema
const projectMemberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming you have a 'User' model to reference
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "manager", "developer", "designer", "tester"], // You can expand this list as needed
      default: "developer",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project", // References the Project model
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

projectMemberSchema.index({ userId: 1, projectId: 1 }, { unique: true });

const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);

module.exports = ProjectMember;

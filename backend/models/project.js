const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "hold", "archived"],
      default: "active",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "high",
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;

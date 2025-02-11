const mongoose = require("mongoose");
const { Schema } = mongoose;
const Label = require("./label");

// Task Schema
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "in_review", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "low",
    },
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project", // References the Project model
      required: true,
    },
    labels: [],
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming you have a 'User' model to reference
      required: false,
    },
  },
  { timestamps: true }
);




async function updateLabels(labels) {
  if (labels && labels.length > 0) {
    const objectsArray = labels.map(label => ({ name: label }));
    try {
      await Label.insertMany(objectsArray, { ordered: false })
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

// Pre-save Hook to Handle Labels
taskSchema.pre("save", async function (next) {
  try {
    await updateLabels(this.labels)
  } catch (error) {
    throw new Error(error.message)
  } finally {
    next();
  }
});
// Pre-update Hook to Handle Labels
taskSchema.pre("updateOne", async function (next) {
  try {
    const update = this.getUpdate();
    await updateLabels(update.labels)
  } catch (error) {
    console.worn('some labels are duplicate', error)
  } finally {
    next();
  }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

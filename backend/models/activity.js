const mongoose = require("mongoose");
const ActivitySchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    action: { type: String, required: true }, // e.g., 'Updated status', 'Edited description'
    previousValue: { type: mongoose.Schema.Types.Mixed }, // Flexible for different data types
    newValue: { type: mongoose.Schema.Types.Mixed },
    key: { type: String },
    message: { type: String },
    performedBy: { type: String },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);

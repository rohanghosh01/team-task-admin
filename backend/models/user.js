const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    role: { type: String, enum: ["member", "admin"] },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    encryptedPassword: { type: String },
    avatar: { type: String },
    phoneNumber: { type: String },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

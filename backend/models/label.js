const mongoose = require("mongoose");
const { Schema } = mongoose;

const labelSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // Enforces uniqueness at the database level
        },
    },
    { timestamps: true }
);

const Label = mongoose.model("Label", labelSchema);

module.exports = Label;

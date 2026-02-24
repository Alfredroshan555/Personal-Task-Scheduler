const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["recurring", "onetime"],
    default: "recurring",
  },
  schedule: {
    type: String,
    required: function () {
      return this.type === "recurring";
    },
    trim: true,
  },
  scheduledAt: {
    type: Date,
    required: function () {
      return this.type === "onetime";
    },
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for id to keep compatibility with existing frontend/logic if needed
TaskSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtuals are serialized
TaskSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Task", TaskSchema);

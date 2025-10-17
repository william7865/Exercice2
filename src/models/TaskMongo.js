const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["pending", "done", "archived"],
      default: "pending",
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);
TaskSchema.method("toJSON", function () {
  const obj = this.toObject({ versionKey: false });
  obj.id = obj._id.toString();
  delete obj._id;
  return obj;
});
module.exports = mongoose.model("Task", TaskSchema);

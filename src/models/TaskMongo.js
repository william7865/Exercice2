const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: "createdAt" } }
);

TaskSchema.method("toJSON", function () {
  const obj = this.toObject({ versionKey: false });
  obj.id = obj._id.toString();
  delete obj._id;
  return obj;
});

module.exports = mongoose.model("Task", TaskSchema);

const mongoose = require("mongoose");

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  description: { type: String, required: true, minLength: 3, maxLength: 1000 }
});

CategorySchema.virtual("url").get(function () {
  return `/inventory/categories/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);

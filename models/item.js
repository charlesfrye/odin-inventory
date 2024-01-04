const mongoose = require("mongoose");
const moment = require("moment");

const { Schema } = mongoose;

const integerValidator = {
  validator: Number.isInteger,
  message: (props) => `${props.value} is not an integer`
};

const ItemSchema = new Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 100 },
    description: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 1000
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      validate: integerValidator // in cents
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      validate: integerValidator
    }
  },
  { timestamps: true }
);

ItemSchema.virtual("url").get(function () {
  return `/inventory/items/${this._id}`;
});

ItemSchema.virtual("price_friendly").get(function () {
  return `$${(this.price / 100).toFixed(2)}`;
});

ItemSchema.virtual("updatedAt_friendly").get(function () {
  return moment(this.updatedAt).fromNow();
});

module.exports = mongoose.model("Item", ItemSchema);

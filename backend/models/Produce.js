const mongoose = require("mongoose");

const ProduceSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    enum: ["FRUIT", "VEGETABLE"],
    required: true
  },

  totalQuantityKg: {
    type: Number,
    required: true,
    min: 1
  },

  boxSizeKg: {
    type: Number,
    default: 20,
    immutable: true
  },

  pricePerKg: {
    type: Number,
    required: true,
    min: 1
  },

  harvestDate: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["LISTED", "CLOSED"],
    default: "LISTED"
  }

}, { timestamps: true });

module.exports = mongoose.model("Produce", ProduceSchema);

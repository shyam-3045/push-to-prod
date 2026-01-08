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

  pricePerKg: {
    type: Number,
    required: true,
    min: 1
  },

  minBidPerBox: {
    type: Number,
    required: true,
    min: 1
  },

  bidDurationMinutes: {
    type: Number,
    required: true,
    enum: [30, 60, 120]
  },

  bidStartTime: Date,
  bidEndTime: Date,

  status: {
    type: String,
    enum: ["LISTED", "BIDDING", "CLOSED"],
    default: "LISTED"
  }

}, { timestamps: true });

module.exports = mongoose.model("Produce", ProduceSchema);

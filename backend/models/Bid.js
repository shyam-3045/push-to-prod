const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema({

  produceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },

  retailerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },

  bidAmount: {
    type: Number,
    required: true,
    min: 1
  },

  status: {
    type: String,
    enum: ["ACTIVE", "OUTBID", "WON", "REJECTED"],
    default: "ACTIVE"
  }

}, { timestamps: true });


BidSchema.index(
  { produceId: 1, retailerId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Bid", BidSchema);

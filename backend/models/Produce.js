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

  minBidAmount: {
    type: Number,
    min: 1
  },

  bidDurationMinutes: {
    type: Number,
    required: true,
    enum: [5,10,15]
  },

  bidStartTime: Date,
  bidEndTime: Date,

  status: {
    type: String,
    enum: ["LISTED", "BIDDING", "CLOSED"],
    default: "LISTED"
  }

}, { timestamps: true });
const Produce = require("../models/Produce");
const Bid = require("../models/Bid");

exports.closeExpiredAuctions = async () => {
  const now = new Date();

  const expiredProduces = await Produce.find({
    status: "BIDDING",
    bidEndTime: { $lte: now }
  });

  for (const produce of expiredProduces) {
    produce.status = "CLOSED";
    await produce.save();

    const winningBid = await Bid.findOne({
      produceId: produce._id,
      status: "ACTIVE"
    });

    if (winningBid) {
      winningBid.status = "WON";
      await winningBid.save();
    }
  }
};


module.exports = mongoose.model("Produce", ProduceSchema);

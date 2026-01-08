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

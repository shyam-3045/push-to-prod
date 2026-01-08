const Bid = require("../models/Bid");
const Produce = require("../models/Produce");
const AppError = require("../utils/AppError");

exports.placeBid = async (req, res, next) => {
  try {
    const { produceId, bidAmount } = req.body;
    const retailerId = req.user.id;

    if (!produceId || !bidAmount) {
      return next(new AppError("produceId and bidAmount required", 400));
    }

    const produce = await Produce.findById(produceId);
    if (!produce) {
      return next(new AppError("Produce not found", 404));
    }

    const now = new Date();

    // 1️⃣ Auto start bidding
    if (produce.status === "LISTED") {
      produce.bidStartTime = now;
      produce.bidEndTime = new Date(
        now.getTime() + produce.bidDurationMinutes * 60 * 1000
      );
      produce.status = "BIDDING";
      await produce.save();
    }

    // 2️⃣ Window check
    if (now > produce.bidEndTime) {
      return next(new AppError("Bidding window closed", 400));
    }

    // 3️⃣ Minimum bid
    if (bidAmount < produce.minBidPerBox) {
      return next(new AppError("Bid below minimum allowed", 400));
    }

    // 4️⃣ Get current highest bid
    const highestBid = await Bid.findOne({
      produceId,
      status: "ACTIVE"
    }).sort({ bidAmount: -1 });

    // 5️⃣ Leader cannot rebid
    if (highestBid && highestBid.retailerId.toString() === retailerId) {
      return next(new AppError("You are already the highest bidder", 400));
    }

    // 6️⃣ Must beat highest
    if (highestBid && bidAmount <= highestBid.bidAmount) {
      return next(new AppError(
        "Bid must be higher than current highest bid",
        400
      ));
    }

    // 7️⃣ Last 5 min lock
    const timeLeft = produce.bidEndTime - now;
    if (timeLeft <= 5 * 60 * 1000) {
      const alreadyBid = await Bid.findOne({
        produceId,
        retailerId
      });

      if (alreadyBid) {
        return next(new AppError(
          "Only one bid allowed in final 5 minutes",
          400
        ));
      }
    }

    // 8️⃣ Demote old leader
    if (highestBid) {
      await Bid.updateOne(
        { _id: highestBid._id },
        { status: "OUTBID" }
      );
    }

    // 9️⃣ Upsert retailer bid (atomic by index)
    await Bid.findOneAndUpdate(
      { produceId, retailerId },
      {
        produceId,
        retailerId,
        bidAmount,
        status: "ACTIVE"
      },
      { upsert: true }
    );

    res.status(200).json({
      status: "success",
      message: "Bid placed successfully"
    });

  } catch (err) {
    next(err);
  }
};


exports.getRunningBids = async (req, res, next) => {
  try {
    const now = new Date();

    const runningBids = await Produce.aggregate([
      {
        $match: {
          status: "BIDDING",
          bidEndTime: { $gt: now }
        }
      },
      {
        $lookup: {
          from: "bids",
          let: { pid: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$produceId", "$$pid"] },
                    { $eq: ["$status", "ACTIVE"] }
                  ]
                }
              }
            },
            {
              $project: {
                bidAmount: 1,
                retailerId: 1,
                createdAt: 1
              }
            }
          ],
          as: "currentBid"
        }
      },
      {
        $addFields: {
          currentBid: { $arrayElemAt: ["$currentBid", 0] }
        }
      },
      {
        $project: {
          name: 1,
          category: 1,
          totalQuantityKg: 1,
          minBidPerBox: 1,
          bidEndTime: 1,
          currentBid: 1
        }
      }
    ]);

    res.status(200).json({
      status: "success",
      count: runningBids.length,
      data: runningBids
    });

  } catch (err) {
    next(err);
  }
};

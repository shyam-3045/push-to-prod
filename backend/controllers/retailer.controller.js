const Produce = require("../models/Produce");
const User = require("../models/UserSchema");
const AppError = require("../utils/AppError");
const Bid = require("../models/Bid");

exports.getProduces = async (req, res, next) => {
  try {
    const produces = await Produce.find({ status: "LISTED" })
      .sort({ createdAt: -1 })
      .lean();

    if (!produces.length) {
      return res.status(200).json({
        status: "success",
        data: []
      });
    }

    const farmerIds = [...new Set(produces.map(p => p.farmerId.toString()))];

    const farmers = await User.find(
      { _id: { $in: farmerIds }, role: "FARMER" },
      { name: 1, address: 1 }
    ).lean();

    const farmerMap = {};
    farmers.forEach(farmer => {
      farmerMap[farmer._id.toString()] = farmer;
    });

    const result = produces.map(p => ({
      ...p,
      farmer: farmerMap[p.farmerId.toString()] || null
    }));

    res.status(200).json({
      status: "success",
      count: result.length,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

exports.getWonBids = async (req, res) => {
  try {
    const retailerId = req.user.id;

    const wonBids = await Bid.find({
      retailerId,
      status: "WON",
    })
      .populate({
        path: "produceId",
        select: "name category totalQuantityKg pricePerKg farmerId",
      })
      .sort({ createdAt: -1 });

    res.json({
      status: "success",
      count: wonBids.length,
      data: wonBids,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch won bids",
    });
  }
};

exports.getFarmerForWonBid = async (req, res, next) => {
  const { bidId } = req.params;
  const retailerId = req.user.id;

  const bid = await Bid.findOne({
    _id: bidId,
    retailerId,
    status: "WON"
  }).populate({
    path: "produceId",
    populate: {
      path: "farmerId",
      select: "name email address"
    }
  });

  if (!bid) {
    return next(new AppError("Won bid not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: bid.produceId.farmerId
  });
};

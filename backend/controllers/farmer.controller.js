const Produce = require("../models/Produce");
const AppError = require("../utils/AppError");
const Bid = require("../models/Bid");
const User = require("../models/UserSchema");

exports.uploadProduce = async (req, res, next) => {
  try {
    const {
      name,
      category,
      totalQuantityKg,
      pricePerKg,
      minBidPerBox,
      
    } = req.body;

    if (
      !name ||
      !category ||
      !totalQuantityKg ||
      !pricePerKg ||
      !minBidPerBox 
    ) {
      return next(new AppError("Missing required fields", 400));
    }
    const bidDurationMinutes = 5

    if (!["FRUIT", "VEGETABLE"].includes(category)) {
      return next(new AppError("Invalid category", 400));
    }

    if (totalQuantityKg <= 0) {
      return next(new AppError("Quantity must be greater than zero", 400));
    }

    if (pricePerKg <= 0 || minBidPerBox <= 0) {
      return next(new AppError("Prices must be greater than zero", 400));
    }

    if (![5,10,15].includes(bidDurationMinutes)) {
      return next(
        new AppError("Invalid bid duration. Allowed: 5,10,15 minutes", 400)
      );
    }

    const produce = await Produce.create({
      farmerId: req.user.id,
      name,
      category,
      totalQuantityKg,
      pricePerKg,
      minBidPerBox,
      bidDurationMinutes
    });

    res.status(201).json({
      status: "success",
      produce
    });

  } catch (err) {
    next(err);
  }
};

exports.getMyProduces = async (req, res, next) => {
  try {
    const farmerId = req.user.id;

    const produces = await Produce.find({ farmerId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      status: "success",
      count: produces.length,
      data: produces
    });

  } catch (err) {
    next(err);
  }
};
exports.getMyBids =  async (req, res, next) => {
  try {
    const farmerId = req.user.id;
    const { produceId } = req.params;

    const produce = await Produce.findOne({
      _id: produceId,
      farmerId,
      status: "CLOSED"
    });

    if (!produce) {
      return next(new AppError("Produce not found or bidding not closed", 404));
    }

    const winningBid = await Bid.findOne({
      produceId,
      status: "WON"
    }).select("bidAmount retailerId createdAt");

    res.status(200).json({
      status: "success",
      produce,
      winningBid
    });

  } catch (err) {
    next(err);
  }
};

exports.getRetailerById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name email role address");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user details",
    });
  }
};
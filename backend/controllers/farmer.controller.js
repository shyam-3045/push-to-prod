const Produce = require("../models/Produce");
const AppError = require("../utils/AppError");

exports.uploadProduce = async (req, res, next) => {
  try {
    const {
      name,
      category,
      totalQuantityKg,
      pricePerKg,
      minBidPerBox,
      harvestDate
    } = req.body;

    if (
      !name ||
      !category ||
      !totalQuantityKg ||
      !pricePerKg ||
      !minBidPerBox ||
      !harvestDate
    ) {
      return next(new AppError("Missing required fields", 400));
    }

    if (!["FRUIT", "VEGETABLE"].includes(category)) {
      return next(new AppError("Invalid category", 400));
    }

    if (totalQuantityKg < 20 || totalQuantityKg % 20 !== 0) {
      return next(
        new AppError("Total quantity must be in multiples of 20kg", 400)
      );
    }

    if (pricePerKg <= 0 || minBidPerBox <= 0) {
      return next(new AppError("Prices must be greater than zero", 400));
    }

    const calculatedMinBid = pricePerKg * 20;
    if (minBidPerBox < calculatedMinBid) {
      return next(
        new AppError("Minimum bid cannot be less than base price per box", 400)
      );
    }

    if (new Date(harvestDate) > new Date()) {
      return next(new AppError("Harvest date cannot be in the future", 400));
    }

    const produce = await Produce.create({
      farmerId: req.user.id,
      name,
      category,
      totalQuantityKg,
      pricePerKg,
      minBidPerBox,
      harvestDate
    });

    res.status(201).json({
      status: "success",
      produce
    });

  } catch (err) {
    next(err);
  }
};

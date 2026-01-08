const Produce = require("../models/Produce");
const AppError = require("../utils/AppError");

exports.uploadProduce = async (req, res, next) => {
  try {
    const {
      name,
      category,
      totalQuantityKg,
      pricePerKg,
      harvestDate
    } = req.body;

    if (
      !name ||
      !category ||
      !totalQuantityKg ||
      !pricePerKg ||
      !harvestDate
    ) {
      return next(new AppError("Missing required fields", 400));
    }

    if (!["FRUIT", "VEGETABLE"].includes(category)) {
      return next(new AppError("Invalid category", 400));
    }

    if (totalQuantityKg <= 0 || totalQuantityKg % 20 !== 0) {
      return next(
        new AppError("Quantity must be positive and divisible by 20kg", 400)
      );
    }

    if (new Date(harvestDate) > new Date()) {
      return next(new AppError("Harvest date cannot be in future", 400));
    }

    const produce = await Produce.create({
      farmerId: req.user.id,
      name,
      category,
      totalQuantityKg,
      pricePerKg,
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

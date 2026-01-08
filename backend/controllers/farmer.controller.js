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
      bidDurationMinutes
    } = req.body;

    if (
      !name ||
      !category ||
      !totalQuantityKg ||
      !pricePerKg ||
      !minBidPerBox ||
      !bidDurationMinutes
    ) {
      return next(new AppError("Missing required fields", 400));
    }

    if (!["FRUIT", "VEGETABLE"].includes(category)) {
      return next(new AppError("Invalid category", 400));
    }

    if (totalQuantityKg <= 0) {
      return next(new AppError("Quantity must be greater than zero", 400));
    }

    if (pricePerKg <= 0 || minBidPerBox <= 0) {
      return next(new AppError("Prices must be greater than zero", 400));
    }

    if (![30, 60, 120].includes(bidDurationMinutes)) {
      return next(
        new AppError("Invalid bid duration. Allowed: 30, 60, 120 minutes", 400)
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

const Produce = require("../models/Produce");
const User = require("../models/UserSchema");
const AppError = require("../utils/AppError");

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

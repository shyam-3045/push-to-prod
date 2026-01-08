const bcrypt = require("bcrypt");
const User = require("../models/UserSchema");
const AppError = require("../utils/AppError");
const { signToken } = require("../utils/jwt");


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("email and password required", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    const token = signToken(user);
    console.log(token)

    res.status(200).json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};


exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role, address } = req.body;

    if (!name || !email || !password || !role || !address) {
      return next(new AppError("Missing required fields", 400));
    }

    const allowedRoles = ["FARMER", "RETAILER", "TRANSPORTER"];
    if (!allowedRoles.includes(role)) {
      return next(new AppError("Invalid role", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists", 409));
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      address
    });

    const token = signToken(user);

    res.status(201).json({
      status: "success",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

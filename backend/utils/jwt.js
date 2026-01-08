const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "1d";

exports.signToken = (user) => {
  return jwt.sign(
    {
      sub: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
};

const express = require("express");
const router = express.Router();
const { login,signup, getMyProfile} = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");

router.post("/login", login);
router.post("/signup", signup);
router.get("/me",requireAuth,getMyProfile)

module.exports = router;

const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

router.use(requireAuth);
//router.use(requireRole("FARMER"));

router.get("/dashboard", (req, res) => {
  res.json({ message: "Farmer OK" });
});

module.exports = router;

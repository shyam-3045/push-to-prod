const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

router.use(requireAuth);
router.use(requireRole("RETAILER"));

router.get("/dashboard", (req, res) => {
  res.json({ message: "Retailer OK" });
});

module.exports = router;

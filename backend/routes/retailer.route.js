const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { getProduces } = require("../controllers/retailer.controller");

router.use(requireAuth);
router.use(requireRole("RETAILER"));

router.get("/getProduces",getProduces)
router.get("/test", (req, res) => {
  res.json({ message: "Retailer OK" });
});

module.exports = router;

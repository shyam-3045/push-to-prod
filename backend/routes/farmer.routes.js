const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { uploadProduce } = require("../controllers/farmer.controller");

router.use(requireAuth);
router.use(requireRole("FARMER"));

router.get("/test", (req, res) => {
  res.json({ message: "Farmer OK" });
});

router.post("/createProduce",uploadProduce)

module.exports = router;

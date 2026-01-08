const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { uploadProduce, getMyBids, getMyProduces, getRetailerById } = require("../controllers/farmer.controller");

router.use(requireAuth);
router.use(requireRole("FARMER"));

router.get("/test", (req, res) => {
  res.json({ message: "Farmer OK" });
});

router.post("/createProduce",uploadProduce)
router.get("/retailer/:id",getRetailerById )
router.get("/getMyProduces",getMyProduces)
router.get("/produce/:produceId/result",getMyBids)
module.exports = router;

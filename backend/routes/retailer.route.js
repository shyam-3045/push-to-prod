const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { getProduces, getWonBids, getFarmerForWonBid } = require("../controllers/retailer.controller");
const { placeBid, getRunningBids } = require("../controllers/bid.controller");

router.use(requireAuth);
router.use(requireRole("RETAILER"));

router.get("/running-bids",getRunningBids)
router.post("/bid",placeBid)
router.get("/getProduces",getProduces) // done
router.get("/myWonBids",getWonBids)
router.get("/test", (req, res) => {
  res.json({ message: "Retailer OK" });
});
router.get("/bids/:bidId/farmer",getFarmerForWonBid)
module.exports = router;

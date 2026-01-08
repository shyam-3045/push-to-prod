const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth.middleware");
const { getProduces, getWonBids, getFarmerForWonBid } = require("../controllers/retailer.controller");
const { placeBid, getRunningBids } = require("../controllers/bid.controller");

router.use(requireAuth);
router.use(requireRole("RETAILER"));

router.get("/running-bids",getRunningBids)
router.post("/bid",placeBid)
router.get("/getProduces",getProduces) 
router.get("/myWonBids",getWonBids)
router.get("/wonBid/:bidId/farmer",getFarmerForWonBid)


router.get("/test", (req, res) => {
  res.json({ message: "Retailer OK" });
});

module.exports = router;

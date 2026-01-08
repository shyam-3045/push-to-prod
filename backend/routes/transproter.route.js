const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/auth.middleware");

router.use(requireAuth);
router.use(requireRole("TRANSPORTER"));

router.get("/test", (req, res) => {
  res.json({ message: "Transporter OK" });
});

module.exports = router;

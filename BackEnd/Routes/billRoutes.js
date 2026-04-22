const express = require("express");
const { addBill, getBills, getRecentBills, getAverageStats } = require("../Controllers/billController");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

// Apply auth middleware to all bill routes
router.use(authMiddleware);

router.post("/add", addBill);
router.get("/", getBills);
router.get("/recent", getRecentBills);
router.get("/average", getAverageStats);

module.exports = router;

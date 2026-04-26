const express = require("express");
const router = express.Router();
const goldController = require("../Controllers/goldController");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/buy", authMiddleware, goldController.buyGold);
router.post("/sell", authMiddleware, goldController.sellGold);
router.get("/portfolio", authMiddleware, goldController.getPortfolio);

module.exports = router;

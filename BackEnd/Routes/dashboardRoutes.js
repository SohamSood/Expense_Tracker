const express = require("express");
const router = express.Router();
const dashboardController = require("../Controllers/dashboardController");
const authMiddleware = require("../Middleware/authMiddleware");

router.get("/summary", authMiddleware, dashboardController.getDashboardSummary);

module.exports = router;

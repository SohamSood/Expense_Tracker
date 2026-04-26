const express = require("express");
const router = express.Router();
const fdController = require("../Controllers/fdController");
const authMiddleware = require("../Middleware/authMiddleware");

// Public (or semi-public) calculation
router.post("/calculate", fdController.calculateFD);

// Protected storage routes
router.use(authMiddleware);
router.post("/save", fdController.saveFD);
router.get("/", fdController.getFDs);
router.delete("/:id", fdController.deleteFD);

module.exports = router;

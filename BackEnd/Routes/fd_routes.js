const express = require("express");
const router = express.Router();
const fdController = require("../Controllers/fdController");

router.post("/calculate", fdController.calculateFD);

module.exports = router;

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get all expenses");
});

router.post("/add", (req, res) => {
  res.send("Expense added");
});

module.exports = router;
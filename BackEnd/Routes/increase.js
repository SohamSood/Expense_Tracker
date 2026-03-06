const express = require("express");
const router = express.Router();

const data = require("../Data/sample.json");

router.get("/", (req, res) => {
    res.json(data.bills);
});

module.exports = router;
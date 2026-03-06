const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const router = express.Router();

const DB_PATH = path.join(__dirname, "../Data/sample.json");

router.get("/", async (req, res) => {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    const data = JSON.parse(raw);

    res.json({
      name: data.name,
      phone: data.phone,
      balance: data.balance
    });

  } catch (err) {
    res.status(500).json({ error: "Could not fetch user" });
  }
});

module.exports = router;
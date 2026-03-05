const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, "../Uploads");

router.get("/", (req, res) => {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Could not read uploads folder" });
    }

    const valid = files.filter((f) => /\.(pdf|png|jpg|jpeg)$/i.test(f));

    res.json({ files: valid });
  });
});

module.exports = router;
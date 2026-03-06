const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, "../Uploads");



// GET /api/receipts — list all valid files
router.get("/", async (req, res) => {
  try {
    const files = await fs.readdir(UPLOADS_DIR);

    const valid = files.filter((f) =>
      /\.(pdf|png|jpg|jpeg|txt)$/i.test(f)
    );

    res.json({ files: valid });
  } catch (err) {
    res.status(500).json({ error: "Could not read uploads folder" });
  }
});



// GET /api/receipts/text/:filename — parse a .txt bill file
router.get("/text/:filename", async (req, res) => {
  try {
    const filePath = path.join(UPLOADS_DIR, req.params.filename);

    const content = await fs.readFile(filePath, "utf8");

    const data = {};

    content.split("\n").forEach((line) => {
      const colonIndex = line.indexOf(":");        
      if (colonIndex === -1) return;                // skip blank lines or lines with no colon

      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();

      if (key && value) {
        data[key] = value;
      }
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Could not parse text file" });
  }
});



module.exports = router;
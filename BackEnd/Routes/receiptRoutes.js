const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const multer = require("multer");
const Bill = require("../Models/Bill");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

const UPLOADS_DIR = path.join(__dirname, "../Uploads");

// Ensure Uploads directory exists
const ensureUploadsDir = async () => {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
};
ensureUploadsDir();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Unique filename: timestamp + original name
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /\.(pdf|png|jpg|jpeg|txt)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, PNG, JPG, JPEG, TXT allowed."));
    }
  }
});

// GET /api/receipts — List all files
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

// POST /api/receipts/upload — Upload a file
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(201).json({
    message: "File uploaded successfully",
    filename: req.file.filename
  });
});

// GET /api/receipts/text/:filename — Parse a text file
router.get("/text/:filename", async (req, res) => {
  try {
    const filePath = path.join(UPLOADS_DIR, req.params.filename);
    const content = await fs.readFile(filePath, "utf8");
    const data = {};

    content.split("\n").forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) return;

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

// POST /api/receipts/save/:filename — Save one specific TXT as a bill
router.post("/save/:filename", async (req, res) => {
  try {
    const txtPath = path.join(UPLOADS_DIR, req.params.filename);
    const content = await fs.readFile(txtPath, "utf8");
    const parsed = {};

    content.split("\n").forEach(line => {
      const i = line.indexOf(":");
      if (i === -1) return;
      const key = line.slice(0, i).trim();
      const value = line.slice(i + 1).trim();
      parsed[key] = value;
    });

    const newBillData = {
      user: req.userId,
      type: parsed["Bill Type"] || "Other",
      date: parsed["Date"] || new Date().toISOString().split('T')[0],
      time: parsed["Time"] || new Date().toLocaleTimeString('en-US', { hour12: false }),
      amount: Number(parsed["Bill Amount"]) || 0,
      status: parsed["Status"] || "paid",
      items: [
        {
          name: parsed["Bill Type"] || "Other",
          price: Number(parsed["Bill Amount"]) || 0
        }
      ]
    };

    // Check for duplicate
    const exists = await Bill.findOne({
      user: req.userId,
      date: newBillData.date,
      amount: newBillData.amount,
      type: newBillData.type
    });

    if (exists) {
      return res.json({ message: "Duplicate bill skipped" });
    }

    const newBill = new Bill(newBillData);
    await newBill.save();

    res.json({ message: "Bill saved", bill: newBill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save bill" });
  }
});

// POST /api/receipts/save-all — Save all TXT files as bills
router.post("/save-all", async (req, res) => {
  try {
    const files = await fs.readdir(UPLOADS_DIR);
    const txtFiles = files.filter(f => /\.txt$/i.test(f));

    let saved = 0;
    let skipped = 0;

    for (const file of txtFiles) {
      const filePath = path.join(UPLOADS_DIR, file);
      const content = await fs.readFile(filePath, "utf8");
      const parsed = {};

      content.split("\n").forEach((line) => {
        const i = line.indexOf(":");
        if (i === -1) return;
        const key = line.slice(0, i).trim();
        const value = line.slice(i + 1).trim();
        parsed[key] = value;
      });

      const amount = Number(parsed["Bill Amount"]) || 0;
      const type = parsed["Bill Type"] || "Other";
      const date = parsed["Date"] || new Date().toISOString().slice(0,10);

      const exists = await Bill.findOne({
        user: req.userId,
        amount,
        type,
        date
      });

      if (exists) {
        skipped++;
        continue;
      }

      const newBill = new Bill({
        user: req.userId,
        type,
        date,
        time: parsed["Time"] || new Date().toTimeString().slice(0,5),
        amount,
        status: parsed["Status"] || "paid",
        items: [{ name: type, price: amount }]
      });

      await newBill.save();
      saved++;
    }

    res.json({ message: "processing finished", saved, skipped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not process bills" });
  }
});

module.exports = router;
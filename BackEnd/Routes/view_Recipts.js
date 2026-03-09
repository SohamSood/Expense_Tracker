const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, "../Uploads");
const DB_PATH = path.join(__dirname, "../Data/sample.json");

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

    const dbRaw = await fs.readFile(DB_PATH, "utf8");
    const db = JSON.parse(dbRaw);

    const newBill = {
      id: db.bills.length + 1,
      type: parsed["Bill Type"] || "Other",
      date: parsed["Date"],
      time: parsed["Time"],
      amount: Number(parsed["Bill Amount"]),
      status: parsed["Status"] || "paid",
      items: [
        {
          name: parsed["Bill Type"] || "Other",
          price: Number(parsed["Bill Amount"])
        }
      ]
    };

    const exists = db.bills.some(b =>
      b.date === newBill.date &&
      b.time === newBill.time &&
      b.amount === newBill.amount &&
      b.type === newBill.type
    );

    if (exists) {
      return res.json({
        message: "Duplicate bill skipped"
      });
    }

    db.bills.push(newBill);

    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));

    res.json({
      message: "Bill saved",
      bill: newBill
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save bill" });
  }
});





router.post("/save-all", async (req, res) => {
  try {

    const files = await fs.readdir(UPLOADS_DIR);
    const txtFiles = files.filter(f => /\.txt$/i.test(f));

    const dbRaw = await fs.readFile(DB_PATH, "utf8");
    const db = JSON.parse(dbRaw);

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

      const exists = db.bills.some(
        b => b.amount === amount && b.type === type
      );

      if (exists) {
        skipped++;
        continue;
      }

      const newBill = {
        id: db.bills.length + 1,
        type,
        date: parsed["Date"] || new Date().toISOString().slice(0,10),
        time: parsed["Time"] || new Date().toTimeString().slice(0,5),
        amount,
        status: parsed["Status"] || "paid",
        items: [
          {
            name: type,
            price: amount
          }
        ]
      };

      db.bills.push(newBill);
      saved++;
    }

    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));

    res.json({
      message: "processing finished",
      saved,
      skipped
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not process bills" });
  }
});



module.exports = router;
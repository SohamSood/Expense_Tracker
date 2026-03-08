const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "..", "Data", "sample.json");

function readData() {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

router.get("/", (req, res) => {
  const data = readData();
  const bills = data.bills;
  let total = 0;

  bills.forEach((bill) => {
    total += bill.amount;
  });

  res.json({
    bills,
    totalamount: total,
    remaining: data.balance - total,
  });
});

router.get("/recent", (req, res) => {
  const data = readData();
  const bills = data.bills;

  const sorted = [...bills]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const formatted = sorted.map((bill) => ({
    name: bill.type,
    id: bill.id,
    amount: bill.amount,
    date: bill.date,
  }));

  res.json(formatted);
});

module.exports = router;

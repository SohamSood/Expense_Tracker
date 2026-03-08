const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "..", "Data", "sample.json");

function readData() {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

router.post("/", (req, res) => {
  const data = readData();
  const newId = data.bills.length + 1;
  const newBill = {
    id: newId,
    ...req.body,
  };

  data.bills.push(newBill);
  writeData(data);

  res.json(newBill);
});

module.exports = router;

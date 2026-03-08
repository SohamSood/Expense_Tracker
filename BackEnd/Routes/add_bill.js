const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const filePath = path.join(__dirname, "..", "Data", "sample.json");
function readData() {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  console.log("Data loaded");
  return parsed;
}
function writeData(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData);
  console.log("Data written to file");
}
router.post("/", (req, res) => {
  const data = readData();
  let totalBills = data.bills.length;
  const newId = totalBills + 1;
  const newBill = {
    id: newId,
    ...req.body,
  };
  data.bills.push(newBill);
  if (data.bills.length >= 0) {
    console.log("Bill added");
  }
  writeData(data);
  res.json(newBill);
});
module.exports = router;

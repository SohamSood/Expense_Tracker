const express = require("express");
const {
  addBill,
  getBills,
  getRecentBills,
  getAverageStats,
  getBillById,
  deleteBill,
} = require("../Controllers/billController");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

router.post("/",        addBill);       // POST /bills
router.post("/add",     addBill);       // alias kept for BillForm.js
router.get("/recent",   getRecentBills);
router.get("/average",  getAverageStats);
router.get("/",         getBills);      // GET /bills?page&limit&search&type
router.get("/:id",      getBillById);
router.delete("/:id",   deleteBill);

module.exports = router;

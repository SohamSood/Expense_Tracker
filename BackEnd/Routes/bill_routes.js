const express = require("express");
const router = express.Router();

const data = require("../Data/sample.json");

router.get("/", (req, res) => {
    const bills = data.bills;
    let total = 0;
    bills.forEach(bill=>{
        total += bill.amount;
    })
    res.json({
        bills:bills,
        totalamount : total,
        remaining: data.balance-total
    })
});

router.get("/recent", (req, res) => {

  const bills = data.bills;

  const sorted = bills
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const formatted = sorted.map((bill, index) => ({
    name: bill.type,
    id: bill.id,
    amount: bill.amount,
    date: bill.date
  }));

  res.json(formatted);

});
module.exports = router;


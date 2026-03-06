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

module.exports = router;
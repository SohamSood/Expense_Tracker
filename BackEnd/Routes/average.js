const express = require("express");
const router = express.Router();

const data = require("../Data/sample.json");

router.get("/", (req, res) => {
    const bills = data.bills;
    let monthlyMap = {};
    let total = 0;
    bills.forEach(bill=>{
        const month = bill.date.slice(0,7); 
        if(!monthlyMap[month]){
            monthlyMap[month] = {sum:0,count:0};
        }
        monthlyMap[month].sum += bill.amount;
        monthlyMap[month].count += 1;
    }) 
    res.json(monthlyMap);
});

module.exports = router;
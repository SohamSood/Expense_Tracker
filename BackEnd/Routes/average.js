const express = require("express");
const router = express.Router();

const data = require("../Data/sample.json");

// router.get("/", (req, res) => {
//     const bills = data.bills;
//     let monthlyMap = {};
//     let total = 0;
//     bills.forEach(bill=>{
//         const month = bill.date.slice(0,7); 
//         if(!monthlyMap[month]){
//             monthlyMap[month] = {sum:0,count:0};
//         }
//         monthlyMap[month].sum += bill.amount;
//         monthlyMap[month].count += 1;
//     }) 
//     res.json(monthlyMap);
// });


router.get("/", (req,res)=>{

    const bills = data.bills;

    // min max date
    let minDate = bills[0].date;
    let maxDate = bills[0].date;

    bills.forEach(bill=>{
        if(bill.date < minDate) minDate = bill.date;
        if(bill.date > maxDate) maxDate = bill.date;
    });

    // generate months
    let months = [];

    let start = new Date(minDate);
    let end = new Date(maxDate);

    start.setDate(1);

    while(start <= end){
        months.push(start.toISOString().slice(0,7));
        start.setMonth(start.getMonth()+1);
    }

    // monthly map
    let monthlyMap = {};

    bills.forEach(bill=>{
        let month = bill.date.slice(0,7);

        if(!monthlyMap[month]){
            monthlyMap[month] = {sum:0,count:0};
        }

        monthlyMap[month].sum += bill.amount;
        monthlyMap[month].count++;
    });

    // build result
    let result = [];

    for(let i=0;i<months.length;i++){

        let month = months[i];
        let avgsum = 0;

        if(monthlyMap[month]){
            sum = monthlyMap[month].sum;
        }

        let prev = 0;
        let diff = 0;

        if(i>0){
            prev = result[i-1].sum;
            diff = avgsum - prev;
        }

        result.push({
            month: month,
            sum: avgsum,
            previous: prev,
            difference: diff
        });

    }

    res.json(result);

});

module.exports = router;
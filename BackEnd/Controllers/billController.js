const Bill = require("../Models/Bill");

exports.addBill = async (req, res) => {
  try {
    const { type, amount, date, time, status, items } = req.body;

    const newBill = new Bill({
      user: req.userId,
      type: type || "General",
      amount,
      date: date || new Date().toISOString().split('T')[0],
      time: time || new Date().toLocaleTimeString('en-US', { hour12: false }),
      status: status || "paid",
      items: items || []
    });

    await newBill.save();
    res.status(201).json(newBill);
  } catch (error) {
    console.error("Error adding bill:", error);
    res.status(500).json({ message: "Server error while adding bill" });
  }
};

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.userId }).sort({ date: -1 });
    
    let total = 0;
    bills.forEach(bill => total += bill.amount);

    res.json({
      bills,
      totalamount: total,
    });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Server error while fetching bills" });
  }
};

exports.getRecentBills = async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.userId }).sort({ date: -1, _id: -1 }).limit(6);
    res.json(bills);
  } catch (error) {
    console.error("Error fetching recent bills:", error);
    res.status(500).json({ message: "Server error while fetching recent bills" });
  }
};

exports.getAverageStats = async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.userId });

    if (bills.length === 0) {
      return res.json([]);
    }

    // Generate monthly map
    let monthlyMap = {};

    bills.forEach(bill => {
      if (!bill.date) return;
      let month = bill.date.slice(0, 7); // YYYY-MM
      
      if (!monthlyMap[month]) {
        monthlyMap[month] = { sum: 0, count: 0 };
      }
      
      monthlyMap[month].sum += bill.amount;
      monthlyMap[month].count++;
    });

    // Convert map to sorted array
    const sortedMonths = Object.keys(monthlyMap).sort();
    
    let result = [];
    for (let i = 0; i < sortedMonths.length; i++) {
      let month = sortedMonths[i];
      let sum = monthlyMap[month].sum;
      let prev = i > 0 ? result[i - 1].sum : 0;
      let diff = i > 0 ? sum - prev : 0;

      result.push({
        month: month,
        sum: sum,
        previous: prev,
        difference: diff
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Error calculating average stats:", error);
    res.status(500).json({ message: "Server error calculating stats" });
  }
};

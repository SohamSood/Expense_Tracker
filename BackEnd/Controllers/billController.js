const Bill = require("../Models/Bill");

exports.addBill = async (req, res) => {
  try {
    const { type, amount, date, time, status, items } = req.body;
    const newBill = new Bill({
      user: req.userId,
      type: type || "General",
      amount,
      date: date || new Date().toISOString().split("T")[0],
      time: time || new Date().toLocaleTimeString("en-US", { hour12: false }),
      status: status || "paid",
      items: items || [],
    });
    await newBill.save();
    res.status(201).json(newBill);
  } catch (error) {
    res.status(500).json({ message: "Server error while adding bill" });
  }
};

// GET /bills?page=1&limit=8&search=&type=
exports.getBills = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 8);
    const search = req.query.search || "";
    const type   = req.query.type   || "";

    const query = { user: req.userId };
    if (type && type !== "all") query.type = { $regex: type, $options: "i" };
    if (search) {
      query.$or = [
        { type:   { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Bill.countDocuments(query);
    const bills = await Bill.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalAmount = await Bill.aggregate([
      { $match: { user: require("mongoose").Types.ObjectId.createFromHexString(req.userId) } },
      { $group: { _id: null, sum: { $sum: "$amount" } } },
    ]);

    res.json({
      bills,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      totalAmount: totalAmount[0]?.sum || 0,
    });
  } catch (error) {
    console.error("getBills error:", error);
    res.status(500).json({ message: "Server error while fetching bills" });
  }
};

// GET /bills/recent — dashboard recent activity
exports.getRecentBills = async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching recent bills" });
  }
};

// GET /bills/average — dashboard stats
// Returns { totalSum, avgMonthly, monthCount }
exports.getAverageStats = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const result = await Bill.aggregate([
      { $match: { user: mongoose.Types.ObjectId.createFromHexString(req.userId) } },
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] }, // YYYY-MM
          sum: { $sum: "$amount" },
        },
      },
    ]);

    const monthCount = result.length;
    const totalSum = result.reduce((acc, r) => acc + r.sum, 0);

    res.json({
      totalSum,
      avgMonthly: monthCount ? totalSum / monthCount : 0,
      monthCount,
      months: result,
    });
  } catch (error) {
    console.error("getAverageStats error:", error);
    res.status(500).json({ message: "Server error calculating stats" });
  }
};

// GET /bills/:id
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findOne({ _id: req.params.id, user: req.userId });
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /bills/:id
exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json({ message: "Bill deleted", _id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

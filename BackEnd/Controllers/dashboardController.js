const Bill = require("../Models/Bill");
const GoldTransaction = require("../Models/GoldTransaction");
const FD = require("../Models/FD");

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Total Expenses (Bills)
    const bills = await Bill.find({ user: userId });
    const totalExpenses = bills.reduce((sum, b) => sum + b.amount, 0);

    // 2. Gold Portfolio
    const goldTxs = await GoldTransaction.find({ userId });
    const totalGoldQuantity = goldTxs.reduce((sum, tx) => sum + tx.goldQuantity, 0);
    const totalGoldInvested = goldTxs.reduce((sum, tx) => sum + tx.amountInvested, 0);
    
    // We'll use a base price of 6000 if we can't get live, 
    // but the frontend will override with real-time socket price anyway.
    const estimatedGoldValue = totalGoldQuantity * 6000; 

    // 3. FD Portfolio
    const fds = await FD.find({ userId });
    const totalFDPrincipal = fds.reduce((sum, fd) => sum + fd.principal, 0);
    const totalFDMaturity = fds.reduce((sum, fd) => sum + fd.maturityAmount, 0);

    // 4. Combined Activity (Latest 8 items)
    const recentBills = await Bill.find({ user: userId }).sort({ createdAt: -1 }).limit(4);
    const recentGold = await GoldTransaction.find({ userId }).sort({ createdAt: -1 }).limit(2);
    const recentFD = await FD.find({ userId }).sort({ createdAt: -1 }).limit(2);

    const activities = [
      ...recentBills.map(b => ({ ...b._doc, category: 'expense', title: b.type, date: b.date })),
      ...recentGold.map(g => ({ ...g._doc, category: 'gold', title: g.goldQuantity > 0 ? 'Bought Gold' : 'Sold Gold', date: g.createdAt, amount: Math.abs(g.amountInvested) })),
      ...recentFD.map(f => ({ ...f._doc, category: 'fd', title: 'New FD Opened', date: f.createdAt, amount: f.principal }))
    ].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)).slice(0, 8);

    res.status(200).json({
      summary: {
        totalExpenses,
        totalGoldQuantity,
        totalGoldInvested,
        totalFDPrincipal,
        totalFDMaturity,
        netWorth: (estimatedGoldValue + totalFDMaturity) - totalExpenses
      },
      activities
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

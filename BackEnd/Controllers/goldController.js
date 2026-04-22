const GoldTransaction = require("../Models/GoldTransaction");

exports.buyGold = async (req, res) => {
  try {
    const { amountInvested, livePrice } = req.body;
    
    if (!amountInvested || !livePrice || amountInvested <= 0 || livePrice <= 0) {
      return res.status(400).json({ message: "Invalid amount or price" });
    }

    const goldQuantity = amountInvested / livePrice;

    const transaction = await GoldTransaction.create({
      userId: req.userId,
      amountInvested,
      goldQuantity,
      priceAtPurchase: livePrice,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const transactions = await GoldTransaction.find({ userId: req.userId });

    let totalInvested = 0;
    let totalGoldQuantity = 0;

    transactions.forEach((tx) => {
      totalInvested += tx.amountInvested;
      totalGoldQuantity += tx.goldQuantity;
    });

    res.status(200).json({
      totalInvested,
      totalGoldQuantity,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

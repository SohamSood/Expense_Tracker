const GoldTransaction = require("../Models/GoldTransaction");

exports.buyGold = async (req, res) => {
  try {
    const { amountInvested, livePrice } = req.body;
    
    if (!amountInvested || !livePrice || amountInvested <= 0 || livePrice <= 0) {
      return res.status(400).json({ message: "Invalid amount or price" });
    }

    const goldQuantity = amountInvested / livePrice;

    await GoldTransaction.create({
      userId: req.userId,
      amountInvested,
      goldQuantity,
      priceAtPurchase: livePrice,
    });

    res.status(201).json({ message: "Gold purchased successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.sellGold = async (req, res) => {
  try {
    const { goldQuantity, livePrice } = req.body;

    if (!goldQuantity || !livePrice || goldQuantity <= 0 || livePrice <= 0) {
      return res.status(400).json({ message: "Invalid quantity or price" });
    }

    // Check balance
    const transactions = await GoldTransaction.find({ userId: req.userId });
    const totalOwned = transactions.reduce((sum, tx) => sum + tx.goldQuantity, 0);

    if (goldQuantity > totalOwned) {
      return res.status(400).json({ message: "Insufficient gold balance" });
    }

    // Create a negative transaction to represent the sale
    await GoldTransaction.create({
      userId: req.userId,
      amountInvested: -(goldQuantity * livePrice),
      goldQuantity: -goldQuantity,
      priceAtPurchase: livePrice,
    });

    res.status(200).json({ message: "Gold sold successfully" });
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

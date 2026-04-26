const FD = require("../Models/FD");

exports.calculateFD = (req, res) => {
  try {
    const { principal, rate, timeYears, frequency = 1 } = req.body;

    if (!principal || !rate || !timeYears) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const r = rate / 100;
    const n = frequency;
    const t = timeYears;
    const P = principal;

    // A = P(1 + r/n)^(nt)
    const maturityAmount = P * Math.pow(1 + r / n, n * t);
    const interestEarned = maturityAmount - P;

    res.status(200).json({
      principal: P,
      rate,
      timeYears,
      frequency,
      maturityAmount: Number(maturityAmount.toFixed(2)),
      interestEarned: Number(interestEarned.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.saveFD = async (req, res) => {
  try {
    const { principal, rate, timeYears, frequency, maturityAmount, interestEarned } = req.body;
    
    const newFD = await FD.create({
      userId: req.userId,
      principal,
      rate,
      timeYears,
      frequency,
      maturityAmount,
      interestEarned
    });

    res.status(201).json(newFD);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getFDs = async (req, res) => {
  try {
    const fds = await FD.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(fds);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteFD = async (req, res) => {
  try {
    const fd = await FD.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!fd) return res.status(404).json({ message: "FD not found" });
    res.status(200).json({ message: "FD record deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

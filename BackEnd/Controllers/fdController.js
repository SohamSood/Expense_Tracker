exports.calculateFD = (req, res) => {
  try {
    const { principal, rate, timeYears, frequency = 1 } = req.body;

    if (!principal || !rate || !timeYears) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const r = rate / 100;
    const n = frequency; // Number of times interest applied per time period (default 1 for annual compounding if standard)
    const t = timeYears;
    const P = principal;

    // A = P(1 + r/n)^(nt)
    const maturityAmount = P * Math.pow(1 + r / n, n * t);
    const interestEarned = maturityAmount - P;

    res.status(200).json({
      principal: P,
      maturityAmount: Number(maturityAmount.toFixed(2)),
      interestEarned: Number(interestEarned.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

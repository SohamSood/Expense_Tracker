const mongoose = require("mongoose");

const fdSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    principal: {
      type: Number,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    timeYears: {
      type: Number,
      required: true,
    },
    frequency: {
      type: Number,
      required: true,
      default: 1,
    },
    maturityAmount: {
      type: Number,
      required: true,
    },
    interestEarned: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FD", fdSchema);

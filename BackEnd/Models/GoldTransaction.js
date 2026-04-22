const mongoose = require("mongoose");

const goldTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amountInvested: {
      type: Number,
      required: true,
    },
    goldQuantity: {
      type: Number,
      required: true,
    },
    priceAtPurchase: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GoldTransaction", goldTransactionSchema);

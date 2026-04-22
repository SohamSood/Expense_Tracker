const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true, // e.g. 'Food', 'Shopping', 'Utility'
  },
  date: {
    type: String,
    required: true, // ISO string or YYYY-MM-DD
  },
  time: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "paid",
  },
  items: [
    {
      name: String,
      price: Number,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Bill", billSchema);

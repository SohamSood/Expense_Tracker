const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const PORT = 5001;

//routes endpoints
const receiptRoutes = require("./Routes/view_Recipts");
const billRoutes = require("./Routes/bill_Routes");
const averageRoutes = require("./Routes/average");

app.use(cors());
app.use(express.json());

//routes
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use("/api/receipts", receiptRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/average",averageRoutes);

//direct endpoints
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});


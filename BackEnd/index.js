const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const PORT = 5001;

//routes endpoints
const receiptRoutes = require("./Routes/view_Recipts");

app.use(cors());
app.use(express.json());

//routes
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use("/api/receipts", receiptRoutes);

//direct endpoints
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});


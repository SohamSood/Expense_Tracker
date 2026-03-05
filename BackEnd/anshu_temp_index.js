const express = require("express");
const path = require("path");
const cors = require("cors");

const receiptRoutes = require("./Routes/anshu_temp_routes");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

app.use("/api/receipts", receiptRoutes);

app.get("/", (req, res) => {
  res.send("Server working");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
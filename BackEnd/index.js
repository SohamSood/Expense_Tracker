require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const PORT = process.env.PORT || 5001;

const connectDB = require("./config/db");
const User = require("./Models/User");

connectDB();

cron.schedule("0 0 * * *", async () => {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const result = await User.deleteMany({ isDeleted: true, deletedAt: { $lte: cutoff } });
  if (result.deletedCount > 0) {
    console.log(`[Cron] Permanently deleted ${result.deletedCount} expired account(s)`);
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true
  }
});

const authRoutes = require("./Routes/auth_routes_new");
const goldRoutes = require("./Routes/gold_routes");
const fdRoutes = require("./Routes/fd_routes");
const billRoutes = require("./Routes/billRoutes");
const receiptRoutes = require("./Routes/receiptRoutes");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/gold", goldRoutes);
app.use("/api/fd", fdRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/dashboard", require("./Routes/dashboardRoutes"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/admin/stats", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const billCount = await require("./Models/Bill").countDocuments();
    res.render("admin", { userCount, billCount });
  } catch (err) {
    res.status(500).send("Error rendering admin page");
  }
});

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Running");
});

const goldNamespace = io.of("/gold");
let currentGoldPrice = 6000;

goldNamespace.on("connection", (socket) => {
  socket.emit("priceUpdate", { price: currentGoldPrice, timestamp: new Date() });
});

setInterval(() => {
  const fluctuation = Math.floor(Math.random() * 11) - 5;
  currentGoldPrice += fluctuation;
  goldNamespace.emit("priceUpdate", { price: currentGoldPrice, timestamp: new Date() });
}, 3000); // every 3 seconds

server.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});


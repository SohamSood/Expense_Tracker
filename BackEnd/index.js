// const express = require("express");
// const app = express();

//  const  port = 5000;

// app.get("/", (req, res) => {
//   res.send("Expense Tracker Backend Running");
// });

// app.listen(port, () => {
//   console.log(`Server running on port 5000 ${port}`);
// });



// //login logout server
// //--created a server using express
// const express = require("express");
// const app = express();

// //--used a middleware in express which hepls to convert the data into java script object
// app.use(express.json());

// //importing routes
// const expenseRoutes = require("./Routes/expense_routes");
// const loginRoutes = require("./Routes/login_routes");
// const logoutRoutes = require("./Routes/logout_routes");

// //using routes
// app.use("/expenses", expenseRoutes);
// app.use("/auth", loginRoutes);
// app.use("/auth", logoutRoutes);

// app.listen(5000, () => {
//     console.log("Server running on port 5000");
// });

// const path = require("path");
// const cors = require("cors");
// const PORT = 5001;

// //routes endpoints
// const receiptRoutes = require("./Routes/view_Recipts");
// const billRoutes = require("./Routes/bill_Routes");
// const averageRoutes = require("./Routes/average");
// const decreaseRoutes = require("./Routes/decrease");
// const increaseRoutes = require("./Routes/increase");
// const userRoutes = require("./Routes/user");



// app.use(cors());
// app.use(express.json());
// app.use(express.json());

// //routes
// app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
// app.use("/api/receipts", receiptRoutes);
// app.use("/api/bills", billRoutes);
// app.use("/api/average",averageRoutes);
// app.use("/api/decrease",decreaseRoutes);
// app.use("/api/increase",increaseRoutes);
// app.use("/api/user", userRoutes);

// //direct endpoints
// app.get("/", (req, res) => {
//   res.send("Expense Tracker Backend Running");
// });

// app.listen(PORT, () => {
//   console.log(`Server running on Port: ${PORT}`);
// });






const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const PORT = 5001;

const connectDB = require("./config/db");
const User = require("./Models/User");

// MongoDB Connection
connectDB();

// Cron: permanently delete accounts soft-deleted more than 30 days ago
// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const result = await User.deleteMany({ isDeleted: true, deletedAt: { $lte: cutoff } });
  if (result.deletedCount > 0) {
    console.log(`[Cron] Permanently deleted ${result.deletedCount} expired account(s)`);
  }
});

// HTTP & Socket.IO Server Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // default vite port
    methods: ["GET", "POST"],
    credentials: true
  }
});

//routes endpoints
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

//direct endpoints
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Running");
});

// Socket.io namespace for Gold live price
const goldNamespace = io.of("/gold");
let currentGoldPrice = 6000;

goldNamespace.on("connection", (socket) => {
  // Send current price immediately on connection
  socket.emit("priceUpdate", { price: currentGoldPrice, timestamp: new Date() });
});

setInterval(() => {
  // fluctuate price slightly between -5 and +5
  const fluctuation = Math.floor(Math.random() * 11) - 5;
  currentGoldPrice += fluctuation;
  goldNamespace.emit("priceUpdate", { price: currentGoldPrice, timestamp: new Date() });
}, 3000); // every 3 seconds

server.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});


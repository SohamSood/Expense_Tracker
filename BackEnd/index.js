// const express = require("express");
// const app = express();

//  const  port = 5000;

// app.get("/", (req, res) => {
//   res.send("Expense Tracker Backend Running");
// });

// app.listen(port, () => {
//   console.log(`Server running on port 5000 ${port}`);
// });



//login logout server
//--created a server using express
const express = require("express");
const app = express();
<<<<<<< HEAD

//--used a middleware in express which hepls to convert the data into java script object
app.use(express.json());

//importing routes
const expenseRoutes = require("./Routes/expense_routes");
const loginRoutes = require("./Routes/login_routes");
const logoutRoutes = require("./Routes/logout_routes");

//using routes
app.use("/expenses", expenseRoutes);
app.use("/auth", loginRoutes);
app.use("/auth", logoutRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});







=======
const path = require("path");
const cors = require("cors");
const PORT = 5001;

//routes endpoints
const receiptRoutes = require("./Routes/view_Recipts");
const billRoutes = require("./Routes/bill_Routes");
const averageRoutes = require("./Routes/average");
const decreaseRoutes = require("./Routes/decrease");
const increaseRoutes = require("./Routes/increase");
const userRoutes = require("./Routes/user");



app.use(cors());
app.use(express.json());

//routes
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use("/api/receipts", receiptRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/average",averageRoutes);
app.use("/api/decrease",decreaseRoutes);
app.use("/api/increase",increaseRoutes);
app.use("/api/user", userRoutes);

//direct endpoints
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Running");
});

app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});
>>>>>>> 78ff4f76020f91c0ae9620c44d8b5ce72917ef43


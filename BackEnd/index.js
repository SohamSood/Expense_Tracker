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









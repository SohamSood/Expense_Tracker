const express = require("express");
const app = express();
const  port = 5001;
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend Running");
});

app.listen(port, () => {
  console.log(`Server running on port 5000 ${port}`);
});
const express = require("express");
const router = express.Router();

// login routing
router.post("/login", (req, res) => {

 const { email, password } = req.body;

 if(email === "ExpenseTracker26@gmail.com" && password === "1234"){
     res.send("Login successfully");
 } else {
     res.status(401).send("Invalid credentials");
 }

});

router.post("/logout", (req, res) => {
    res.send("Logout successful");
});

module.exports = router;
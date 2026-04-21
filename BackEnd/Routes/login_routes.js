const express = require("express");
const router = express.Router();

// login routing
router.post("/login", (req, res) => {

 const { email, password } = req.body;

 if(email === "ExpenseTracker26@gmail.com" && password === "1234"){
     res.status(200).json({ message: "Login successfully" });
 } else {
     res.status(401).json({ message: "Invalid credentials" });
 }

});

router.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
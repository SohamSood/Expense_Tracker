const express = require("express");
const router = express.Router();

// logout routing
router.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout successfully" });
});

module.exports = router;
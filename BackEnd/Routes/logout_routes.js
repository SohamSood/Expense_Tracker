const express = require("express");
const router = express.Router();

// logout routing
router.post("/logout", (req, res) => {
    res.send("Logout successfully");
});

module.exports = router;
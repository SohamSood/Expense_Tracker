const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/me", authMiddleware, authController.getUserProfile);
router.get("/profile", authMiddleware, authController.getUserProfile);
router.put("/profile", authMiddleware, authController.updateUserProfile);
router.put("/change-password", authMiddleware, authController.changePassword);
router.delete("/account", authMiddleware, authController.deleteUser);

module.exports = router;

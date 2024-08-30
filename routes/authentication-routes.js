const express = require("express");
const router = express.Router();
const { register, login, me, getUserById } = require("../controllers/authentication-controller");

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

// 
router.get("/user", getUserById);

// Forgot Password route
router.post("/forgot-password", (req, res) => {
  console.log("Forgot Password endpoint hit");
  // Burada şifre sıfırlama talebi işlemini gerçekleştirin
  res.send("Forgot Password endpoint");
});

// Reset Password route
router.post("/reset-password", (req, res) => {
  console.log("Reset Password endpoint hit");
  // Burada şifre sıfırlama işlemini gerçekleştirin
  res.send("Reset Password endpoint");
});

router.get("/me", me);

module.exports = router;

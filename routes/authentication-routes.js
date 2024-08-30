const express = require("express");
const router = express.Router();
const { register } = require("../controllers/authentication-controller");

// Register route
router.post("/register", register);

// Login route
router.post("/login", (req, res) => {
  console.log("Login endpoint hit");
  // Burada kullanıcı giriş işlemini gerçekleştirin
  res.send("Login endpoint");
});

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

router.get("/me", (req, res) => {
  const token = req.headers.authorization; // bearer token
  res.send("Me endpoint");
});

module.exports = router;

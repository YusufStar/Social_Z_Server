// app.js
const { config } = require("dotenv");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const authenticationRoutes = require("./routes/authentication-routes");

// Uygulama başlat
const app = express();
config();

// Güvenlik önlemleri

// Helmet, HTTP başlıklarını güvenli bir şekilde ayarlar
app.use(helmet());

// CORS, Cross-Origin Resource Sharing ayarlarını yapar
app.use(
  cors({
    origin: "*", // İzin verilen origin
    methods: ["GET", "POST", "PUT", "DELETE"], // İzin verilen HTTP yöntemleri
  })
);

// Rate limiter, API çağrılarının belirli bir sınırını koyar
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Her 15 dakikada 100 isteğe izin ver
  message: "Too many requests, please try again later.",
});

app.use(limiter);

// JSON ve URL-encoded veri işleme
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use routes
app.use("/auth", authenticationRoutes);

// Hata yakalama middleware'i
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Bir hata oluştu!");
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});

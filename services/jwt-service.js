const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// JWT'yi oluşturmak için bir fonksiyon
const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "30 days" });
};

// JWT'yi doğrulamak için bir fonksiyon
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

// Token'ın kalan süresini hesaplamak için bir fonksiyon
const getRemainingTime = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      throw new Error("Invalid token");
    }
    const now = Math.floor(Date.now() / 1000);
    const remainingTime = decoded.exp - now;
    return remainingTime > 0 ? remainingTime : 0;
  } catch (err) {
    throw new Error("Error decoding token");
  }
};

// Token'ın geçerlilik süresini kontrol etmek için bir fonksiyon
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      throw new Error("Invalid token");
    }
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (err) {
    throw new Error("Error decoding token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
  getRemainingTime,
  isTokenExpired,
};

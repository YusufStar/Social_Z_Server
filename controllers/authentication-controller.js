const prisma = require("../services/prisma-service");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../services/jwt-service");

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields.",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email already in use.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    const accessToken = generateToken({
      id: newUser.id,
    });

    res.status(201).json({
      status: true,
      message: "User registered successfully.",
      user: newUser,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({
        status: false,
        message: "Missing required fields.",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(200).json({
        status: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(200).json({
        status: false,
        message: "Invalid email or password.",
      });
    }

    const accessToken = generateToken({
      id: user.id,
    });

    res.status(200).json({
      status: true,
      message: "Login successful.",
      user,
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
};

const me = async (req, res) => {
  try {
    // Authorization başlığından token'ı al
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(200).json({
        status: false,
        message: "Authorization header missing or invalid format.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Token'ı doğrula ve payload'ı al
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.id) {
      return res.status(200).json({
        status: false,
        message: "Invalid or expired token.",
      });
    }

    // Kullanıcıyı ID ile bul
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(200).json({
        status: false,
        message: "User not found.",
      });
    }

    // Kullanıcı bilgilerini döndür
    res.status(200).json({
      status: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error.");
  }
};

module.exports = { register, login, me };

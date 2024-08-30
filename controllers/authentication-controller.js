const prisma = require("../services/prisma-service");
const bcrypt = require("bcrypt");
const { generateToken } = require("../services/jwt-service");

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

module.exports = { register };

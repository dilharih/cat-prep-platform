const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

async function registerUser(data) {
  const name = data.name?.trim();
  const email = data.email?.trim().toLowerCase();
  const { password } = data;

  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    success: true,
    message: "User registered successfully",
    token: createToken(user),
    user: formatUser(user),
  };
}

async function loginUser(data) {
  const email = data.email?.trim().toLowerCase();
  const { password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return {
    success: true,
    message: "Login successful",
    token: createToken(user),
    user: formatUser(user),
  };
}

module.exports = {
  loginUser,
  registerUser,
};

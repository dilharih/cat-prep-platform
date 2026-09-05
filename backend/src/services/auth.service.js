const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const jwt = require("jsonwebtoken");

const BCRYPT_ROUNDS = 12;
const MAX_PASSWORD_LENGTH = 128;

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

function validateCredentials(email, password) {
  if (!email || !password) {
    throw new Error("Invalid email or password");
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    throw new Error("Invalid email or password");
  }
}

async function registerUser(data) {
  const name = data.name?.trim();
  const email = data.email?.trim().toLowerCase();
  const { password } = data;

  if (!name || !email || !password) {
    throw new Error("Please provide all required fields");
  }

  if (name.length > 100 || email.length > 254 || password.length > MAX_PASSWORD_LENGTH) {
    throw new Error("Invalid registration details");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Unable to create account with these details");
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    success: true,
    message: "Account created successfully",
    token: createToken(user),
    user: formatUser(user),
  };
}

async function loginUser(data) {
  const email = data.email?.trim().toLowerCase();
  const { password } = data;

  validateCredentials(email, password);

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

async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user ? formatUser(user) : null;
}

module.exports = {
  loginUser,
  registerUser,
  getUserById,
};

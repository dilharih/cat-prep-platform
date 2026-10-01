const {
  loginUser,
  registerUser,
  getUserById,
} = require("../services/auth.service");
const {
  setSessionCookie,
  clearCookie,
  sessionCookieName,
} = require("../utils/auth.utils");

const SAFE_REGISTRATION_ERRORS = new Set([
  "Please provide all required fields",
  "Invalid registration details",
  "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and symbol",
  "Unable to create account with these details",
]);

async function login(req, res) {
  try {
    const result = await loginUser(req.body || {});
    setSessionCookie(res, result.token);

    res.status(200).json({
      success: true,
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
}

async function register(req, res) {
  try {
    const result = await registerUser(req.body || {});
    setSessionCookie(res, result.token);

    res.status(201).json({
      success: true,
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    console.error("Registration error:", error);

    const message = SAFE_REGISTRATION_ERRORS.has(error.message)
      ? error.message
      : "Unable to create account";

    res.status(400).json({
      success: false,
      message,
    });
  }
}

async function me(req, res) {
  const user = await getUserById(req.user.userId);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }

  return res.status(200).json({
    success: true,
    user,
  });
}

function logout(req, res) {
  clearCookie(res, sessionCookieName);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

module.exports = {
  login,
  register,
  me,
  logout,
};

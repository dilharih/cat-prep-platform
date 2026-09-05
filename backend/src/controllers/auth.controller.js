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
    res.status(400).json({
      success: false,
      message: error.message || "Unable to create account",
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

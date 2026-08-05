const {
  loginUser,
  registerUser,
} = require("../services/auth.service");

async function login(req, res) {
  try {
    const result = await loginUser(req.body);

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}

async function register(req, res) {
  try {
    const result = await registerUser(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  login,
  register,
};
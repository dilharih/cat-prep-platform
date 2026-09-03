const { googleLoginUser } = require("../services/google-auth.service");

async function googleLogin(req, res) {
  try {
    const result = await googleLoginUser(req.body?.idToken);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  googleLogin,
};

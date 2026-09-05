const { googleLoginUser } = require("../services/google-auth.service");
const { setSessionCookie } = require("../utils/auth.utils");

async function googleLogin(req, res) {
  try {
    const result = await googleLoginUser(req.body?.idToken);
    setSessionCookie(res, result.token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unable to sign in with Google",
    });
  }
}

module.exports = {
  googleLogin,
};

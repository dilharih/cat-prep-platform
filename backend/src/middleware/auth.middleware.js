const jwt = require("jsonwebtoken");
const { getSessionToken } = require("../utils/auth.utils");

function authenticate(req, res, next) {
  try {
    const token = getSessionToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (!decoded.userId || typeof decoded.userId !== "string") {
      throw new Error("Invalid session payload");
    }

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }
}

module.exports = authenticate;

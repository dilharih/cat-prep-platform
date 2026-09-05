const express = require("express");

const {
  login,
  register,
  me,
  logout,
} = require("../controllers/auth.controller");
const { googleLogin } = require("../controllers/google-auth.controller");
const authenticate = require("../middleware/auth.middleware");
const { requireCsrf } = require("../utils/auth.utils");
const { createRateLimiter } = require("../middleware/security.middleware");

const router = express.Router();

router.post("/login", createRateLimiter("login"), requireCsrf, login);
router.post("/register", createRateLimiter("signup"), requireCsrf, register);
router.post("/google", createRateLimiter("login"), requireCsrf, googleLogin);
router.get("/me", authenticate, me);
router.post("/logout", authenticate, requireCsrf, logout);

module.exports = router;

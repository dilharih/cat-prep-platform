const express = require("express");

const {
  login,
  register,
} = require("../controllers/auth.controller");
const { googleLogin } = require("../controllers/google-auth.controller");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/google", googleLogin);

module.exports = router;

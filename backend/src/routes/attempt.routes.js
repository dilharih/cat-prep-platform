const express = require("express");

const authenticate = require("../middleware/auth.middleware");

const {
  getMyAttemptsController,
} = require("../controllers/attempt.controller");

const router = express.Router();

router.get(
  "/my",
  authenticate,
  getMyAttemptsController
);

module.exports = router;
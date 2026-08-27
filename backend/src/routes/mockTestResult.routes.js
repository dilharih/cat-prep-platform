const express = require("express");

const {
  getMockTestResult,
} = require("../controllers/mockTestResult.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

// Get a user's mock test result
router.get(
  "/:attemptId",
  authenticate,
  getMockTestResult
);

module.exports = router;
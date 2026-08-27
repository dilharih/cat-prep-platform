const express = require("express");

const {
  submitMockTestController,
} = require("../controllers/mockTestAttempt.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

// Submit a completed mock test
router.post(
  "/:mockTestId/submit",
  authenticate,
  submitMockTestController
);

module.exports = router;
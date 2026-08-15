const express = require("express");

const {
  getMockTest,
} = require("../controllers/mockTest.controller");

const router = express.Router();

// Get a mock test with its questions
router.get("/:id", getMockTest);

module.exports = router;
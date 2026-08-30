const express = require("express");

const {
  getMockTest,
  getMockTestsList,
} = require("../controllers/mockTest.controller");

const router = express.Router();

// Get all available mock tests
router.get("/", getMockTestsList);

// Get one mock test with its questions
router.get("/:id", getMockTest);

module.exports = router;
const express = require("express");

const {
  getAllQuestions,
  getSingleQuestion,
  submitQuestionAttempt,
} = require("../controllers/question.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

// GET all questions
router.get("/", getAllQuestions);

// GET single question
router.get("/:id", getSingleQuestion);

// POST attempt — protected
router.post(
  "/:id/attempt",
  authenticate,
  submitQuestionAttempt
);

module.exports = router;
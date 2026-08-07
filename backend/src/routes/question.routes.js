const express = require("express");

const {
  getAllQuestions,
  getSingleQuestion,
} = require("../controllers/question.controller");

const router = express.Router();

router.get("/", getAllQuestions);

router.get("/:id", getSingleQuestion);

module.exports = router;
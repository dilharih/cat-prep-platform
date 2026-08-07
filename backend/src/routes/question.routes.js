const express = require("express");

const controller = require("../controllers/question.controller");

console.log("Question Controller:", controller);

const router = express.Router();

router.get("/", controller.getAllQuestions);

router.get("/:id", controller.getSingleQuestion);

router.post("/:id/attempt", controller.submitQuestionAttempt);

module.exports = router;
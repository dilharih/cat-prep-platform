const {
  getQuestions,
  getQuestionById,
  submitAttempt,
} = require("../services/question.service");

async function getAllQuestions(req, res) {
  try {
    const questions = await getQuestions(req.query);

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getSingleQuestion(req, res) {
  try {
    const question = await getQuestionById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function submitQuestionAttempt(req, res) {
  try {
    const { selectedAnswer, timeTaken } = req.body;

    const result = await submitAttempt(
  req.user.userId,
  req.params.id,
  selectedAnswer,
  timeTaken
);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

console.log("Exporting submitQuestionAttempt:", typeof submitQuestionAttempt);

module.exports = {
  getAllQuestions,
  getSingleQuestion,
  submitQuestionAttempt,
};
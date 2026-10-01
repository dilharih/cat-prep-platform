const {
  submitMockTest,
} = require("../services/mockTestAttempt.service");

async function submitMockTestController(req, res) {
  try {
    const { answers, timeTaken } = req.body;

    if (
      !answers ||
      typeof answers !== "object" ||
      Array.isArray(answers)
    ) {
      return res.status(400).json({
        success: false,
        message: "Answers are required",
      });
    }

    const result = await submitMockTest(
      req.user.userId,
      req.params.mockTestId,
      answers,
      timeTaken ?? 0
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Mock test submission error:", error);

    if (
      error.message === "Invalid time taken" ||
      error.message === "Mock test already submitted" ||
      error.message === "Invalid answer submission" ||
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message:
          error.message === "Invalid time taken"
            ? "Invalid time taken"
            : error.message === "Invalid answer submission"
              ? "Invalid answer submission"
              : "Mock test already submitted",
        data: error.attemptId
          ? { attemptId: error.attemptId }
          : undefined,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  submitMockTestController,
};

const {
  getMockTestAttemptById,
} = require("../services/mockTestAttempt.service");

async function getMockTestResult(req, res) {
  try {
    const attempt = await getMockTestAttemptById(
      req.user.userId,
      req.params.attemptId
    );

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Mock test result not found",
      });
    }

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    console.error(
      "Failed to get mock test result:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getMockTestResult,
};
const {
  getMyAttempts,
} = require("../services/attempt.service");

async function getMyAttemptsController(req, res) {
  try {
    const attempts = await getMyAttempts(req.user.userId);

    res.status(200).json({
      success: true,
      data: attempts,
    });
  } catch (error) {
    console.error("Failed to get attempts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

module.exports = {
  getMyAttemptsController,
};

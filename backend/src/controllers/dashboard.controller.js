const {
  getDashboardStats,
} = require("../services/dashboard.service");

async function getStats(req, res) {
  try {
    const stats = await getDashboardStats(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getStats,
};
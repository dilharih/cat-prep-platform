const { getDashboardStats } = require("../services/dashboard.service");

async function getStats(req, res) {
  try {
    // Later we'll extract the userId from the JWT.
    const stats = await getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getStats,
};
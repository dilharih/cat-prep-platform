const {
  getHealthStatus,
  checkDatabaseReadiness,
} = require("../services/health.service");

function getHealth(req, res) {
  const response = getHealthStatus();

  res.status(200).json(response);
}

async function getReadiness(req, res) {
  const databaseReady = await checkDatabaseReadiness();

  if (!databaseReady) {
    return res.status(503).json({
      success: false,
      message: "Service temporarily unavailable",
    });
  }

  return res.status(200).json({
    success: true,
    message: "CAT Prep API is ready",
  });
}

module.exports = {
  getHealth,
  getReadiness,
};

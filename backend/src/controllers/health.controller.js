const {
  getHealthStatus,
} = require("../services/health.service");

function getHealth(req, res) {
  const response = getHealthStatus();

  res.status(200).json(response);
}

module.exports = {
  getHealth,
};
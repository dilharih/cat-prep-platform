const prisma = require("../config/prisma");

async function getDashboardStats(userId) {
  // For now, return placeholder values.
  // Later these will be calculated from the database.
  return {
    questionsSolved: 0,
    accuracy: 0,
    mockTests: 0,
    studyStreak: 0,
  };
}

module.exports = {
  getDashboardStats,
};
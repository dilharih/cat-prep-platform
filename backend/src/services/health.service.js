const prisma = require("../config/prisma");

function getHealthStatus() {
  return {
    success: true,
    message: "CAT Prep API is running 🚀",
  };
}

async function checkDatabaseReadiness() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database readiness check failed:", error);
    return false;
  }
}

module.exports = {
  getHealthStatus,
  checkDatabaseReadiness,
};

const prisma = require("../config/prisma");

async function getDashboardStats(userId) {
  // Get all attempts made by this user
  const attempts = await prisma.attempt.findMany({
    where: {
      userId,
    },
    select: {
      isCorrect: true,
    },
  });

  const questionsSolved = attempts.length;

  const correctAnswers = attempts.filter(
    (attempt) => attempt.isCorrect
  ).length;

  const accuracy =
    questionsSolved > 0
      ? Math.round((correctAnswers / questionsSolved) * 100)
      : 0;

  // Count mock test attempts
  const mockTests = await prisma.mockTestAttempt.count({
    where: {
      userId,
    },
  });

  return {
    questionsSolved,
    accuracy,
    mockTests,
    studyStreak: 0,
  };
}

module.exports = {
  getDashboardStats,
};
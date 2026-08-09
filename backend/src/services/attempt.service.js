const prisma = require("../config/prisma");

async function getMyAttempts(userId) {
  const attempts = await prisma.attempt.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      questionId: true,
      selectedAnswer: true,
      isCorrect: true,
      status: true,
      timeTaken: true,
      createdAt: true,
    },
  });

  return attempts;
}

module.exports = {
  getMyAttempts,
};
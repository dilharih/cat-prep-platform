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

    question: {
  select: {
    id: true,
    year: true,
    slot: true,
    section: true,
    topic: true,
    type: true,
    question: true,
    optionA: true,
    optionB: true,
    optionC: true,
    optionD: true,
    correctAnswer: true,
    explanation: true,
  },
},
  },
});

  return attempts;
}

module.exports = {
  getMyAttempts,
};
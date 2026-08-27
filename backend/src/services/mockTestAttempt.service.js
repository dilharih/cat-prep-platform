const prisma = require("../config/prisma");

async function submitMockTest(
  userId,
  mockTestId,
  answers,
  timeTaken
) {
  const mockTest = await prisma.mockTest.findUnique({
    where: {
      id: mockTestId,
    },
    include: {
      questions: {
        include: {
          question: true,
        },
      },
    },
  });

  if (!mockTest) {
    throw new Error("Mock test not found");
  }

  let score = 0;
  let correctAnswers = 0;

  for (const item of mockTest.questions) {
    const question = item.question;

    const selectedAnswer = answers[question.id];

    if (!selectedAnswer) {
      continue;
    }

    if (selectedAnswer === question.correctAnswer) {
      score += question.marks;
      correctAnswers++;
    } else {
      score -= question.negativeMarks;
    }
  }

  const totalQuestions = mockTest.questions.length;

  const answeredQuestions = Object.keys(answers).length;

  const accuracy =
    answeredQuestions > 0
      ? (correctAnswers / answeredQuestions) * 100
      : 0;

  const mockTestAttempt =
    await prisma.mockTestAttempt.create({
      data: {
        userId,
        mockTestId,
        score,
        accuracy,
        timeTaken,
      },
    });

  return {
    mockTestAttempt,
    score,
    accuracy: Math.round(accuracy),
    correctAnswers,
    answeredQuestions,
    totalQuestions,
  };
}

async function getMockTestAttemptById(
  userId,
  attemptId
) {
  const attempt =
    await prisma.mockTestAttempt.findFirst({
      where: {
        id: attemptId,
        userId,
      },
      include: {
        mockTest: {
          select: {
            id: true,
            title: true,
            duration: true,
            year: true,
            slot: true,
          },
        },
      },
    });

  return attempt;
}

module.exports = {
  submitMockTest,
  getMockTestAttemptById,
};
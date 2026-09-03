const prisma = require("../config/prisma");

async function getMyAttempts(userId) {
  const [attempts, mockTestAttempts] = await Promise.all([
    prisma.attempt.findMany({
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
    }),
    prisma.mockTestAttempt.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        mockTest: {
          select: {
            id: true,
            title: true,
            year: true,
            slot: true,
          },
        },
        answers: {
          select: {
            id: true,
            questionId: true,
            selectedAnswer: true,
            isCorrect: true,
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
        },
      },
    }),
  ]);

  const mockQuestionAttempts = mockTestAttempts.flatMap((mockTestAttempt) =>
    mockTestAttempt.answers.map((answer) => ({
      id: `mock-${mockTestAttempt.id}-${answer.id}`,
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      isCorrect: answer.isCorrect,
      status: answer.selectedAnswer ? "ANSWERED" : "UNANSWERED",
      timeTaken: 0,
      createdAt: mockTestAttempt.createdAt,
      source: "MOCK_TEST",
      mockTestId: mockTestAttempt.mockTest.id,
      mockTestTitle: mockTestAttempt.mockTest.title,
      question: answer.question,
    }))
  );

  return [...attempts, ...mockQuestionAttempts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

module.exports = {
  getMyAttempts,
};

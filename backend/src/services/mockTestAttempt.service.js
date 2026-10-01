const prisma = require("../config/prisma");

const MAX_ANSWER_LENGTH = 100;

async function submitMockTest(
  userId,
  mockTestId,
  answers,
  timeTaken
) {
  const mockTest =
    await prisma.mockTest.findUnique({
      where: {
        id: mockTestId,
        isPublished: true,
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
          include: {
            question: true,
          },
        },
      },
    });

  if (!mockTest) {
    throw new Error("Mock test not found");
  }

  const normalizedTimeTaken = Number(timeTaken);

  if (
    !Number.isInteger(normalizedTimeTaken) ||
    normalizedTimeTaken < 0 ||
    normalizedTimeTaken > mockTest.duration * 60
  ) {
    throw new Error("Invalid time taken");
  }

  const questionIds = new Set(
    mockTest.questions.map((item) => item.question.id)
  );
  const submittedQuestionIds = Object.keys(answers);

  if (
    submittedQuestionIds.some(
      (questionId) => !questionIds.has(questionId)
    )
  ) {
    throw new Error("Invalid answer submission");
  }

  if (
    submittedQuestionIds.some(
      (questionId) => {
        const answer = answers[questionId];

        return (
          answer !== null &&
          answer !== "" &&
          (typeof answer !== "string" ||
            answer.length > MAX_ANSWER_LENGTH)
        );
      }
    )
  ) {
    throw new Error("Invalid answer submission");
  }

  const existingAttempt =
    await prisma.mockTestAttempt.findFirst({
      where: {
        userId,
        mockTestId,
      },
      select: {
        id: true,
      },
    });

  if (existingAttempt) {
    throw new Error("Mock test already submitted");
  }

  let score = 0;
  let correctAnswers = 0;
  let answeredQuestions = 0;

  /*
   * Store answer records here.
   * We create these only for questions
   * that belong to this mock test.
   */
  const answerRecords = [];

  for (const item of mockTest.questions) {
    const question = item.question;

    const selectedAnswer =
      answers[question.id];

    // ---------------------------------------------
    // UNANSWERED
    // ---------------------------------------------

    if (
      selectedAnswer === undefined ||
      selectedAnswer === null ||
      selectedAnswer === ""
    ) {
      answerRecords.push({
        questionId: question.id,
        selectedAnswer: null,
        isCorrect: false,
      });

      continue;
    }

    answeredQuestions++;

    // ---------------------------------------------
    // CORRECT
    // ---------------------------------------------

    if (
      selectedAnswer ===
      question.correctAnswer
    ) {
      score += question.marks;
      correctAnswers++;

      answerRecords.push({
        questionId: question.id,
        selectedAnswer,
        isCorrect: true,
      });

      continue;
    }

    // ---------------------------------------------
    // WRONG
    // ---------------------------------------------

    answerRecords.push({
      questionId: question.id,
      selectedAnswer,
      isCorrect: false,
    });

    // MCQ gets negative marking.
    // TITA does not get negative marking.
    if (question.type === "MCQ") {
      score -= question.negativeMarks;
    }
  }

  const totalQuestions =
    mockTest.questions.length;

  const accuracy =
    answeredQuestions > 0
      ? (correctAnswers / answeredQuestions) *
        100
      : 0;

  // ---------------------------------------------
  // CREATE ATTEMPT + ANSWERS
  // ---------------------------------------------

  const mockTestAttempt =
    await prisma.mockTestAttempt.create({
      data: {
        userId,
        mockTestId,
        score,
        accuracy,
        timeTaken: normalizedTimeTaken,

        answers: {
          create: answerRecords,
        },
      },

      include: {
        answers: true,
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

        answers: {
          include: {
            question: {
              select: {
                id: true,
                year: true,
                slot: true,
                section: true,
                topic: true,
                type: true,
                passage: {
                  select: {
                    id: true,
                    title: true,
                    content: true,
                  },
                },
                question: true,
                optionA: true,
                optionB: true,
                optionC: true,
                optionD: true,
                correctAnswer: true,
                explanation: true,
                marks: true,
                negativeMarks: true,
              },
            },
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

const prisma = require("../config/prisma");

const MAX_QUESTION_PAGE_SIZE = 50;

async function getQuestions(filters = {}) {
  const { section, year, topic, page = 1, limit = 20 } = filters;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    throw new Error("Invalid page");
  }

  if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > MAX_QUESTION_PAGE_SIZE) {
    throw new Error(`Limit must be between 1 and ${MAX_QUESTION_PAGE_SIZE}`);
  }

  const where = {};

  if (section) where.section = section;
  if (year) where.year = Number(year);
  if (topic) where.topic = topic;

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
    orderBy: [
      { year: "desc" },
      { section: "asc" }
    ],
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
      marks: true,
      negativeMarks: true,
    },
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
    }),
    prisma.question.count({ where }),
  ]);

  return {
    questions,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
}

async function getQuestionById(id) {
  return prisma.question.findUnique({
    where: {
      id
    },
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
      marks: true,
      negativeMarks: true,
    },
  });
}

async function submitAttempt(
  userId,
  questionId,
  selectedAnswer,
  timeTaken
) {
  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  // Check if the user has already submitted this question
  const existingAttempt = await prisma.attempt.findFirst({
    where: {
      userId,
      questionId,
      status: "ANSWERED",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existingAttempt) {
    return {
      attempt: existingAttempt,
      isCorrect: existingAttempt.isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      alreadySubmitted: true,
    };
  }

  const isCorrect =
    question.correctAnswer === selectedAnswer;

  const attempt = await prisma.attempt.create({
    data: {
      userId,
      questionId,
      selectedAnswer,
      isCorrect,
      timeTaken,
    },
  });

  return {
    attempt,
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    alreadySubmitted: false,
  };
}

module.exports = {
  getQuestions,
  getQuestionById,
  submitAttempt,
};
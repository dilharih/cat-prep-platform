const prisma = require("../config/prisma");

async function getQuestions(filters = {}) {
  const { section, year, topic } = filters;

  const where = {};

  if (section) where.section = section;
  if (year) where.year = Number(year);
  if (topic) where.topic = topic;

  const questions = await prisma.question.findMany({
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
  });

  return questions;
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
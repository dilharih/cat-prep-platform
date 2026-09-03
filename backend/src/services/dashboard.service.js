const prisma = require("../config/prisma");

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function getDashboardStats(userId) {
  // Standalone question attempts.
  const attempts = await prisma.attempt.findMany({
    where: {
      userId,
      status: "ANSWERED",
    },
    select: {
      isCorrect: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Answers submitted as part of completed mock tests are stored in
  // MockTestAnswer, not Attempt, so they must also be included in the
  // dashboard totals.
  const mockTestAnswers = await prisma.mockTestAnswer.findMany({
    where: {
      attempt: {
        userId,
      },
      selectedAnswer: {
        not: null,
      },
    },
    select: {
      isCorrect: true,
      attempt: {
        select: {
          createdAt: true,
        },
      },
    },
  });

  // =========================
  // QUESTIONS ATTEMPTED
  // =========================

  const questionsAttempted =
    attempts.length + mockTestAnswers.length;

  // =========================
  // ACCURACY
  // =========================

  const correctAnswers =
    attempts.filter((attempt) => attempt.isCorrect).length +
    mockTestAnswers.filter((answer) => answer.isCorrect).length;

  const wrongAnswers = questionsAttempted - correctAnswers;

  const accuracy =
    questionsAttempted > 0
      ? Math.round((correctAnswers / questionsAttempted) * 100)
      : 0;

  // =========================
  // MOCK TESTS
  // =========================

  const mockTests = await prisma.mockTestAttempt.count({
    where: {
      userId,
    },
  });

  // =========================
  // STUDY STREAK
  // =========================

  // A study day is any day on which the user answered at least one
  // standalone question or at least one question inside a mock test.
  const studyDays = new Set([
    ...attempts.map((attempt) =>
      getLocalDateKey(new Date(attempt.createdAt))
    ),
    ...mockTestAnswers.map((answer) =>
      getLocalDateKey(new Date(answer.attempt.createdAt))
    ),
  ]);

  let studyStreak = 0;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const todayKey = getLocalDateKey(currentDate);
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getLocalDateKey(yesterday);

  // A current streak can start today or continue from yesterday.
  if (studyDays.has(todayKey)) {
    studyStreak = 1;
  } else if (studyDays.has(yesterdayKey)) {
    studyStreak = 1;
    currentDate.setDate(currentDate.getDate() - 1);
  } else {
    return {
      questionsAttempted,
      correctAnswers,
      wrongAnswers,
      accuracy,
      mockTests,
      studyStreak,
    };
  }

  while (true) {
    currentDate.setDate(currentDate.getDate() - 1);
    const previousDayKey = getLocalDateKey(currentDate);

    if (!studyDays.has(previousDayKey)) {
      break;
    }

    studyStreak++;
  }

  return {
    questionsAttempted,
    correctAnswers,
    wrongAnswers,
    accuracy,
    mockTests,
    studyStreak,
  };
}

module.exports = {
  getDashboardStats,
};

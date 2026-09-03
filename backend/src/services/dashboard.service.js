const prisma = require("../config/prisma");

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function getDashboardStats(userId) {
  // Get all answered question attempts
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

  // =========================
  // QUESTIONS SOLVED
  // =========================

  const questionsSolved = attempts.length;

  // =========================
  // ACCURACY
  // =========================

  const correctAnswers = attempts.filter(
    (attempt) => attempt.isCorrect
  ).length;

  const wrongAnswers = questionsSolved - correctAnswers;

  const accuracy =
    questionsSolved > 0
      ? Math.round((correctAnswers / questionsSolved) * 100)
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

  // Use calendar dates in the server's local timezone instead of UTC.
  // This prevents attempts around midnight from being assigned to the
  // wrong day and incorrectly breaking the streak.
  const studyDays = new Set(
    attempts.map((attempt) => getLocalDateKey(new Date(attempt.createdAt)))
  );

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
      questionsSolved,
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
    questionsSolved,
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

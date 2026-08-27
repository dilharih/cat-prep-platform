const prisma = require("../config/prisma");

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

  const wrongAnswers =
  questionsSolved - correctAnswers;

  const accuracy =
    questionsSolved > 0
      ? Math.round(
          (correctAnswers / questionsSolved) * 100
        )
      : 0;

  // =========================
  // MOCK TESTS
  // =========================

  const mockTests =
    await prisma.mockTestAttempt.count({
      where: {
        userId,
      },
    });

  // =========================
  // STUDY STREAK
  // =========================

  const studyDays = new Set();

  for (const attempt of attempts) {
    const date = new Date(attempt.createdAt);

    const day = date.toISOString().split("T")[0];

    studyDays.add(day);
  }

  let studyStreak = 0;

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const todayString = today
    .toISOString()
    .split("T")[0];

  const yesterday = new Date(today);

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  const yesterdayString = yesterday
    .toISOString()
    .split("T")[0];

  // Streak must start today or yesterday
  let currentDate;

  if (studyDays.has(todayString)) {
    currentDate = today;
  } else if (studyDays.has(yesterdayString)) {
    currentDate = yesterday;
  } else {
    studyStreak = 0;

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
    const dateString = currentDate
      .toISOString()
      .split("T")[0];

    if (!studyDays.has(dateString)) {
      break;
    }

    studyStreak++;

    const previousDate =
      new Date(currentDate);

    previousDate.setDate(
      previousDate.getDate() - 1
    );

    currentDate = previousDate;
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
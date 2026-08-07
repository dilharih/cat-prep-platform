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
    ]
  });

  return questions;
}

async function getQuestionById(id) {
  return prisma.question.findUnique({
    where: {
      id
    }
  });
}

module.exports = {
  getQuestions,
  getQuestionById,
};
const prisma = require("../config/prisma");

const VALID_SECTIONS = new Set(["VARC", "DILR", "QA"]);
const VALID_TYPES = new Set(["MCQ", "TITA"]);

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function validateQuestionData(data, { partial = false } = {}) {
  if (!partial || data.section !== undefined) {
    if (!VALID_SECTIONS.has(data.section)) throw validationError("Section must be VARC, DILR, or QA");
  }
  if (!partial || data.type !== undefined) {
    if (!VALID_TYPES.has(data.type)) throw validationError("Question type must be MCQ or TITA");
  }
  if (!partial || data.question !== undefined) {
    if (typeof data.question !== "string" || data.question.trim().length < 1 || data.question.trim().length > 10000) throw validationError("Question text is required and must be at most 10000 characters");
  }
  if (!partial || data.correctAnswer !== undefined) {
    if (typeof data.correctAnswer !== "string" || data.correctAnswer.trim().length < 1 || data.correctAnswer.trim().length > 500) throw validationError("Correct answer is required");
  }
  if (!partial || data.topic !== undefined) {
    if (typeof data.topic !== "string" || data.topic.trim().length < 1 || data.topic.trim().length > 200) throw validationError("Topic is required");
  }
  if (!partial || data.year !== undefined) {
    if (!Number.isInteger(data.year) || data.year < 1990 || data.year > 2100) throw validationError("Year must be between 1990 and 2100");
  }
  if (!partial || data.slot !== undefined) {
    if (!Number.isInteger(data.slot) || data.slot < 1 || data.slot > 3) throw validationError("Slot must be between 1 and 3");
  }
  if (data.marks !== undefined && (!Number.isInteger(data.marks) || data.marks < 0 || data.marks > 100)) throw validationError("Marks must be between 0 and 100");
  if (data.negativeMarks !== undefined && (!Number.isInteger(data.negativeMarks) || data.negativeMarks < 0 || data.negativeMarks > 100)) throw validationError("Negative marks must be between 0 and 100");
  if (data.passageContent !== undefined && data.passageContent !== null && (typeof data.passageContent !== "string" || data.passageContent.length > 30000)) throw validationError("Passage must be at most 30000 characters");
  if (data.explanation !== undefined && data.explanation !== null && (typeof data.explanation !== "string" || data.explanation.length > 10000)) throw validationError("Explanation must be at most 10000 characters");
  if (data.type === "MCQ" && !partial) {
    const options = [data.optionA, data.optionB, data.optionC, data.optionD];
    if (options.some((option) => typeof option !== "string" || option.trim().length === 0)) throw validationError("All four options are required for MCQ questions");
  }
}

function buildQuestionData(data, { partial = false } = {}) {
  const result = {};
  const stringFields = ["question", "topic", "correctAnswer", "optionA", "optionB", "optionC", "optionD", "explanation"];
  for (const field of stringFields) {
    if (!partial || data[field] !== undefined) result[field] = data[field] === null ? null : data[field].trim();
  }
  if (!partial || data.section !== undefined) result.section = data.section;
  if (!partial || data.type !== undefined) result.type = data.type;
  if (!partial || data.year !== undefined) result.year = data.year;
  if (!partial || data.slot !== undefined) result.slot = data.slot;
  if (!partial || data.marks !== undefined) result.marks = data.marks ?? 3;
  if (!partial || data.negativeMarks !== undefined) result.negativeMarks = data.negativeMarks ?? 1;
  return result;
}

async function ensureMockTest(mockTestId) {
  const mockTest = await prisma.mockTest.findUnique({ where: { id: mockTestId }, select: { id: true, year: true, slot: true } });
  if (!mockTest) {
    const error = new Error("Mock test not found");
    error.statusCode = 404;
    throw error;
  }
  return mockTest;
}

async function getMockTestQuestions(mockTestId) {
  await ensureMockTest(mockTestId);
  return prisma.mockTestQuestion.findMany({ where: { mockTestId }, orderBy: { order: "asc" }, include: { question: { include: { passage: true } } } });
}

async function createQuestionForMockTest(mockTestId, data) {
  const mockTest = await ensureMockTest(mockTestId);
  const mergedData = { ...data, year: data.year ?? mockTest.year, slot: data.slot ?? mockTest.slot };
  validateQuestionData(mergedData);
  const questionData = buildQuestionData(mergedData);

  return prisma.$transaction(async (tx) => {
    let passageId = null;
    if (data.passageContent?.trim()) {
      const passage = await tx.passage.create({ data: { title: data.passageTitle?.trim() || null, content: data.passageContent.trim() } });
      passageId = passage.id;
    }
    const question = await tx.question.create({ data: { ...questionData, passageId } });
    const last = await tx.mockTestQuestion.findFirst({ where: { mockTestId }, orderBy: { order: "desc" }, select: { order: true } });
    await tx.mockTestQuestion.create({ data: { mockTestId, questionId: question.id, order: (last?.order ?? -1) + 1 } });
    return tx.question.findUnique({ where: { id: question.id }, include: { passage: true } });
  });
}

async function updateQuestion(questionId, data) {
  validateQuestionData(data, { partial: true });
  const existing = await prisma.question.findUnique({ where: { id: questionId }, include: { passage: true } });
  if (!existing) {
    const error = new Error("Question not found");
    error.statusCode = 404;
    throw error;
  }
  return prisma.$transaction(async (tx) => {
    await tx.question.update({ where: { id: questionId }, data: buildQuestionData(data, { partial: true }) });
    if (data.passageContent !== undefined || data.passageTitle !== undefined) {
      if (existing.passageId) {
        if (data.passageContent?.trim()) {
          await tx.passage.update({ where: { id: existing.passageId }, data: {
            ...(data.passageContent !== undefined ? { content: data.passageContent.trim() } : {}),
            ...(data.passageTitle !== undefined ? { title: data.passageTitle?.trim() || null } : {}),
          } });
        } else {
          await tx.question.update({ where: { id: questionId }, data: { passageId: null } });
          await tx.passage.delete({ where: { id: existing.passageId } });
        }
      } else if (data.passageContent?.trim()) {
        const passage = await tx.passage.create({ data: { title: data.passageTitle?.trim() || null, content: data.passageContent.trim() } });
        await tx.question.update({ where: { id: questionId }, data: { passageId: passage.id } });
      }
    }
    return tx.question.findUnique({ where: { id: questionId }, include: { passage: true } });
  });
}

async function removeQuestionFromMockTest(mockTestId, questionId) {
  await ensureMockTest(mockTestId);
  const link = await prisma.mockTestQuestion.findUnique({ where: { mockTestId_questionId: { mockTestId, questionId } } });
  if (!link) {
    const error = new Error("Question is not part of this mock test");
    error.statusCode = 404;
    throw error;
  }
  await prisma.$transaction(async (tx) => {
    await tx.mockTestQuestion.delete({ where: { id: link.id } });
    await tx.mockTestQuestion.updateMany({ where: { mockTestId, order: { gt: link.order } }, data: { order: { decrement: 1 } } });
  });
}

module.exports = { getMockTestQuestions, createQuestionForMockTest, updateQuestion, removeQuestionFromMockTest };

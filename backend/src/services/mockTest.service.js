const prisma = require("../config/prisma");

async function getMockTestById(mockTestId) {
  const mockTest = await prisma.mockTest.findFirst({
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
              marks: true,
              negativeMarks: true,
              passage: {
                select: {
                  id: true,
                  title: true,
                  content: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return mockTest;
}

const MAX_MOCK_TEST_PAGE_SIZE = 50;

async function getMockTests(filters = {}) {
  const page = Number(filters.page || 1);
  const limit = Number(filters.limit || 20);

  if (!Number.isInteger(page) || page < 1) {
    throw new Error("Page must be a positive integer");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_MOCK_TEST_PAGE_SIZE) {
    throw new Error(`Limit must be an integer between 1 and ${MAX_MOCK_TEST_PAGE_SIZE}`);
  }

  const where = { isPublished: true };

  if (filters.year !== undefined) {
    const year = Number(filters.year);
    if (!Number.isInteger(year)) throw new Error("Year must be an integer");
    where.year = year;
  }

  if (filters.slot !== undefined) {
    const slot = Number(filters.slot);
    if (!Number.isInteger(slot)) throw new Error("Slot must be an integer");
    where.slot = slot;
  }

  const [mockTests, total] = await Promise.all([
    prisma.mockTest.findMany({
  const mockTests = await prisma.mockTest.findMany({
      where,
      orderBy: [
      {
        year: "desc",
      },
      {
        slot: "asc",
      },
    ],
    select: {
      id: true,
      title: true,
      duration: true,
      year: true,
      slot: true,
      isOfficial: true,
      isPublished: true,
      createdAt: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  return mockTests;
}

module.exports = {
  getMockTestById,
  getMockTests,
};

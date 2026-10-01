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

async function getMockTests() {
  const mockTests = await prisma.mockTest.findMany({
    where: {
      isPublished: true,
    },
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

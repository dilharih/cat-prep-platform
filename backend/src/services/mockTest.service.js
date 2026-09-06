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
            include: {
              passage: true,
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

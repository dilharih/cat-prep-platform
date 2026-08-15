const prisma = require("../config/prisma");

async function getMockTestById(mockTestId) {
  const mockTest = await prisma.mockTest.findUnique({
    where: {
      id: mockTestId,
    },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
        include: {
          question: true,
        },
      },
    },
  });

  return mockTest;
}

module.exports = {
  getMockTestById,
};
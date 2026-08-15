const prisma = require("./src/config/prisma");

const MOCK_TEST_ID = "cmsu0rsiz0000zhgcvy63npzx";

async function main() {
  const questions = await prisma.question.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (questions.length === 0) {
    throw new Error("No questions found in the database.");
  }

  await prisma.mockTestQuestion.createMany({
    data: questions.map((question, index) => ({
      mockTestId: MOCK_TEST_ID,
      questionId: question.id,
      order: index + 1,
    })),
    skipDuplicates: true,
  });

  console.log(
    `Added ${questions.length} questions to the mock test.`
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
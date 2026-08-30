const prisma = require("./src/config/prisma");

async function main() {
  const questions = await prisma.question.findMany({
    select: {
      id: true,
      question: true,
      section: true,
      year: true,
      topic: true,
    },
  });

  console.log(
    JSON.stringify(questions, null, 2)
  );
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
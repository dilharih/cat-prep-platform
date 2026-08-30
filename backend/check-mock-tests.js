const prisma = require("./src/config/prisma");

async function main() {
  const mockTests = await prisma.mockTest.findMany({
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
      year: true,
      slot: true,
      duration: true,
      isOfficial: true,
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  console.log(
    JSON.stringify(mockTests, null, 2)
  );
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
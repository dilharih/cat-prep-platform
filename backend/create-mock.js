const prisma = require("./src/config/prisma");

async function main() {
  const mockTest = await prisma.mockTest.create({
    data: {
      title: "CAT 2024 Mock Test",
      duration: 120,
      year: 2024,
      slot: 1,
      isOfficial: false,
    },
  });

  console.log("Mock Test created:");
  console.log(mockTest);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
const prisma = require("./src/config/prisma");

async function main() {
  const mockTest = await prisma.mockTest.findFirst({
    where: {
      year: 2024,
      slot: 1,
    },
  });

  if (!mockTest) {
    console.log("CAT 2024 Slot 1 not found.");
    return;
  }

  const updated = await prisma.mockTest.update({
    where: {
      id: mockTest.id,
    },
    data: {
      title: "CAT 2024 Slot 1",
    },
  });

  console.log(
    `Renamed successfully: ${updated.title}`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
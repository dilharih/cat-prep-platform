const prisma = require("./src/config/prisma");

const mockTests = [
  {
    title: "CAT 2024 Slot 1",
    year: 2024,
    slot: 1,
    duration: 120,
    isOfficial: false,
  },
  {
    title: "CAT 2024 Slot 2",
    year: 2024,
    slot: 2,
    duration: 120,
    isOfficial: false,
  },
  {
    title: "CAT 2024 Slot 3",
    year: 2024,
    slot: 3,
    duration: 120,
    isOfficial: false,
  },
];

async function main() {
  for (const mockTest of mockTests) {
    const existing =
      await prisma.mockTest.findFirst({
        where: {
          year: mockTest.year,
          slot: mockTest.slot,
        },
      });

    if (existing) {
      console.log(
        `Already exists: ${mockTest.title}`
      );

      continue;
    }

    const created =
      await prisma.mockTest.create({
        data: mockTest,
      });

    console.log(
      `Created: ${created.title} (${created.id})`
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
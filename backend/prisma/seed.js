const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(
    __dirname,
    "../data/questions/cat-2024-slot1.json"
  );

  const questions = JSON.parse(fs.readFileSync(filePath, "utf8"));

  console.log(`Importing ${questions.length} questions...`);

  for (const question of questions) {
    await prisma.question.create({
      data: question,
    });
  }

  console.log("✅ Questions imported successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
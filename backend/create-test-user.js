const bcrypt = require("bcrypt");
const prisma = require("./src/config/prisma");

async function main() {
  const email = "test@catprep.com";
  const password = "Test@1234";

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    console.log("Test user already exists.");
    console.log("Email:", existingUser.email);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: "Dil Test",
      email,
      password: hashedPassword,
    },
  });

  console.log("Test user created successfully.");
  console.log("ID:", user.id);
  console.log("Email:", email);
  console.log("Password:", password);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
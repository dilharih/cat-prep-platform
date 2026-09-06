const prisma = require("../config/prisma");

function validateMockTestData(data, { partial = false } = {}) {
  const errors = [];

  if (!partial || data.title !== undefined) {
    if (typeof data.title !== "string" || data.title.trim().length < 3 || data.title.trim().length > 200) {
      errors.push("Title must be between 3 and 200 characters");
    }
  }

  if (!partial || data.duration !== undefined) {
    if (!Number.isInteger(data.duration) || data.duration < 1 || data.duration > 600) {
      errors.push("Duration must be between 1 and 600 minutes");
    }
  }

  if (data.year !== undefined && data.year !== null) {
    if (!Number.isInteger(data.year) || data.year < 1990 || data.year > 2100) {
      errors.push("Year must be between 1990 and 2100");
    }
  }

  if (data.slot !== undefined && data.slot !== null) {
    if (!Number.isInteger(data.slot) || data.slot < 1 || data.slot > 3) {
      errors.push("Slot must be between 1 and 3");
    }
  }

  if (data.isOfficial !== undefined && typeof data.isOfficial !== "boolean") {
    errors.push("isOfficial must be a boolean");
  }

  if (data.isPublished !== undefined && typeof data.isPublished !== "boolean") {
    errors.push("isPublished must be a boolean");
  }

  if (errors.length > 0) {
    const error = new Error(errors[0]);
    error.statusCode = 400;
    throw error;
  }
}

function buildMockTestData(data, { partial = false } = {}) {
  const result = {};

  if (!partial || data.title !== undefined) result.title = data.title.trim();
  if (!partial || data.duration !== undefined) result.duration = data.duration;
  if (data.year !== undefined) result.year = data.year;
  if (data.slot !== undefined) result.slot = data.slot;
  if (data.isOfficial !== undefined) result.isOfficial = data.isOfficial;
  if (data.isPublished !== undefined) result.isPublished = data.isPublished;

  return result;
}

async function getAdminMockTests() {
  return prisma.mockTest.findMany({
    orderBy: [{ year: "desc" }, { slot: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      duration: true,
      year: true,
      slot: true,
      isOfficial: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          questions: true,
          attempts: true,
        },
      },
    },
  });
}

async function getAdminMockTestById(id) {
  return prisma.mockTest.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          question: true,
        },
      },
      _count: {
        select: {
          attempts: true,
        },
      },
    },
  });
}

async function createMockTest(data) {
  validateMockTestData(data);

  return prisma.mockTest.create({
    data: {
      ...buildMockTestData(data),
      isPublished: data.isPublished ?? false,
    },
  });
}

async function updateMockTest(id, data) {
  validateMockTestData(data, { partial: true });

  const existing = await prisma.mockTest.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    const error = new Error("Mock test not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.mockTest.update({
    where: { id },
    data: buildMockTestData(data, { partial: true }),
  });
}

async function deleteMockTest(id) {
  const existing = await prisma.mockTest.findUnique({
    where: { id },
    select: {
      id: true,
      _count: {
        select: { attempts: true },
      },
    },
  });

  if (!existing) {
    const error = new Error("Mock test not found");
    error.statusCode = 404;
    throw error;
  }

  if (existing._count.attempts > 0) {
    const error = new Error("Mock tests with user attempts cannot be deleted");
    error.statusCode = 409;
    throw error;
  }

  await prisma.mockTest.delete({ where: { id } });
}

module.exports = {
  getAdminMockTests,
  getAdminMockTestById,
  createMockTest,
  updateMockTest,
  deleteMockTest,
};

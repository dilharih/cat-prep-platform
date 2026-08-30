const prisma = require("./src/config/prisma");

const questions = [
  // =========================
  // SLOT 1
  // =========================

  {
    mockTestYear: 2024,
    mockTestSlot: 1,
    section: "QA",
    topic: "Arithmetic",
    type: "MCQ",
    question:
      "A number is increased by 20% and then decreased by 20%. What is the net percentage change?",
    optionA: "4% increase",
    optionB: "4% decrease",
    optionC: "No change",
    optionD: "2% decrease",
    correctAnswer: "B",
    explanation:
      "Take the original value as 100. After a 20% increase it becomes 120. A 20% decrease gives 96. Therefore the net change is a 4% decrease.",
    marks: 3,
    negativeMarks: 1,
  },

  {
    mockTestYear: 2024,
    mockTestSlot: 1,
    section: "QA",
    topic: "Algebra",
    type: "MCQ",
    question:
      "If 2x + 5 = 17, what is the value of x?",
    optionA: "5",
    optionB: "6",
    optionC: "7",
    optionD: "8",
    correctAnswer: "B",
    explanation:
      "2x + 5 = 17, so 2x = 12 and x = 6.",
    marks: 3,
    negativeMarks: 1,
  },

  {
    mockTestYear: 2024,
    mockTestSlot: 1,
    section: "VARC",
    topic: "Reading Comprehension",
    type: "MCQ",
    question:
      "A researcher observes that people often remember information better when they actively connect it to ideas they already know. Which statement best follows?",
    optionA:
      "Memorization is always better than understanding.",
    optionB:
      "Prior knowledge can help improve learning.",
    optionC:
      "New information cannot be learned independently.",
    optionD:
      "People remember all familiar information perfectly.",
    correctAnswer: "B",
    explanation:
      "The statement directly indicates that connecting new information with existing knowledge can improve memory.",
    marks: 3,
    negativeMarks: 1,
  },

  {
    mockTestYear: 2024,
    mockTestSlot: 1,
    section: "DILR",
    topic: "Tables",
    type: "MCQ",
    question:
      "A shop sells 20, 30 and 50 units of three products respectively. What percentage of the total sales comes from the third product?",
    optionA: "40%",
    optionB: "45%",
    optionC: "50%",
    optionD: "55%",
    correctAnswer: "C",
    explanation:
      "Total sales = 20 + 30 + 50 = 100. The third product accounts for 50 out of 100 units, or 50%.",
    marks: 3,
    negativeMarks: 1,
  },

  // =========================
  // SLOT 2
  // =========================

  {
    mockTestYear: 2024,
    mockTestSlot: 2,
    section: "QA",
    topic: "Arithmetic",
    type: "MCQ",
    question:
      "A product costing ₹500 is sold at a 10% profit. What is its selling price?",
    optionA: "₹525",
    optionB: "₹550",
    optionC: "₹575",
    optionD: "₹600",
    correctAnswer: "B",
    explanation:
      "Profit = 10% of ₹500 = ₹50. Selling price = ₹500 + ₹50 = ₹550.",
    marks: 3,
    negativeMarks: 1,
  },

  {
    mockTestYear: 2024,
    mockTestSlot: 2,
    section: "VARC",
    topic: "Para Summary",
    type: "MCQ",
    question:
      "Which statement best describes the purpose of a summary?",
    optionA:
      "To introduce unrelated examples",
    optionB:
      "To reproduce every detail",
    optionC:
      "To present the central ideas concisely",
    optionD:
      "To replace the author's argument",
    correctAnswer: "C",
    explanation:
      "A summary captures the main ideas of a passage concisely while avoiding unnecessary details.",
    marks: 3,
    negativeMarks: 1,
  },

  {
    mockTestYear: 2024,
    mockTestSlot: 2,
    section: "DILR",
    topic: "Arrangements",
    type: "MCQ",
    question:
      "Four students A, B, C and D stand in a line. If A is first and D is last, who can occupy the second position?",
    optionA: "Only A",
    optionB: "Only D",
    optionC: "B or C",
    optionD: "A or D",
    correctAnswer: "C",
    explanation:
      "With A fixed first and D fixed last, B and C occupy the two middle positions.",
    marks: 3,
    negativeMarks: 1,
  },

  // =========================
  // SLOT 3
  // =========================

  {
    mockTestYear: 2024,
    mockTestSlot: 3,
    section: "QA",
    topic: "Number System",
    type: "MCQ",
    question:
      "What is the remainder when 17 is divided by 5?",
    optionA: "1",
    optionB: "2",
    optionC: "3",
    optionD: "4",
    correctAnswer: "B",
    explanation:
      "17 = 5 × 3 + 2, so the remainder is 2.",
    marks: 3,
    negativeMarks: 1,
  },

  {
    mockTestYear: 2024,
    mockTestSlot: 3,
    section: "VARC",
    topic: "Para Jumbles",
    type: "MCQ",
    question:
      "Which sentence should logically come first when introducing a new topic?",
    optionA:
      "A conclusion about the topic",
    optionB:
      "A clear introduction to the topic",
    optionC:
      "A reference to an unexplained result",
    optionD:
      "A final recommendation",
    correctAnswer: "B",
    explanation:
      "An introduction normally establishes the topic before supporting details, results, or conclusions.",
    marks: 3,
    negativeMarks: 1,
  },

  {
    mockTestYear: 2024,
    mockTestSlot: 3,
    section: "DILR",
    topic: "Charts",
    type: "MCQ",
    question:
      "A chart shows values of 10, 20, 30 and 40 for four categories. What is the average value?",
    optionA: "20",
    optionB: "25",
    optionC: "30",
    optionD: "35",
    correctAnswer: "B",
    explanation:
      "Average = (10 + 20 + 30 + 40) / 4 = 100 / 4 = 25.",
    marks: 3,
    negativeMarks: 1,
  },
];

async function main() {
  for (const item of questions) {
    const mockTest =
      await prisma.mockTest.findFirst({
        where: {
          year: item.mockTestYear,
          slot: item.mockTestSlot,
        },
      });

    if (!mockTest) {
      console.log(
        `Mock test not found: ${item.mockTestYear} Slot ${item.mockTestSlot}`
      );

      continue;
    }

    const {
  mockTestYear,
  mockTestSlot,
  ...questionData
} = item;

const question =
  await prisma.question.create({
    data: {
      ...questionData,
      year: mockTestYear,
      slot: mockTestSlot,
    },
  });

    const currentCount =
      await prisma.mockTestQuestion.count({
        where: {
          mockTestId: mockTest.id,
        },
      });

    await prisma.mockTestQuestion.create({
      data: {
        mockTestId: mockTest.id,
        questionId: question.id,
        order: currentCount + 1,
      },
    });

    console.log(
      `Added ${question.section} question to ${mockTest.title}`
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

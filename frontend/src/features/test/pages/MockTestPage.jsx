import { useEffect, useState } from "react";
import { getMockTest } from "../api/mockTest.api";

const MOCK_TEST_ID = "cmsu0rsiz0000zhgcvy63npzx";

function MockTestPage() {
  const [mockTest, setMockTest] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);

  // Load mock test
  useEffect(() => {
    async function loadMockTest() {
      try {
        const data = await getMockTest(MOCK_TEST_ID);

        setMockTest(data);
        setTimeLeft(data.duration * 60);
      } catch (error) {
        console.error("Failed to load mock test:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load mock test."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMockTest();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">
          Loading mock test...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold text-red-600">
          {error}
        </h2>
      </div>
    );
  }

  if (!mockTest || !mockTest.questions.length) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">
          No questions found.
        </h2>
      </div>
    );
  }

  const currentQuestion =
    mockTest.questions[currentIndex].question;

  const selectedAnswer =
    answers[currentQuestion.id];

  const isMarked =
    !!markedQuestions[currentQuestion.id];

  // Select answer
  function selectAnswer(answer) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  }

  // Next question
  function nextQuestion() {
    if (
      currentIndex <
      mockTest.questions.length - 1
    ) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  // Previous question
  function previousQuestion() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  // Mark / unmark question
  function toggleMarkForReview() {
    const questionId = currentQuestion.id;

    setMarkedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  }

  // Format timer
  const hours = Math.floor(timeLeft / 3600);

  const minutes = Math.floor(
    (timeLeft % 3600) / 60
  );

  const seconds = timeLeft % 60;

  const formattedTime = `${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(
    2,
    "0"
  )}`;

  const options = [
    ["A", currentQuestion.optionA],
    ["B", currentQuestion.optionB],
    ["C", currentQuestion.optionC],
    ["D", currentQuestion.optionD],
  ];

  return (
    <div className="mx-auto max-w-7xl p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {mockTest.title}
          </h1>

          <p className="mt-2 text-gray-500">
            Question {currentIndex + 1} of{" "}
            {mockTest.questions.length}
          </p>
        </div>

        {/* Timer */}
        <div
          className={`rounded-xl border px-5 py-3 text-center shadow-sm ${
            timeLeft <= 300
              ? "border-red-400 bg-red-50"
              : "bg-white"
          }`}
        >
          <p className="text-sm text-gray-500">
            Time Remaining
          </p>

          <p
            className={`text-2xl font-bold ${
              timeLeft <= 300
                ? "text-red-600"
                : ""
            }`}
          >
            {formattedTime}
          </p>
        </div>
      </div>

      {/* Question */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        {/* Section */}
        <div className="mb-6">
          <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {currentQuestion.section}
          </span>
        </div>

        {/* Question text */}
        <h2 className="text-xl font-semibold">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="mt-6 space-y-4">
          {options.map(([letter, text]) => (
            <button
              key={letter}
              onClick={() => selectAnswer(letter)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                selectedAnswer === letter
                  ? "border-blue-600 bg-blue-100"
                  : "hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <span className="mr-3 font-bold">
                {letter}.
              </span>

              {text}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={previousQuestion}
          disabled={currentIndex === 0}
          className="rounded-lg bg-gray-200 px-5 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={nextQuestion}
          disabled={
            currentIndex ===
            mockTest.questions.length - 1
          }
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Mark for Review */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={toggleMarkForReview}
          className={`rounded-lg px-5 py-2 font-medium transition ${
            isMarked
              ? "bg-yellow-500 text-white"
              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          }`}
        >
          {isMarked
            ? "Unmark Review"
            : "Mark for Review"}
        </button>
      </div>
    </div>
  );
}

export default MockTestPage;
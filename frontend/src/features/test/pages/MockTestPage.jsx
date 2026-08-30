import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { getMockTest } from "../api/mockTest.api";
import { submitMockTest } from "../api/mockTestAttempt.api";
import QuestionPalette from "../components/QuestionPalette";

function MockTestPage() {
  const { mockTestId } = useParams();
  const navigate = useNavigate();

  const [mockTest, setMockTest] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});

  const [markedQuestions, setMarkedQuestions] =
    useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  const submittingRef = useRef(false);

  // =========================
  // LOAD MOCK TEST
  // =========================

  useEffect(() => {
    async function loadMockTest() {
      try {
        const data = await getMockTest(mockTestId);

        setMockTest(data);

        setTimeLeft(data.duration * 60);
      } catch (error) {
        console.error(
          "Failed to load mock test:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load mock test."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMockTest();
  }, [mockTestId]);

  // =========================
  // COUNTDOWN TIMER
  // =========================

  useEffect(() => {
    if (
      timeLeft === null ||
      timeLeft <= 0
    ) {
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

  // =========================
  // SELECT ANSWER
  // =========================

  function selectAnswer(answer) {
    const updatedAnswers = {
      ...answersRef.current,
      [currentQuestion.id]: answer,
    };

    answersRef.current = updatedAnswers;

    setAnswers(updatedAnswers);
  }

  // =========================
  // NEXT QUESTION
  // =========================

  function nextQuestion() {
    if (
      currentIndex <
      mockTest.questions.length - 1
    ) {
      setCurrentIndex(
        (previous) => previous + 1
      );
    }
  }

  // =========================
  // PREVIOUS QUESTION
  // =========================

  function previousQuestion() {
    if (currentIndex > 0) {
      setCurrentIndex(
        (previous) => previous - 1
      );
    }
  }

  // =========================
  // MARK FOR REVIEW
  // =========================

  function toggleMarkForReview() {
    const questionId = currentQuestion.id;

    setMarkedQuestions((previous) => ({
      ...previous,
      [questionId]: !previous[questionId],
    }));
  }

  // =========================
  // SUBMIT MOCK TEST
  // =========================

  async function handleSubmitTest(
    autoSubmit = false
  ) {
    if (submittingRef.current) {
      return;
    }

    if (!autoSubmit) {
      const confirmed = window.confirm(
        "Are you sure you want to submit the test?"
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      submittingRef.current = true;
      setSubmitting(true);

      const durationInSeconds =
        mockTest.duration * 60;

      const timeTaken =
        durationInSeconds - timeLeft;

      const result = await submitMockTest(
        mockTestId,
        answersRef.current,
        timeTaken
      );

      const attemptId =
        result.mockTestAttempt.id;

      navigate(
        `/mock-test-result/${attemptId}`
      );
    } catch (error) {
      console.error(
        "Failed to submit mock test:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to submit mock test."
      );

      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  // =========================
  // AUTO SUBMIT
  // =========================

  useEffect(() => {
    if (
      timeLeft === 0 &&
      !submittingRef.current
    ) {
      handleSubmitTest(true);
    }
  }, [timeLeft]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">
          Loading mock test...
        </h2>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold text-red-600">
          {error}
        </h2>
      </div>
    );
  }

  // =========================
  // NO QUESTIONS
  // =========================

  if (
    !mockTest ||
    !mockTest.questions ||
    mockTest.questions.length === 0
  ) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">
          No questions found.
        </h2>
      </div>
    );
  }

  // =========================
  // CURRENT QUESTION
  // =========================

  const currentQuestion =
    mockTest.questions[currentIndex]
      .question;

  const selectedAnswer =
    answers[currentQuestion.id];

  const isMarked =
    !!markedQuestions[currentQuestion.id];

  // =========================
  // TIMER FORMAT
  // =========================

  const hours = Math.floor(
    timeLeft / 3600
  );

  const minutes = Math.floor(
    (timeLeft % 3600) / 60
  );

  const seconds = timeLeft % 60;

  const formattedTime =
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;

  // =========================
  // OPTIONS
  // =========================

  const options = [
    ["A", currentQuestion.optionA],
    ["B", currentQuestion.optionB],
    ["C", currentQuestion.optionC],
    ["D", currentQuestion.optionD],
  ];

  // =========================
  // UI
  // =========================

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="grid gap-8 lg:grid-cols-4">

        {/* MAIN TEST AREA */}

        <div className="lg:col-span-3">

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

          {/* Question Card */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <div className="mb-6">
              <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {currentQuestion.section}
              </span>
            </div>

            <h2 className="text-xl font-semibold">
              {currentQuestion.question}
            </h2>

            {/* Options */}

            <div className="mt-6 space-y-4">
              {options.map(
                ([letter, text]) => (
                  <button
                    key={letter}
                    onClick={() =>
                      selectAnswer(letter)
                    }
                    disabled={submitting}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selectedAnswer === letter
                        ? "border-blue-600 bg-blue-100"
                        : "hover:border-blue-500 hover:bg-blue-50"
                    } ${
                      submitting
                        ? "cursor-not-allowed opacity-70"
                        : ""
                    }`}
                  >
                    <span className="mr-3 font-bold">
                      {letter}.
                    </span>

                    {text}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Navigation */}

          <div className="mt-6 flex justify-between">

            <button
              onClick={previousQuestion}
              disabled={
                currentIndex === 0 ||
                submitting
              }
              className="rounded-lg bg-gray-200 px-5 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={nextQuestion}
              disabled={
                currentIndex ===
                  mockTest.questions.length - 1 ||
                submitting
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
              disabled={submitting}
              className={`rounded-lg px-5 py-2 font-medium transition ${
                isMarked
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {isMarked
                ? "Unmark Review"
                : "Mark for Review"}
            </button>
          </div>

          {/* Submit */}

          <div className="mt-6 flex justify-center">
            <button
              onClick={() =>
                handleSubmitTest(false)
              }
              disabled={submitting}
              className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit Test"}
            </button>
          </div>
        </div>

        {/* QUESTION PALETTE */}

        <div>
          <QuestionPalette
            questions={mockTest.questions}
            currentIndex={currentIndex}
            answers={answers}
            markedQuestions={markedQuestions}
            onQuestionSelect={setCurrentIndex}
          />
        </div>

      </div>
    </div>
  );
}

export default MockTestPage;
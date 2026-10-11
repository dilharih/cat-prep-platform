import {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { getMockTest } from "../api/mockTest.api";
import { submitMockTest } from "../api/mockTestAttempt.api";

function MockTestPage() {
  const { mockTestId } = useParams();
  const navigate = useNavigate();

  const testContainerRef = useRef(null);

  const [mockTest, setMockTest] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});

  const [markedQuestions, setMarkedQuestions] =
    useState({});

  const [visitedQuestions, setVisitedQuestions] =
    useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  const submittingRef = useRef(false);

  const [showSubmitModal, setShowSubmitModal] =
    useState(false);

  const [calculatorOpen, setCalculatorOpen] =
    useState(false);

  const [calculatorValue, setCalculatorValue] =
    useState("");

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  // =====================================================
  // LOAD MOCK TEST
  // =====================================================

  useEffect(() => {
    async function loadMockTest() {
      try {
        const data = await getMockTest(mockTestId);

        setMockTest(data);

        setTimeLeft(data.duration * 60);

        if (
          data.questions &&
          data.questions.length > 0
        ) {
          setVisitedQuestions({
            [data.questions[0].question.id]: true,
          });
        }
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

  // =====================================================
  // TIMER
  // =====================================================

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

  const handleSubmitTest = useCallback(async () => {
    if (submittingRef.current) {
      return;
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
  }, [mockTest, mockTestId, timeLeft, navigate]);

  // =====================================================
  // AUTO SUBMIT
  // =====================================================

  useEffect(() => {
    if (
      timeLeft === 0 &&
      !submittingRef.current &&
      mockTest
    ) {
      handleSubmitTest();
    }
  }, [handleSubmitTest, timeLeft, mockTest]);

  // =====================================================
  // FULLSCREEN
  // =====================================================

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await testContainerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error(
        "Fullscreen error:",
        error
      );
    }
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(
        Boolean(document.fullscreenElement)
      );
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  // =====================================================
  // AVAILABLE SECTIONS
  // =====================================================

  const availableSections = useMemo(() => {
    if (!mockTest?.questions) {
      return [];
    }

    return [
      ...new Set(
        mockTest.questions.map(
          (item) => item.question.section
        )
      ),
    ];
  }, [mockTest]);

  // =====================================================
  // CURRENT SECTION
  // =====================================================

  const currentSection =
    mockTest?.questions?.[currentIndex]?.question
      ?.section || availableSections[0];

  // =====================================================
  // QUESTIONS IN CURRENT SECTION
  // =====================================================

  const sectionQuestions = useMemo(() => {
    if (!mockTest?.questions) {
      return [];
    }

    return mockTest.questions
      .map((item, index) => ({
        ...item,
        originalIndex: index,
      }))
      .filter(
        (item) =>
          item.question.section === currentSection
      );
  }, [mockTest, currentSection]);

  // =====================================================
  // SECTION PROGRESS
  // =====================================================

  const sectionProgress = useMemo(() => {
    if (!mockTest?.questions) {
      return {};
    }

    const progress = {};

    for (const section of availableSections) {
      const questions =
        mockTest.questions.filter(
          (item) =>
            item.question.section === section
        );

      const answered =
        questions.filter(
          (item) =>
            Boolean(
              answers[item.question.id]
            )
        ).length;

      progress[section] = {
        answered,
        total: questions.length,
      };
    }

    return progress;
  }, [
    mockTest,
    availableSections,
    answers,
  ]);

  // =====================================================
  // CURRENT QUESTION
  // =====================================================

  const currentQuestion =
    mockTest?.questions?.[currentIndex]?.question;

  const currentSectionQuestionNumber =
    sectionQuestions.findIndex(
      (item) =>
        item.originalIndex === currentIndex
    ) + 1;

  // =====================================================
  // SELECT ANSWER
  // =====================================================

  function selectAnswer(answer) {
    if (!currentQuestion || submitting) {
      return;
    }

    const updatedAnswers = {
      ...answersRef.current,
      [currentQuestion.id]: answer,
    };

    answersRef.current = updatedAnswers;

    setAnswers(updatedAnswers);

    setVisitedQuestions((previous) => ({
      ...previous,
      [currentQuestion.id]: true,
    }));
  }

  // =====================================================
  // VISIT QUESTION
  // =====================================================

  function visitQuestion(index) {
    if (
      index < 0 ||
      index >= mockTest.questions.length ||
      submitting
    ) {
      return;
    }

    const questionId =
      mockTest.questions[index].question.id;

    setCurrentIndex(index);

    setVisitedQuestions((previous) => ({
      ...previous,
      [questionId]: true,
    }));
  }

  // =====================================================
  // NEXT QUESTION
  // IMPORTANT:
  // Moves through the entire paper, including
  // VARC -> DILR -> QA.
  // =====================================================

  function nextQuestion() {
    if (
      currentIndex <
        mockTest.questions.length - 1 &&
      !submitting
    ) {
      visitQuestion(currentIndex + 1);
    }
  }

  // =====================================================
  // PREVIOUS QUESTION
  // =====================================================

  function previousQuestion() {
    if (
      currentIndex > 0 &&
      !submitting
    ) {
      visitQuestion(currentIndex - 1);
    }
  }

  // =====================================================
  // MARK FOR REVIEW
  // =====================================================

  // =====================================================
  // MARK FOR REVIEW + NEXT
  // =====================================================

  function markForReviewAndNext() {
    if (!currentQuestion || submitting) {
      return;
    }

    const questionId = currentQuestion.id;

    setMarkedQuestions((previous) => ({
      ...previous,
      [questionId]: true,
    }));

    nextQuestion();
  }

  // =====================================================
  // CLEAR RESPONSE
  // =====================================================

  function clearResponse() {
    if (!currentQuestion || submitting) {
      return;
    }

    const updatedAnswers = {
      ...answersRef.current,
    };

    delete updatedAnswers[currentQuestion.id];

    answersRef.current = updatedAnswers;

    setAnswers(updatedAnswers);
  }

  // =====================================================
  // CHANGE SECTION
  // =====================================================

  function changeSection(section) {
    if (!mockTest || submitting) {
      return;
    }

    const firstQuestionIndex =
      mockTest.questions.findIndex(
        (item) =>
          item.question.section === section
      );

    if (firstQuestionIndex === -1) {
      return;
    }

    visitQuestion(firstQuestionIndex);
  }

  // =====================================================
  // CALCULATOR
  // =====================================================

  function addCalculatorValue(value) {
    setCalculatorValue(
      (previous) => previous + value
    );
  }

  function clearCalculator() {
    setCalculatorValue("");
  }

  function calculateValue() {
    try {
      if (!calculatorValue.trim()) {
        return;
      }

      // Basic calculator for the mock-test UI.
      const result = Function(
        `"use strict"; return (${calculatorValue})`
      )();

      setCalculatorValue(String(result));
    } catch {
      setCalculatorValue("Error");
    }
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white px-8 py-6 shadow">
          <p className="font-semibold">
            Loading test...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100 p-6">
        <div className="rounded-xl bg-white p-8 shadow">
          <h2 className="text-xl font-semibold text-red-600">
            {error}
          </h2>
        </div>
      </div>
    );
  }

  // =====================================================
  // NO QUESTIONS
  // =====================================================

  if (
    !mockTest ||
    !mockTest.questions ||
    mockTest.questions.length === 0
  ) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white p-8 shadow">
          <h2 className="text-xl font-semibold">
            No questions found.
          </h2>
        </div>
      </div>
    );
  }

  // =====================================================
  // TIMER
  // =====================================================

  const hours = Math.floor(
    timeLeft / 3600
  );

  const minutes = Math.floor(
    (timeLeft % 3600) / 60
  );

  const seconds = timeLeft % 60;

  const formattedTime =
    hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`
      : `${String(minutes).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`;

  // =====================================================
  // CURRENT ANSWER
  // =====================================================

  const selectedAnswer =
    currentQuestion
      ? answers[currentQuestion.id]
      : null;

  const isCurrentMarked =
    currentQuestion
      ? Boolean(
          markedQuestions[currentQuestion.id]
        )
      : false;

  // =====================================================
  // OPTIONS
  // =====================================================

  const options = currentQuestion
    ? [
        ["A", currentQuestion.optionA],
        ["B", currentQuestion.optionB],
        ["C", currentQuestion.optionC],
        ["D", currentQuestion.optionD],
      ].filter(
        ([, text]) =>
          text !== null &&
          text !== undefined
      )
    : [];

  // =====================================================
  // GLOBAL STATISTICS
  // =====================================================

  const answeredCount =
    mockTest.questions.filter(
      (item) =>
        Boolean(
          answers[item.question.id]
        )
    ).length;

  const markedCount =
    mockTest.questions.filter(
      (item) =>
        Boolean(
          markedQuestions[item.question.id]
        )
    ).length;

  const visitedCount =
    mockTest.questions.filter(
      (item) =>
        Boolean(
          visitedQuestions[item.question.id]
        )
    ).length;

  const notVisitedCount =
    mockTest.questions.length -
    visitedCount;

  const unansweredCount =
    mockTest.questions.length -
    answeredCount;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      ref={testContainerRef}
      className="flex h-screen w-full flex-col overflow-hidden bg-slate-100 text-slate-900"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="flex h-14 shrink-0 items-center justify-between bg-black px-5 text-white">

        {/* LEFT */}

        <div className="flex min-w-0 items-center">

          <div className="mr-5 text-xl font-extrabold tracking-tight">
            CAT<span className="text-orange-500">
              Prep
            </span>
          </div>

          <div className="h-7 w-px bg-slate-700" />

          <div className="ml-5 min-w-0">

            <p className="truncate text-sm font-bold">
              {mockTest.title}
            </p>

            <p className="text-[11px] text-slate-400">
              Computer Based Test
            </p>

          </div>

        </div>

        {/* CENTER */}

        <div className="hidden text-center md:block">

          <p className="text-sm font-bold tracking-wide">
            CAT MOCK TEST
          </p>

          <p className="text-[10px] uppercase tracking-widest text-slate-500">
            Full Question Paper
          </p>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4">

          <div className="hidden border-r border-slate-700 pr-4 text-right sm:block">

            <p className="text-[10px] uppercase tracking-wide text-slate-500">
              Candidate
            </p>

            <p className="text-sm font-semibold">
              Test User
            </p>

          </div>

          <div
            className={`min-w-[100px] rounded-md px-3 py-1.5 text-center ${
              timeLeft <= 300
                ? "bg-red-600"
                : "bg-slate-800"
            }`}
          >

            <p className="text-[9px] uppercase tracking-widest text-slate-400">
              Time Left
            </p>

            <p className="font-mono text-base font-bold">
              {formattedTime}
            </p>

          </div>

        </div>

      </header>

      {/* =================================================
          SECTION BAR
      ================================================= */}

      <div className="flex shrink-0 items-center justify-between border-b border-slate-300 bg-white px-5 py-3 shadow-sm">

        <div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Section
          </p>

          <div className="flex gap-2">

            {availableSections.map(
              (section) => {
                const progress =
                  sectionProgress[section];

                const sectionName =
                  section === "VARC"
                    ? "Verbal Ability"
                    : section === "DILR"
                    ? "LR DI"
                    : "Quant";

                return (
                  <button
                    key={section}
                    onClick={() =>
                      changeSection(section)
                    }
                    disabled={submitting}
                    className={`min-w-[120px] rounded-lg px-4 py-2 text-left transition ${
                      currentSection === section
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >

                    <div className="text-sm font-bold">
                      {sectionName}
                    </div>

                    <div
                      className={`mt-1 text-xs ${
                        currentSection === section
                          ? "text-orange-100"
                          : "text-slate-500"
                      }`}
                    >
                      {progress?.answered || 0}/
                      {progress?.total || 0} answered
                    </div>

                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* TOOLS */}

        <div className="flex items-center gap-2">

          <button
            onClick={toggleFullscreen}
            title={
              isFullscreen
                ? "Exit Fullscreen"
                : "Fullscreen"
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg hover:bg-slate-200"
          >
            ⛶
          </button>

          <button
            onClick={() =>
              setCalculatorOpen(
                (previous) => !previous
              )
            }
            title="Calculator"
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${
              calculatorOpen
                ? "bg-blue-600 text-white"
                : "bg-slate-100 hover:bg-slate-200"
            }`}
          >
            🧮
          </button>

        </div>

      </div>

      {/* =================================================
          MAIN TEST AREA
      ================================================= */}

      <main className="min-h-0 flex-1 overflow-hidden p-3 sm:p-4">

        <div className="grid h-full min-h-0 gap-3 overflow-hidden lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* =================================================
              QUESTION CARD
          ================================================= */}

          <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">

            {/* QUESTION HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-300 bg-white px-5 py-3">

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {currentSection === "VARC"
                    ? "Verbal Ability"
                    : currentSection === "DILR"
                    ? "LR DI"
                    : "QA"}
                </p>

                <h1 className="mt-1 text-lg font-bold text-slate-900">
                  Question{" "}
                  {currentSectionQuestionNumber}
                </h1>

              </div>

              <div className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                {currentSectionQuestionNumber} /{" "}
                {sectionQuestions.length}
              </div>

            </div>

            {/* QUESTION CONTENT */}

            <div className="min-h-0 flex-1 overflow-auto">

              <div className="grid min-h-full lg:grid-cols-[1fr_1fr]">

                {/* DIRECTIONS / PASSAGE */}

                <div className="border-b border-slate-300 bg-white p-5 lg:border-b-0 lg:border-r">

                  <div className="mb-4">

                    <p className="text-sm font-bold uppercase tracking-wide text-slate-700">
                      Directions
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {currentQuestion.passage
                        ? "Read the passage carefully and answer the question based on it."
                        : "Read the question carefully and select the most appropriate answer."}
                    </p>

                  </div>

                  {currentQuestion.passage ? (
                    <div className="h-full overflow-auto rounded-xl border border-slate-300 bg-white p-5">

                      {currentQuestion.passage.title && (
                        <h3 className="mb-4 text-base font-bold text-slate-900">
                          {
                            currentQuestion
                              .passage.title
                          }
                        </h3>
                      )}

                      <div className="whitespace-pre-line text-sm leading-7 text-slate-700">
                        {
                          currentQuestion
                            .passage.content
                        }
                      </div>

                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-300 bg-white p-5">

                      <p className="text-sm leading-7 text-slate-700">
                        This question does not have an associated passage.
                      </p>

                    </div>
                  )}

                </div>

                {/* ANSWER AREA */}

                <div className="p-5">

                  {/* QUESTION TEXT */}

                  <div className="mb-6">

                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Question
                    </p>

                    <p className="text-[15px] font-semibold leading-7 text-slate-900">
                      {currentQuestion.question}
                    </p>

                  </div>

                  {/* ANSWER HEADER */}

                  <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-sm font-bold">
                      Choose your answer
                    </h2>

                    {selectedAnswer && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Answered
                      </span>
                    )}

                  </div>

                  {/* OPTIONS */}

                  <div className="space-y-3">

                    {options.map(
                      ([letter, text]) => (
                        <button
                          key={letter}
                          onClick={() =>
                            selectAnswer(letter)
                          }
                          disabled={submitting}
                          className={`flex w-full items-start gap-4 rounded-lg border p-4 text-left transition ${
                            selectedAnswer === letter
                              ? "border-green-600 bg-green-50 shadow-sm"
                              : "border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50"
                          }`}
                        >

                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                              selectedAnswer ===
                              letter
                                ? "border-green-600 bg-green-600 text-white"
                                : "border-slate-300 bg-white text-slate-700"
                            }`}
                          >
                            {letter}
                          </span>

                          <span className="pt-1 text-sm leading-6 text-slate-800">
                            {text}
                          </span>

                        </button>
                      )
                    )}

                  </div>

                  {/* MARKED MESSAGE */}

                  {isCurrentMarked && (
                    <div className="mt-5 rounded-lg bg-purple-50 p-3 text-sm text-purple-700">
                      This question is marked for
                      review.
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* =================================================
                BOTTOM CONTROLS
            ================================================= */}

            <div className="shrink-0 border-t border-slate-300 bg-white px-4 py-3">

              <div className="flex flex-wrap items-center justify-between gap-3">

                <div className="flex flex-wrap gap-2">

                  <button
                    onClick={
                      markForReviewAndNext
                    }
                    disabled={submitting}
                    className="rounded-lg bg-purple-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-purple-800 disabled:opacity-50"
                  >
                    Mark for Review & Next
                  </button>

                  <button
                    onClick={clearResponse}
                    disabled={
                      submitting ||
                      !selectedAnswer
                    }
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Clear Response
                  </button>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={previousQuestion}
                    disabled={
                      currentIndex === 0 ||
                      submitting
                    }
                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-xs font-bold disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    onClick={nextQuestion}
                    disabled={
                      currentIndex ===
                        mockTest.questions.length -
                          1 ||
                      submitting
                    }
                    className="rounded-lg bg-orange-500 px-6 py-2.5 text-xs font-bold text-white hover:bg-orange-600 disabled:opacity-40"
                  >
                    Save & Next
                  </button>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              QUESTION PALETTE
          ================================================= */}

          <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">

            {/* PALETTE HEADER */}

            <div className="shrink-0 border-b border-slate-300 bg-white p-4">

              <p className="text-xs text-slate-500">
                You are viewing
              </p>

              <p className="font-bold text-slate-900">
                {currentSection === "VARC"
                  ? "Verbal Ability"
                  : currentSection === "DILR"
                  ? "LR DI"
                  : "Quant"}
              </p>

              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                Question Palette
              </p>

            </div>

            {/* PALETTE CONTENT */}

            <div className="min-h-0 flex-1 overflow-auto p-4">

              <div className="grid grid-cols-5 gap-3">

                {sectionQuestions.map(
                  (item, sectionIndex) => {
                    const index =
                      item.originalIndex;

                    const questionId =
                      item.question.id;

                    const answered =
                      Boolean(
                        answers[questionId]
                      );

                    const marked =
                      Boolean(
                        markedQuestions[
                          questionId
                        ]
                      );

                    const visited =
                      Boolean(
                        visitedQuestions[
                          questionId
                        ]
                      );

                    const isCurrent =
                      index === currentIndex;

                    let paletteClass =
                      "bg-white text-slate-800 border-slate-200";

                    if (
                      answered &&
                      marked
                    ) {
                      paletteClass =
                        "bg-purple-600 text-white border-purple-600";
                    } else if (marked) {
                      paletteClass =
                        "bg-orange-500 text-white border-orange-500";
                    } else if (answered) {
                      paletteClass =
                        "bg-green-600 text-white border-green-600";
                    } else if (visited) {
                      paletteClass =
                        "bg-slate-200 text-slate-700 border-slate-300";
                    }

                    return (
                      <button
                        key={questionId}
                        onClick={() =>
                          visitQuestion(index)
                        }
                        disabled={submitting}
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold shadow-sm transition hover:scale-105 ${paletteClass} ${
                          isCurrent
                            ? "ring-2 ring-blue-600 ring-offset-2"
                            : ""
                        }`}
                      >
                        {sectionIndex + 1}
                      </button>
                    );
                  }
                )}

              </div>

              {/* LEGEND */}

              <div className="mt-6 border-t border-slate-300 pt-5">

                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  Legend
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-green-600" />
                    Answered
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-orange-500" />
                    Marked
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-purple-600" />
                    Answered + Marked
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-slate-200" />
                    Visited
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border border-slate-300 bg-white" />
                    Not Visited
                  </div>

                </div>

              </div>

              {/* STATISTICS */}

              <div className="mt-6 rounded-xl bg-slate-50 p-4">

                <div className="flex justify-between text-xs">

                  <span className="text-slate-500">
                    Answered
                  </span>

                  <span className="font-bold">
                    {answeredCount}
                  </span>

                </div>

                <div className="mt-2 flex justify-between text-xs">

                  <span className="text-slate-500">
                    Marked
                  </span>

                  <span className="font-bold">
                    {markedCount}
                  </span>

                </div>

                <div className="mt-2 flex justify-between text-xs">

                  <span className="text-slate-500">
                    Visited
                  </span>

                  <span className="font-bold">
                    {visitedCount}
                  </span>

                </div>

                <div className="mt-2 flex justify-between text-xs">

                  <span className="text-slate-500">
                    Not Visited
                  </span>

                  <span className="font-bold">
                    {notVisitedCount}
                  </span>

                </div>

              </div>

            </div>

            {/* SUBMIT */}

            <div className="shrink-0 border-t border-slate-300 bg-white p-4">

              <button
                onClick={() =>
                  setShowSubmitModal(true)
                }
                disabled={submitting}
                className="w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Test"}
              </button>

            </div>

          </aside>

        </div>

      </main>

      {/* =================================================
          CALCULATOR
      ================================================= */}

      {calculatorOpen && (
        <div className="fixed right-6 top-24 z-50 w-72 rounded-2xl border border-slate-300 bg-white p-4 shadow-2xl">

          <div className="mb-3 flex items-center justify-between">

            <h3 className="font-bold">
              Calculator
            </h3>

            <button
              onClick={() =>
                setCalculatorOpen(false)
              }
              className="text-slate-500 hover:text-slate-900"
            >
              ✕
            </button>

          </div>

          <input
            value={calculatorValue}
            onChange={(event) =>
              setCalculatorValue(
                event.target.value
              )
            }
            className="mb-3 w-full rounded-lg border border-slate-300 p-3 text-right font-mono"
            placeholder="0"
          />

          <div className="grid grid-cols-4 gap-2">

            {[
              "7",
              "8",
              "9",
              "/",
              "4",
              "5",
              "6",
              "*",
              "1",
              "2",
              "3",
              "-",
              "0",
              ".",
              "+",
              "(",
            ].map((value) => (
              <button
                key={value}
                onClick={() =>
                  addCalculatorValue(value)
                }
                className="rounded-lg bg-slate-100 py-3 font-semibold hover:bg-slate-200"
              >
                {value}
              </button>
            ))}

          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">

            <button
              onClick={clearCalculator}
              className="rounded-lg bg-red-100 py-3 font-semibold text-red-700 hover:bg-red-200"
            >
              Clear
            </button>

            <button
              onClick={calculateValue}
              className="rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              =
            </button>

          </div>

        </div>
      )}

      {/* =================================================
          SUBMIT CONFIRMATION MODAL
      ================================================= */}

      {showSubmitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="border-b border-slate-200 px-6 py-5">

              <h2 className="text-xl font-bold text-slate-900">
                Submit Test
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review your attempt before submitting.
              </p>

            </div>

            {/* STATISTICS */}

            <div className="grid grid-cols-2 gap-3 p-6">

              {/* ANSWERED */}

              <div className="rounded-xl bg-green-50 p-4">

                <p className="text-xs font-semibold text-green-700">
                  Answered
                </p>

                <p className="mt-1 text-2xl font-bold text-green-800">
                  {answeredCount}
                </p>

              </div>

              {/* UNANSWERED */}

              <div className="rounded-xl bg-slate-100 p-4">

                <p className="text-xs font-semibold text-slate-600">
                  Unanswered
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-800">
                  {unansweredCount}
                </p>

              </div>

              {/* MARKED */}

              <div className="rounded-xl bg-orange-50 p-4">

                <p className="text-xs font-semibold text-orange-700">
                  Marked
                </p>

                <p className="mt-1 text-2xl font-bold text-orange-800">
                  {markedCount}
                </p>

              </div>

              {/* NOT VISITED */}

              <div className="rounded-xl bg-slate-100 p-4">

                <p className="text-xs font-semibold text-slate-600">
                  Not Visited
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-800">
                  {notVisitedCount}
                </p>

              </div>

            </div>

            {/* WARNING */}

            {unansweredCount > 0 && (
              <div className="mx-6 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">
                You still have unanswered questions.
                Make sure you want to submit the test.
              </div>
            )}

            {/* ACTIONS */}

            <div className="flex justify-end gap-3 border-t border-slate-200 p-6">

              <button
                onClick={() =>
                  setShowSubmitModal(false)
                }
                disabled={submitting}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Go Back
              </button>

              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSubmitTest(false);
                }}
                disabled={submitting}
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Test"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default MockTestPage;
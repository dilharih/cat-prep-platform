import { useEffect, useState } from "react";

import QuestionCard from "../components/QuestionCard";
import OptionList from "../components/OptionList";
import QuestionPalette from "../components/QuestionPalette";

import { usePracticeSession } from "../hooks/usePracticeSession";
import { submitAttempt } from "../api/attempt.api";

function PracticePage() {
  const {
    loading,
    questions,
    question,
    currentIndex,
    answers,
    nextQuestion,
    previousQuestion,
    jumpToQuestion,
    selectAnswer,
  } = usePracticeSession();

  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setResult(null);
  }, [question?.id]);

  if (loading) {
    return <h2 className="p-8">Loading...</h2>;
  }

  if (!questions.length) {
    return <h2 className="p-8">No questions found.</h2>;
  }

  async function handleSubmit() {
    const selected = answers[question.id];

    if (!selected) {
      alert("Please select an answer.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await submitAttempt(
        question.id,
        selected,
        30
      );

      setResult(response);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to submit answer."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-8 lg:grid-cols-4">
      {/* Left Side */}
      <div className="lg:col-span-3">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Question {currentIndex + 1} of {questions.length}
          </h2>

          <span className="rounded bg-blue-100 px-3 py-1 text-blue-700">
            {question.section}
          </span>
        </div>

        {/* Question */}
        <QuestionCard question={question} />

        {/* Options */}
        <OptionList
          question={question}
          selected={answers[question.id]}
          onSelect={selectAnswer}
          disabled={!!result}
        />

        {/* Submit Button */}
        <div className="mt-8">
          <button
            onClick={handleSubmit}
            disabled={!answers[question.id] || submitting || !!result}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : result
              ? "Answered"
              : "Submit Answer"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div
            className={`mt-6 rounded-xl border p-5 ${
              result.isCorrect
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            <h3 className="text-lg font-bold">
              {result.isCorrect
                ? "✅ Correct!"
                : "❌ Incorrect"}
            </h3>

            <p className="mt-3">
              Correct Answer:
              <strong> {result.correctAnswer}</strong>
            </p>

            <p className="mt-3">
              {result.explanation}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentIndex === 0}
            className="rounded-lg bg-gray-200 px-5 py-2 font-medium transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={currentIndex === questions.length - 1}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div>
        <QuestionPalette
          questions={questions}
          currentIndex={currentIndex}
          answers={answers}
          onQuestionSelect={jumpToQuestion}
        />
      </div>
    </div>
  );
}

export default PracticePage;
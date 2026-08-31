import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../lib/api";

function MockTestReviewPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReview() {
      try {
        const response = await api.get(
          `/mock-test-results/${attemptId}`
        );

        setResult(response.data.data);
      } catch (error) {
        console.error(
          "Failed to load attempt review:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load attempt review."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReview();
  }, [attemptId]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="fixed inset-0 overflow-y-auto bg-slate-100">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-xl bg-white px-8 py-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              Loading review...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="fixed inset-0 overflow-y-auto bg-slate-100">
        <div className="mx-auto max-w-lg p-8">
          <div className="rounded-xl bg-white p-8 shadow-sm">

            <h2 className="text-xl font-semibold text-red-600">
              {error}
            </h2>

            <button
              onClick={() =>
                navigate(
                  `/mock-test-result/${attemptId}`
                )
              }
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Back to Result
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // RESULT NOT FOUND
  // =====================================================

  if (!result) {
    return (
      <div className="fixed inset-0 overflow-y-auto bg-slate-100">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">
              Review not found.
            </h2>
          </div>
        </div>
      </div>
    );
  }

  const answers = result.answers || [];

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-black px-6 py-4 text-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between">

          <div>

            <h1 className="text-xl font-extrabold">
              CAT
              <span className="text-orange-500">
                Prep
              </span>
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Attempt Review
            </p>

          </div>

          <button
            onClick={() =>
              navigate(
                `/mock-test-result/${attemptId}`
              )
            }
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-800"
          >
            Back to Result
          </button>

        </div>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">

        {/* TITLE */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-slate-900">
            {result.mockTest.title}
          </h2>

          <p className="mt-2 text-slate-500">
            Review your attempted questions
          </p>

        </div>

        {/* =================================================
            QUESTIONS
        ================================================= */}

        <div className="space-y-6">

          {answers.map((answer, index) => {

            const unanswered =
              answer.selectedAnswer === null ||
              answer.selectedAnswer === undefined ||
              answer.selectedAnswer === "";

            const correct =
              !unanswered && answer.isCorrect;

            return (
              <div
                key={answer.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm"
              >

                {/* QUESTION HEADER */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                  <h3 className="text-lg font-bold">
                    Question {index + 1}
                  </h3>

                  {/* STATUS */}

                  {correct && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      Correct
                    </span>
                  )}

                  {!correct && !unanswered && (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                      Wrong
                    </span>
                  )}

                  {unanswered && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                      Unanswered
                    </span>
                  )}

                </div>

                {/* QUESTION */}

                <div className="p-6">

                  <p className="text-lg font-medium leading-7 text-slate-900">
                    {answer.question.question}
                  </p>

                  {/* YOUR ANSWER */}

                  <div className="mt-6">

                    <p className="text-sm font-semibold text-slate-500">
                      Your Answer
                    </p>

                    <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">

                      {unanswered ? (
                        <span className="text-slate-500">
                          Not answered
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-900">
                          {answer.selectedAnswer}
                        </span>
                      )}

                    </div>

                  </div>

                  {/* EXPLANATION */}

                  {answer.question.explanation && (
                    <div className="mt-6 rounded-xl bg-blue-50 p-5">

                      <p className="text-sm font-bold text-blue-700">
                        Explanation
                      </p>

                      <p className="mt-2 leading-6 text-slate-700">
                        {answer.question.explanation}
                      </p>

                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>

        {/* =================================================
            BOTTOM ACTIONS
        ================================================= */}

        <div className="mt-8 flex flex-wrap gap-3 pb-10">

          <button
            onClick={() =>
              navigate(
                `/mock-test-result/${attemptId}`
              )
            }
            className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Back to Result
          </button>

          <button
            onClick={() =>
              navigate("/mock-test")
            }
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Mock Tests
          </button>

        </div>

      </main>

    </div>
  );
}

export default MockTestReviewPage;
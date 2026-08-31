import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../lib/api";

function MockTestResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResult() {
      try {
        const response = await api.get(
          `/mock-test-results/${attemptId}`
        );

        setResult(response.data.data);
      } catch (error) {
        console.error(
          "Failed to load mock test result:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load result."
        );
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [attemptId]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white px-8 py-6 shadow-sm">
          <h2 className="text-xl font-semibold">
            Loading result...
          </h2>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-red-600">
            {error}
          </h2>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // RESULT NOT FOUND
  // =====================================================

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">
            Result not found.
          </h2>
        </div>
      </div>
    );
  }

  // =====================================================
  // ANSWER STATISTICS
  // =====================================================

  const answerStats = {
    correct: 0,
    wrong: 0,
    unanswered: 0,
    total: result.answers?.length || 0,
  };

  if (result.answers) {
    result.answers.forEach((answer) => {
      if (
        answer.selectedAnswer === null ||
        answer.selectedAnswer === undefined ||
        answer.selectedAnswer === ""
      ) {
        answerStats.unanswered++;
      } else if (answer.isCorrect) {
        answerStats.correct++;
      } else {
        answerStats.wrong++;
      }
    });
  }

  // =====================================================
  // TIME
  // =====================================================

  const minutes = Math.floor(
    result.timeTaken / 60
  );

  const seconds = result.timeTaken % 60;

  // =====================================================
  // RENDER
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
              Mock Test Result
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-800"
          >
            Dashboard
          </button>

        </div>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

<main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
        {/* TITLE */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-slate-900">
            {result.mockTest.title}
          </h2>

          <p className="mt-2 text-slate-500">
            Your performance summary
          </p>

        </div>

        {/* =================================================
            MAIN RESULT CARD
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          {/* =================================================
              MAIN STATS
          ================================================= */}

          <div className="grid gap-5 md:grid-cols-3">

            {/* SCORE */}

            <div className="rounded-xl bg-blue-50 p-6 text-center">

              <p className="text-sm font-semibold text-blue-700">
                Score
              </p>

              <p className="mt-2 text-4xl font-extrabold text-blue-900">
                {result.score}
              </p>

            </div>

            {/* ACCURACY */}

            <div className="rounded-xl bg-green-50 p-6 text-center">

              <p className="text-sm font-semibold text-green-700">
                Accuracy
              </p>

              <p className="mt-2 text-4xl font-extrabold text-green-900">
                {Math.round(result.accuracy)}%
              </p>

            </div>

            {/* TIME */}

            <div className="rounded-xl bg-slate-50 p-6 text-center">

              <p className="text-sm font-semibold text-slate-600">
                Time Taken
              </p>

              <p className="mt-2 text-4xl font-extrabold text-slate-900">
                {minutes}:
                {String(seconds).padStart(2, "0")}
              </p>

            </div>

          </div>

          {/* =================================================
              ANSWER BREAKDOWN
          ================================================= */}

          <div className="mt-8 border-t border-slate-200 pt-8">

            <h3 className="text-lg font-bold text-slate-900">
              Answer Breakdown
            </h3>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* CORRECT */}

              <div className="rounded-xl border border-green-200 bg-green-50 p-5">

                <p className="text-sm font-semibold text-green-700">
                  Correct
                </p>

                <p className="mt-1 text-3xl font-bold text-green-800">
                  {answerStats.correct}
                </p>

              </div>

              {/* WRONG */}

              <div className="rounded-xl border border-red-200 bg-red-50 p-5">

                <p className="text-sm font-semibold text-red-700">
                  Wrong
                </p>

                <p className="mt-1 text-3xl font-bold text-red-800">
                  {answerStats.wrong}
                </p>

              </div>

              {/* UNANSWERED */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                <p className="text-sm font-semibold text-slate-600">
                  Unanswered
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-800">
                  {answerStats.unanswered}
                </p>

              </div>

              {/* TOTAL */}

              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

                <p className="text-sm font-semibold text-blue-700">
                  Total Questions
                </p>

                <p className="mt-1 text-3xl font-bold text-blue-800">
                  {answerStats.total}
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              TEST INFORMATION
          ================================================= */}

          <div className="mt-8 border-t border-slate-200 pt-8">

            <h3 className="text-lg font-bold text-slate-900">
              Test Information
            </h3>

            <div className="mt-5 grid gap-5 md:grid-cols-3">

              <div>
                <p className="text-sm text-slate-500">
                  Year
                </p>

                <p className="mt-1 font-semibold">
                  {result.mockTest.year || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Slot
                </p>

                <p className="mt-1 font-semibold">
                  {result.mockTest.slot || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Duration
                </p>

                <p className="mt-1 font-semibold">
                  {result.mockTest.duration} minutes
                </p>
              </div>

            </div>

          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-8">

  {/* TAKE SAME TEST AGAIN */}

  <button
    onClick={() =>
      navigate(
        `/mock-test/${result.mockTest.id}`
      )
    }
    className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
  >
    Take Test Again
  </button>

  {/* MOCK TEST LIST */}

  <button
    onClick={() =>
      navigate("/mock-test")
    }
    className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
  >
    Mock Tests
  </button>

  {/* DASHBOARD */}

  <button
    onClick={() =>
      navigate("/dashboard")
    }
    className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
  >
    Dashboard
  </button>

</div>

        </div>

      </main>

    </div>
  );
}

export default MockTestResultPage;
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
        const response = await api.get(`/mock-test-results/${attemptId}`);
        setResult(response.data.data);
      } catch (error) {
        console.error("Failed to load mock test result:", error);
        setError(error.response?.data?.message || "Failed to load result.");
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="result-page flex min-h-[calc(100vh-72px)] items-center justify-center p-4">
        <div className="result-panel rounded-2xl px-7 py-6 text-center shadow-sm">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#D3E0EA] border-t-[#1687A7]" />
          <h2 className="result-heading text-lg font-semibold">Loading result...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-page flex min-h-[calc(100vh-72px)] items-center justify-center p-4">
        <div className="result-panel w-full max-w-lg rounded-2xl p-7 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
            Unable to load result
          </p>
          <h2 className="result-heading mt-2 text-xl font-bold">{error}</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-5 rounded-xl bg-[#276678] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1687A7] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-page flex min-h-[calc(100vh-72px)] items-center justify-center p-4">
        <div className="result-panel rounded-2xl p-7 shadow-sm">
          <h2 className="result-heading text-xl font-bold">Result not found.</h2>
        </div>
      </div>
    );
  }

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

  const minutes = Math.floor(result.timeTaken / 60);
  const seconds = result.timeTaken % 60;

  return (
    <div className="result-page min-h-[calc(100vh-72px)] font-sans">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="result-panel mb-6 flex flex-col gap-4 rounded-2xl p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#276678] text-sm font-extrabold text-white">
                C
              </span>
              <span className="result-brand text-sm font-bold tracking-wide">CATPrep</span>
            </div>
            <h1 className="result-title mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {result.mockTest.title}
            </h1>
            <div className="result-muted mt-2 flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-[#1687A7]" />
              Test completed · Performance summary
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/mock-test-review/${attemptId}`)}
              className="rounded-xl bg-[#276678] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1687A7] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2"
            >
              Review Answers
            </button>
            <button
              onClick={() => navigate("/mock-tests")}
              className="result-secondary-button rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2"
            >
              Mock Tests
            </button>
          </div>
        </header>

        <section className="result-panel overflow-hidden rounded-2xl shadow-sm">
          <div className="result-divider px-5 py-4 sm:px-6">
            <h2 className="result-heading text-base font-bold">Performance Summary</h2>
          </div>

          <div className="grid md:grid-cols-3">
            <div className="result-metric result-divider-bottom px-5 py-6 md:border-b-0 md:border-r">
              <p className="result-muted text-xs font-bold uppercase tracking-wider">Score</p>
              <p className="result-value mt-2 text-4xl font-extrabold">{result.score}</p>
              <p className="result-muted mt-1 text-sm">CAT score</p>
            </div>

            <div className="result-metric result-divider-bottom px-5 py-6 md:border-b-0 md:border-r">
              <p className="result-muted text-xs font-bold uppercase tracking-wider">Accuracy</p>
              <p className="result-accent mt-2 text-4xl font-extrabold">{Math.round(result.accuracy)}%</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#D3E0EA] dark:bg-[#194353]">
                <div
                  className="h-full rounded-full bg-[#1687A7]"
                  style={{ width: `${Math.min(100, Math.max(0, result.accuracy || 0))}%` }}
                />
              </div>
            </div>

            <div className="px-5 py-6">
              <p className="result-muted text-xs font-bold uppercase tracking-wider">Time Taken</p>
              <p className="result-value mt-2 text-4xl font-extrabold">
                {minutes}:{String(seconds).padStart(2, "0")}
              </p>
              <p className="result-muted mt-1 text-sm">Total test time</p>
            </div>
          </div>
        </section>

        <section className="result-panel mt-5 rounded-2xl p-5 shadow-sm sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="result-heading text-base font-bold">Answer Breakdown</h2>
              <p className="result-muted mt-1 text-sm">How you performed across the paper.</p>
            </div>
            <span className="result-muted hidden text-sm font-semibold sm:block">
              {answerStats.total} questions
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-4 dark:border-green-900/60 dark:bg-green-950/30">
              <p className="text-xs font-bold uppercase tracking-wide text-green-700 dark:text-green-300">Correct</p>
              <p className="mt-1 text-2xl font-extrabold text-green-800 dark:text-green-200">{answerStats.correct}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 dark:border-red-900/60 dark:bg-red-950/30">
              <p className="text-xs font-bold uppercase tracking-wide text-red-700 dark:text-red-300">Wrong</p>
              <p className="mt-1 text-2xl font-extrabold text-red-800 dark:text-red-200">{answerStats.wrong}</p>
            </div>
            <div className="result-stat rounded-xl px-4 py-4">
              <p className="result-muted text-xs font-bold uppercase tracking-wide">Unanswered</p>
              <p className="result-value mt-1 text-2xl font-extrabold">{answerStats.unanswered}</p>
            </div>
            <div className="result-stat rounded-xl px-4 py-4">
              <p className="result-muted text-xs font-bold uppercase tracking-wide">Total Questions</p>
              <p className="result-value mt-1 text-2xl font-extrabold">{answerStats.total}</p>
            </div>
          </div>
        </section>

        <section className="result-panel mt-5 rounded-2xl p-5 shadow-sm sm:p-6">
          <h2 className="result-heading text-base font-bold">Test Information</h2>

          <div className="result-info mt-4 grid grid-cols-1 divide-y rounded-xl border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-4 py-3">
              <p className="result-muted text-xs font-semibold">Year</p>
              <p className="result-value mt-1 text-sm font-bold">{result.mockTest.year || "N/A"}</p>
            </div>
            <div className="px-4 py-3">
              <p className="result-muted text-xs font-semibold">Slot</p>
              <p className="result-value mt-1 text-sm font-bold">{result.mockTest.slot || "N/A"}</p>
            </div>
            <div className="px-4 py-3">
              <p className="result-muted text-xs font-semibold">Duration</p>
              <p className="result-value mt-1 text-sm font-bold">{result.mockTest.duration} minutes</p>
            </div>
          </div>
        </section>

        <div className="result-actions mt-5 flex flex-wrap items-center gap-2 border-t pb-8 pt-5">
          <button
            onClick={() => navigate(`/mock-test-review/${attemptId}`)}
            className="rounded-xl bg-[#276678] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1687A7] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2"
          >
            Review Answers
          </button>
          <button
            onClick={() => navigate(`/mock-test/${result.mockTest.id}`)}
            className="result-secondary-button rounded-xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2"
          >
            Take Test Again
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="result-dashboard-button rounded-xl border border-transparent px-5 py-2.5 text-sm font-semibold transition"
          >
            Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

export default MockTestResultPage;

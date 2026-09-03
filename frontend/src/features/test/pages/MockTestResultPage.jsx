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
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#F6F5F5] p-4 dark:bg-[#091a21]">
        <div className="rounded-2xl border border-[#D3E0EA] bg-white px-7 py-6 text-center shadow-sm dark:border-[#245766] dark:bg-[#102a33]">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#D3E0EA] border-t-[#1687A7]" />
          <h2 className="text-lg font-semibold text-[#276678] dark:text-[#D3E0EA]">
            Loading result...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#F6F5F5] p-4 dark:bg-[#091a21]">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-7 shadow-sm dark:border-red-900/60 dark:bg-[#102a33]">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
            Unable to load result
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-[#D3E0EA]">
            {error}
          </h2>
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
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#F6F5F5] p-4 dark:bg-[#091a21]">
        <div className="rounded-2xl border border-[#D3E0EA] bg-white p-7 shadow-sm dark:border-[#245766] dark:bg-[#102a33]">
          <h2 className="text-xl font-bold text-[#276678] dark:text-[#D3E0EA]">
            Result not found.
          </h2>
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
    <div className="min-h-[calc(100vh-72px)] bg-[#F6F5F5] font-sans text-[#276678] dark:bg-[#091a21] dark:text-[#D3E0EA]">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#D3E0EA] bg-white p-5 shadow-sm dark:border-[#245766] dark:bg-[#102a33] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#276678] text-sm font-extrabold text-white">
                C
              </span>
              <span className="text-sm font-bold tracking-wide text-[#276678] dark:text-[#D3E0EA]">
                CATPrep
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              {result.mockTest.title}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-[#9bb5bf]">
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
              className="rounded-xl border border-[#D3E0EA] bg-[#F6F5F5] px-4 py-2.5 text-sm font-semibold text-[#276678] transition hover:border-[#1687A7] hover:bg-[#D3E0EA] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2 dark:border-[#245766] dark:bg-[#194353] dark:text-[#D3E0EA] dark:hover:bg-[#245766]"
            >
              Mock Tests
            </button>
          </div>
        </header>

        {/* Performance summary */}
        <section className="overflow-hidden rounded-2xl border border-[#D3E0EA] bg-white shadow-sm dark:border-[#245766] dark:bg-[#102a33]">
          <div className="border-b border-[#D3E0EA] px-5 py-4 dark:border-[#245766] sm:px-6">
            <h2 className="text-base font-bold text-[#276678] dark:text-[#D3E0EA]">
              Performance Summary
            </h2>
          </div>

          <div className="grid md:grid-cols-3">
            <div className="border-b border-[#D3E0EA] px-5 py-6 md:border-b-0 md:border-r dark:border-[#245766]">
              <p className="text-xs font-bold uppercase tracking-wider text-[#66808b] dark:text-[#9bb5bf]">
                Score
              </p>
              <p className="mt-2 text-4xl font-extrabold text-[#276678] dark:text-[#D3E0EA]">
                {result.score}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-[#9bb5bf]">
                CAT score
              </p>
            </div>

            <div className="border-b border-[#D3E0EA] px-5 py-6 md:border-b-0 md:border-r dark:border-[#245766]">
              <p className="text-xs font-bold uppercase tracking-wider text-[#66808b] dark:text-[#9bb5bf]">
                Accuracy
              </p>
              <div className="mt-2 flex items-end gap-2">
                <p className="text-4xl font-extrabold text-[#1687A7]">
                  {Math.round(result.accuracy)}%
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#D3E0EA] dark:bg-[#194353]">
                <div
                  className="h-full rounded-full bg-[#1687A7]"
                  style={{ width: `${Math.min(100, Math.max(0, result.accuracy || 0))}%` }}
                />
              </div>
            </div>

            <div className="px-5 py-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#66808b] dark:text-[#9bb5bf]">
                Time Taken
              </p>
              <p className="mt-2 text-4xl font-extrabold text-[#276678] dark:text-[#D3E0EA]">
                {minutes}:{String(seconds).padStart(2, "0")}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-[#9bb5bf]">
                Total test time
              </p>
            </div>
          </div>
        </section>

        {/* Answer breakdown */}
        <section className="mt-5 rounded-2xl border border-[#D3E0EA] bg-white p-5 shadow-sm dark:border-[#245766] dark:bg-[#102a33] sm:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#276678] dark:text-[#D3E0EA]">
                Answer Breakdown
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-[#9bb5bf]">
                How you performed across the paper.
              </p>
            </div>
            <span className="hidden text-sm font-semibold text-[#66808b] dark:text-[#9bb5bf] sm:block">
              {answerStats.total} questions
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-4 dark:border-green-900/60 dark:bg-green-950/30">
              <p className="text-xs font-bold uppercase tracking-wide text-green-700 dark:text-green-300">
                Correct
              </p>
              <p className="mt-1 text-2xl font-extrabold text-green-800 dark:text-green-200">
                {answerStats.correct}
              </p>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 dark:border-red-900/60 dark:bg-red-950/30">
              <p className="text-xs font-bold uppercase tracking-wide text-red-700 dark:text-red-300">
                Wrong
              </p>
              <p className="mt-1 text-2xl font-extrabold text-red-800 dark:text-red-200">
                {answerStats.wrong}
              </p>
            </div>

            <div className="rounded-xl border border-[#D3E0EA] bg-[#F6F5F5] px-4 py-4 dark:border-[#245766] dark:bg-[#194353]">
              <p className="text-xs font-bold uppercase tracking-wide text-[#66808b] dark:text-[#b4cbd2]">
                Unanswered
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#276678] dark:text-[#D3E0EA]">
                {answerStats.unanswered}
              </p>
            </div>

            <div className="rounded-xl border border-[#D3E0EA] bg-[#F6F5F5] px-4 py-4 dark:border-[#245766] dark:bg-[#194353]">
              <p className="text-xs font-bold uppercase tracking-wide text-[#66808b] dark:text-[#b4cbd2]">
                Total Questions
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#276678] dark:text-[#D3E0EA]">
                {answerStats.total}
              </p>
            </div>
          </div>
        </section>

        {/* Test information */}
        <section className="mt-5 rounded-2xl border border-[#D3E0EA] bg-white p-5 shadow-sm dark:border-[#245766] dark:bg-[#102a33] sm:p-6">
          <h2 className="text-base font-bold text-[#276678] dark:text-[#D3E0EA]">
            Test Information
          </h2>

          <div className="mt-4 grid grid-cols-1 divide-y divide-[#D3E0EA] rounded-xl border border-[#D3E0EA] bg-[#F6F5F5] sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-[#245766] dark:border-[#245766] dark:bg-[#194353]">
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-[#66808b] dark:text-[#b4cbd2]">Year</p>
              <p className="mt-1 text-sm font-bold text-[#276678] dark:text-[#D3E0EA]">
                {result.mockTest.year || "N/A"}
              </p>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-[#66808b] dark:text-[#b4cbd2]">Slot</p>
              <p className="mt-1 text-sm font-bold text-[#276678] dark:text-[#D3E0EA]">
                {result.mockTest.slot || "N/A"}
              </p>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-[#66808b] dark:text-[#b4cbd2]">Duration</p>
              <p className="mt-1 text-sm font-bold text-[#276678] dark:text-[#D3E0EA]">
                {result.mockTest.duration} minutes
              </p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#D3E0EA] pb-8 pt-5 dark:border-[#245766]">
          <button
            onClick={() => navigate(`/mock-test-review/${attemptId}`)}
            className="rounded-xl bg-[#276678] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1687A7] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2"
          >
            Review Answers
          </button>
          <button
            onClick={() => navigate(`/mock-test/${result.mockTest.id}`)}
            className="rounded-xl border border-[#D3E0EA] bg-white px-5 py-2.5 text-sm font-semibold text-[#276678] transition hover:border-[#1687A7] hover:bg-[#F6F5F5] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2 dark:border-[#245766] dark:bg-[#102a33] dark:text-[#D3E0EA] dark:hover:bg-[#194353]"
          >
            Take Test Again
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-transparent px-5 py-2.5 text-sm font-semibold text-[#66808b] transition hover:bg-[#D3E0EA]/50 hover:text-[#276678] dark:text-[#9bb5bf] dark:hover:bg-[#194353] dark:hover:text-[#D3E0EA]"
          >
            Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

export default MockTestResultPage;

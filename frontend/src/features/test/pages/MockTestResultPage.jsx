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
        setError(
          error.response?.data?.message || "Failed to load result."
        );
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 p-4 font-sans">
        <div className="rounded-xl bg-white px-6 py-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Loading result...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 p-4 font-sans">
        <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-red-600">{error}</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 p-4 font-sans">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
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
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 font-sans text-slate-900">
      <main className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:py-5">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {result.mockTest.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Your performance summary
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          {/* Main statistics */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-center">
              <p className="text-xs font-semibold text-blue-700">Score</p>
              <p className="mt-1 text-3xl font-extrabold text-blue-900">
                {result.score}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 px-4 py-3 text-center">
              <p className="text-xs font-semibold text-green-700">Accuracy</p>
              <p className="mt-1 text-3xl font-extrabold text-green-900">
                {Math.round(result.accuracy)}%
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-xs font-semibold text-slate-600">Time Taken</p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {minutes}:{String(seconds).padStart(2, "0")}
              </p>
            </div>
          </div>

          {/* Answer breakdown */}
          <div className="mt-4 border-t border-slate-200 pt-4">
            <h2 className="text-base font-bold text-slate-900">
              Answer Breakdown
            </h2>

            <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-2.5">
                <p className="text-xs font-semibold text-green-700">Correct</p>
                <p className="mt-0.5 text-2xl font-bold text-green-800">
                  {answerStats.correct}
                </p>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
                <p className="text-xs font-semibold text-red-700">Wrong</p>
                <p className="mt-0.5 text-2xl font-bold text-red-800">
                  {answerStats.wrong}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <p className="text-xs font-semibold text-slate-600">
                  Unanswered
                </p>
                <p className="mt-0.5 text-2xl font-bold text-slate-800">
                  {answerStats.unanswered}
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5">
                <p className="text-xs font-semibold text-blue-700">
                  Total Questions
                </p>
                <p className="mt-0.5 text-2xl font-bold text-blue-800">
                  {answerStats.total}
                </p>
              </div>
            </div>
          </div>

          {/* Test information */}
          <div className="mt-4 border-t border-slate-200 pt-4">
            <h2 className="text-base font-bold text-slate-900">
              Test Information
            </h2>

            <div className="mt-3 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs text-slate-500">Year</p>
                <p className="mt-0.5 text-sm font-semibold">
                  {result.mockTest.year || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Slot</p>
                <p className="mt-0.5 text-sm font-semibold">
                  {result.mockTest.slot || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Duration</p>
                <p className="mt-0.5 text-sm font-semibold">
                  {result.mockTest.duration} minutes
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
            <button
              onClick={() => navigate(`/mock-test/${result.mockTest.id}`)}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Take Test Again
            </button>

            <button
              onClick={() => navigate("/mock-tests")}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Mock Tests
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Dashboard
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MockTestResultPage;

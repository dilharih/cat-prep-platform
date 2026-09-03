import { useEffect, useMemo, useState } from "react";
import { getMyAttempts } from "../api/attempt.api";

function AttemptHistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resultFilter, setResultFilter] = useState("ALL");
  const [sectionFilter, setSectionFilter] = useState("ALL");

  useEffect(() => {
    async function loadAttempts() {
      try {
        const data = await getMyAttempts();
        setAttempts(data);
      } catch (error) {
        console.error("Failed to load attempt history:", error);
        setError(error.response?.data?.message || "Failed to load attempt history.");
      } finally {
        setLoading(false);
      }
    }

    loadAttempts();
  }, []);

  const filteredAttempts = useMemo(() => {
    return attempts.filter((attempt) => {
      if (resultFilter === "CORRECT" && !attempt.isCorrect) return false;
      if (resultFilter === "WRONG" && attempt.isCorrect) return false;

      if (
        sectionFilter !== "ALL" &&
        attempt.question.section !== sectionFilter
      ) {
        return false;
      }

      return true;
    });
  }, [attempts, resultFilter, sectionFilter]);

  if (loading) {
    return (
      <div className="history-page flex min-h-screen items-center justify-center p-4">
        <div className="history-panel rounded-2xl p-7 text-center shadow-sm">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#D3E0EA] border-t-[#1687A7]" />
          <h1 className="history-heading text-lg font-semibold">Loading history...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="history-title text-3xl font-extrabold tracking-tight sm:text-4xl">
            Question History
          </h1>
          <div className="history-error mt-6 rounded-2xl border p-5 text-sm font-medium">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page min-h-screen font-sans">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header>
          <p className="history-eyebrow text-xs font-bold uppercase tracking-[0.18em]">
            Your progress
          </p>
          <h1 className="history-title mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Question History
          </h1>
          <p className="history-muted mt-2 text-sm sm:text-base">
            Review the questions you have attempted and learn from your mistakes.
          </p>
        </header>

        <section className="history-panel mt-6 rounded-2xl p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="history-label mb-2 text-xs font-bold uppercase tracking-wider">
                Result
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  ["ALL", "All"],
                  ["CORRECT", "Correct"],
                  ["WRONG", "Wrong"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setResultFilter(value)}
                    className={`history-filter rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2 ${
                      resultFilter === value ? "active" : ""
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full md:w-auto">
              <label
                htmlFor="history-section"
                className="history-label mb-2 block text-xs font-bold uppercase tracking-wider"
              >
                Section
              </label>
              <select
                id="history-section"
                value={sectionFilter}
                onChange={(event) => setSectionFilter(event.target.value)}
                className="history-select w-full rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition focus:ring-2 focus:ring-[#1687A7] md:min-w-44"
              >
                <option value="ALL">All Sections</option>
                <option value="VARC">VARC</option>
                <option value="DILR">DILR</option>
                <option value="QA">QA</option>
              </select>
            </div>
          </div>

          <div className="history-divider mt-5 border-t pt-4 text-sm">
            Showing <span className="history-count font-bold">{filteredAttempts.length}</span> of{" "}
            <span className="history-count font-bold">{attempts.length}</span> attempts
          </div>
        </section>

        {filteredAttempts.length === 0 && (
          <section className="history-panel mt-6 rounded-2xl p-8 text-center shadow-sm">
            <h2 className="history-heading text-xl font-bold">No attempts found</h2>
            <p className="history-muted mt-2 text-sm">
              Try changing your filters or complete a mock test question first.
            </p>
          </section>
        )}

        {filteredAttempts.length > 0 && (
          <div className="mt-6 space-y-5">
            {filteredAttempts.map((attempt, index) => {
              const question = attempt.question;
              const isCorrect = attempt.isCorrect;
              const selectedAnswer = attempt.selectedAnswer || "Not answered";

              return (
                <article
                  key={attempt.id}
                  className="history-card rounded-2xl shadow-sm"
                >
                  <div className="history-card-header flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="history-question-number inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-extrabold">
                        {index + 1}
                      </span>
                      <span className="history-badge history-badge-section rounded-lg px-3 py-1 text-xs font-bold">
                        {question.section}
                      </span>
                      <span className="history-badge rounded-lg px-3 py-1 text-xs font-semibold">
                        {question.topic}
                      </span>
                      <span className="history-badge rounded-lg px-3 py-1 text-xs font-semibold">
                        {question.year}
                      </span>
                      <span className="history-badge rounded-lg px-3 py-1 text-xs font-semibold">
                        Slot {question.slot}
                      </span>
                    </div>

                    <span
                      className={`history-status rounded-full px-3 py-1 text-xs font-bold ${
                        isCorrect ? "correct" : "wrong"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Wrong"}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <p className="history-question text-base font-semibold leading-7 sm:text-lg">
                      {question.question}
                    </p>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="history-answer rounded-xl border p-4">
                        <p className="history-label text-xs font-bold uppercase tracking-wider">
                          Your Answer
                        </p>
                        <p
                          className={`mt-2 text-sm font-bold ${
                            isCorrect ? "history-answer-correct" : "history-answer-wrong"
                          }`}
                        >
                          {selectedAnswer}
                        </p>
                      </div>

                      <div className="history-answer rounded-xl border p-4">
                        <p className="history-label text-xs font-bold uppercase tracking-wider">
                          Correct Answer
                        </p>
                        <p className="history-answer-correct mt-2 text-sm font-bold">
                          {question.correctAnswer}
                        </p>
                      </div>
                    </div>

                    {question.explanation && (
                      <div className="history-explanation mt-4 rounded-xl border p-4">
                        <p className="history-explanation-title text-xs font-bold uppercase tracking-wider">
                          Explanation
                        </p>
                        <p className="history-explanation-text mt-2 text-sm leading-6">
                          {question.explanation}
                        </p>
                      </div>
                    )}

                    <div className="history-meta mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4 text-xs sm:text-sm">
                      <span>Time: {attempt.timeTaken}s</span>
                      <span>Attempted: {new Date(attempt.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default AttemptHistoryPage;

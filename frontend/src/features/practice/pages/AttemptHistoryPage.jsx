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
      const unanswered = !attempt.selectedAnswer;

      if (resultFilter === "CORRECT" && (!attempt.isCorrect || unanswered)) return false;
      if (resultFilter === "WRONG" && (attempt.isCorrect || unanswered)) return false;
      if (sectionFilter !== "ALL" && attempt.question.section !== sectionFilter) return false;
      return true;
    });
  }, [attempts, resultFilter, sectionFilter]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F5F5] p-4 dark:bg-[#091A21]">
        <div className="rounded-2xl border border-[#D3E0EA] bg-white p-7 text-center shadow-sm dark:border-[#245766] dark:bg-[#102A33]">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[#D3E0EA] border-t-[#1687A7]" />
          <h1 className="text-lg font-semibold text-[#276678] dark:text-[#D3E0EA]">Loading history...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F6F5F5] p-4 text-[#276678] dark:bg-[#091A21] dark:text-[#D3E0EA] sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#276678] dark:text-[#D3E0EA] sm:text-4xl">
            Question History
          </h1>
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F5F5] font-sans text-[#276678] dark:bg-[#091A21] dark:text-[#D3E0EA]">
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1687A7]">Your progress</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#276678] dark:text-[#F1F8FA] sm:text-4xl">
            Question History
          </h1>
          <p className="mt-2 text-sm text-[#5F7F8D] dark:text-[#9BB5BF] sm:text-base">
            Review the questions you have attempted and learn from your mistakes.
          </p>
        </header>

        <section className="mt-6 rounded-2xl border border-[#D3E0EA] bg-white p-5 shadow-sm dark:border-[#245766] dark:bg-[#102A33] sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#276678] dark:text-[#D3E0EA]">Result</p>
              <div className="flex flex-wrap gap-2">
                {[["ALL", "All"], ["CORRECT", "Correct"], ["WRONG", "Wrong"]].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setResultFilter(value)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2 ${
                      resultFilter === value
                        ? "bg-[#1687A7] text-white shadow-sm"
                        : "border border-[#D3E0EA] bg-[#F6F5F5] text-[#276678] hover:bg-[#D3E0EA] dark:border-[#245766] dark:bg-[#194353] dark:text-[#D3E0EA] dark:hover:bg-[#245766]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full md:w-auto">
              <label htmlFor="history-section" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#276678] dark:text-[#D3E0EA]">
                Section
              </label>
              <select
                id="history-section"
                value={sectionFilter}
                onChange={(event) => setSectionFilter(event.target.value)}
                className="w-full rounded-xl border border-[#D3E0EA] bg-white px-4 py-2.5 text-sm font-medium text-[#276678] outline-none transition focus:border-[#1687A7] focus:ring-2 focus:ring-[#1687A7]/30 md:min-w-44 dark:border-[#245766] dark:bg-[#0D252E] dark:text-[#D3E0EA]"
              >
                <option value="ALL">All Sections</option>
                <option value="VARC">VARC</option>
                <option value="DILR">DILR</option>
                <option value="QA">QA</option>
              </select>
            </div>
          </div>

          <div className="mt-5 border-t border-[#D3E0EA] pt-4 text-sm text-[#5F7F8D] dark:border-[#245766] dark:text-[#9BB5BF]">
            Showing <span className="font-bold text-[#276678] dark:text-[#D3E0EA]">{filteredAttempts.length}</span> of{" "}
            <span className="font-bold text-[#276678] dark:text-[#D3E0EA]">{attempts.length}</span> attempts
          </div>
        </section>

        {filteredAttempts.length === 0 && (
          <section className="mt-6 rounded-2xl border border-[#D3E0EA] bg-white p-8 text-center shadow-sm dark:border-[#245766] dark:bg-[#102A33]">
            <h2 className="text-xl font-bold text-[#276678] dark:text-[#D3E0EA]">No attempts found</h2>
            <p className="mt-2 text-sm text-[#5F7F8D] dark:text-[#9BB5BF]">
              Try changing your filters or complete a mock test question first.
            </p>
          </section>
        )}

        {filteredAttempts.length > 0 && (
          <div className="mt-6 space-y-5">
            {filteredAttempts.map((attempt, index) => {
              const question = attempt.question;
              const isCorrect = attempt.isCorrect;
              const isUnanswered = !attempt.selectedAnswer;
              const selectedAnswer = attempt.selectedAnswer || "Not answered";

              return (
                <article key={attempt.id} className="overflow-hidden rounded-2xl border border-[#D3E0EA] bg-white shadow-sm dark:border-[#245766] dark:bg-[#102A33]">
                  <div className="flex flex-col gap-3 border-b border-[#D3E0EA] bg-[#F6F5F5] px-5 py-4 dark:border-[#245766] dark:bg-[#194353] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#276678] px-2 text-xs font-extrabold text-white">
                        {index + 1}
                      </span>
                      <span className="rounded-lg bg-[#D3E0EA] px-3 py-1 text-xs font-bold text-[#276678] dark:bg-[#245766] dark:text-[#D3E0EA]">
                        {question.section}
                      </span>
                      <span className="rounded-lg border border-[#D3E0EA] bg-white px-3 py-1 text-xs font-semibold text-[#5F7F8D] dark:border-[#245766] dark:bg-[#102A33] dark:text-[#B4CBD2]">
                        {question.topic}
                      </span>
                      <span className="rounded-lg border border-[#D3E0EA] bg-white px-3 py-1 text-xs font-semibold text-[#5F7F8D] dark:border-[#245766] dark:bg-[#102A33] dark:text-[#B4CBD2]">
                        {question.year}
                      </span>
                      <span className="rounded-lg border border-[#D3E0EA] bg-white px-3 py-1 text-xs font-semibold text-[#5F7F8D] dark:border-[#245766] dark:bg-[#102A33] dark:text-[#B4CBD2]">
                        Slot {question.slot}
                      </span>
                      {attempt.source === "MOCK_TEST" && (
                        <span className="rounded-lg bg-[#EAF5F8] px-3 py-1 text-xs font-bold text-[#1687A7] dark:bg-[#123740] dark:text-[#7FD3E8]">
                          Mock Test
                        </span>
                      )}
                    </div>

                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isUnanswered
                        ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        : isCorrect
                          ? "bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-200"
                    }`}>
                      {isUnanswered ? "Unanswered" : isCorrect ? "Correct" : "Wrong"}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <p className="text-base font-semibold leading-7 text-[#276678] dark:text-[#F1F8FA] sm:text-lg">
                      {question.question}
                    </p>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border border-[#D3E0EA] bg-[#F6F5F5] p-4 dark:border-[#245766] dark:bg-[#194353]">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#5F7F8D] dark:text-[#B4CBD2]">Your Answer</p>
                        <p className={`mt-2 text-sm font-bold ${
                          isUnanswered
                            ? "text-[#5F7F8D] dark:text-[#B4CBD2]"
                            : isCorrect
                              ? "text-green-700 dark:text-green-300"
                              : "text-red-700 dark:text-red-300"
                        }`}>
                          {selectedAnswer}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#D3E0EA] bg-[#F6F5F5] p-4 dark:border-[#245766] dark:bg-[#194353]">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#5F7F8D] dark:text-[#B4CBD2]">Correct Answer</p>
                        <p className="mt-2 text-sm font-bold text-green-700 dark:text-green-300">
                          {question.correctAnswer}
                        </p>
                      </div>
                    </div>

                    {question.explanation && (
                      <div className="mt-4 rounded-xl border border-[#B8D9E4] bg-[#EAF5F8] p-4 dark:border-[#276678] dark:bg-[#194353]">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#1687A7] dark:text-[#45AECA]">Explanation</p>
                        <p className="mt-2 text-sm leading-6 text-[#276678] dark:text-[#D3E0EA]">
                          {question.explanation}
                        </p>
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#D3E0EA] pt-4 text-xs text-[#5F7F8D] dark:border-[#245766] dark:text-[#9BB5BF] sm:text-sm">
                      <span>{attempt.source === "MOCK_TEST" ? "Mock test" : "Question"} · Time: {attempt.timeTaken}s</span>
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

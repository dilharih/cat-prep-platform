import { useEffect, useMemo, useState } from "react";
import { getMyAttempts } from "../api/attempt.api";

function AttemptHistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [resultFilter, setResultFilter] =
    useState("ALL");

  const [sectionFilter, setSectionFilter] =
    useState("ALL");

  useEffect(() => {
    async function loadAttempts() {
      try {
        const data = await getMyAttempts();

        setAttempts(data);
      } catch (error) {
        console.error(
          "Failed to load attempt history:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load attempt history."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAttempts();
  }, []);

  // =========================
  // FILTER ATTEMPTS
  // =========================

  const filteredAttempts = useMemo(() => {
    return attempts.filter((attempt) => {
      // Result filter
      if (
        resultFilter === "CORRECT" &&
        !attempt.isCorrect
      ) {
        return false;
      }

      if (
        resultFilter === "WRONG" &&
        attempt.isCorrect
      ) {
        return false;
      }

      // Section filter
      if (
        sectionFilter !== "ALL" &&
        attempt.question.section !== sectionFilter
      ) {
        return false;
      }

      return true;
    });
  }, [
    attempts,
    resultFilter,
    sectionFilter,
  ]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Question History
        </h1>

        <p className="mt-2 text-gray-500">
          Loading your attempts...
        </p>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Question History
        </h1>

        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-8">

      {/* =========================
          HEADER
      ========================== */}

      <div>
        <h1 className="text-3xl font-bold">
          Question History
        </h1>

        <p className="mt-2 text-gray-500">
          Review the questions you have attempted.
        </p>
      </div>

      {/* =========================
          FILTERS
      ========================== */}

      <div className="mt-8 rounded-xl border bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          {/* Result Filter */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Result
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setResultFilter("ALL")
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  resultFilter === "ALL"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>

              <button
                onClick={() =>
                  setResultFilter("CORRECT")
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  resultFilter === "CORRECT"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Correct
              </button>

              <button
                onClick={() =>
                  setResultFilter("WRONG")
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  resultFilter === "WRONG"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Wrong
              </button>
            </div>
          </div>

          {/* Section Filter */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Section
            </p>

            <select
              value={sectionFilter}
              onChange={(event) =>
                setSectionFilter(
                  event.target.value
                )
              }
              className="rounded-lg border px-4 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="ALL">
                All Sections
              </option>

              <option value="VARC">
                VARC
              </option>

              <option value="DILR">
                DILR
              </option>

              <option value="QA">
                QA
              </option>
            </select>
          </div>

        </div>

        {/* Result count */}
        <div className="mt-5 border-t pt-4 text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredAttempts.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {attempts.length}
          </span>{" "}
          attempts
        </div>
      </div>

      {/* =========================
          EMPTY STATE
      ========================== */}

      {filteredAttempts.length === 0 && (
        <div className="mt-8 rounded-xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold">
            No attempts found
          </h2>

          <p className="mt-2 text-gray-500">
            Try changing your filters or solve some
            more questions.
          </p>
        </div>
      )}

      {/* =========================
          ATTEMPTS
      ========================== */}

      {filteredAttempts.length > 0 && (
        <div className="mt-8 space-y-6">
          {filteredAttempts.map((attempt) => {
            const question =
              attempt.question;

            return (
              <div
                key={attempt.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >

                {/* Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">

                  <div className="flex flex-wrap gap-2">

                    <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      {question.section}
                    </span>

                    <span className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                      {question.topic}
                    </span>

                    <span className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                      {question.year}
                    </span>

                    <span className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                      Slot {question.slot}
                    </span>

                  </div>

                  {/* Result */}
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      attempt.isCorrect
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {attempt.isCorrect
                      ? "Correct"
                      : "Wrong"}
                  </span>
                </div>

                {/* Question */}
                <div className="mt-5">
                  <h2 className="text-lg font-semibold">
                    {question.question}
                  </h2>
                </div>

                {/* Answers */}
                <div className="mt-5 grid gap-4 md:grid-cols-2">

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Your Answer
                    </p>

                    <p
                      className={`mt-1 font-semibold ${
                        attempt.isCorrect
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {attempt.selectedAnswer ||
                        "Not answered"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Correct Answer
                    </p>

                    <p className="mt-1 font-semibold text-green-600">
                      {question.correctAnswer}
                    </p>
                  </div>

                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="mt-5 rounded-lg border bg-blue-50 p-4">
                    <p className="text-sm font-semibold text-blue-800">
                      Explanation
                    </p>

                    <p className="mt-1 text-gray-700">
                      {question.explanation}
                    </p>
                  </div>
                )}

                {/* Metadata */}
                <div className="mt-5 flex flex-wrap gap-6 border-t pt-4 text-sm text-gray-500">

                  <span>
                    Time:{" "}
                    {attempt.timeTaken}s
                  </span>

                  <span>
                    Attempted:{" "}
                    {new Date(
                      attempt.createdAt
                    ).toLocaleString()}
                  </span>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AttemptHistoryPage;
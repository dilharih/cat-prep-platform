import { useEffect, useState } from "react";
import { getMyAttempts } from "../api/attempt.api";

function AttemptHistoryPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Question History
        </h1>

        <p className="mt-2 text-gray-500">
          Review the questions you have attempted.
        </p>
      </div>

      {/* Empty State */}
      {attempts.length === 0 && (
        <div className="mt-8 rounded-xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold">
            No attempts yet
          </h2>

          <p className="mt-2 text-gray-500">
            Start practicing questions to see your
            history here.
          </p>
        </div>
      )}

      {/* Attempts */}
      {attempts.length > 0 && (
        <div className="mt-8 space-y-6">
          {attempts.map((attempt) => {
            const question =
              attempt.question;

            return (
              <div
                key={attempt.id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                {/* Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">

                  <div className="flex gap-2">
                    <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      {question.section}
                    </span>

                    <span className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                      {question.topic}
                    </span>

                    <span className="rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                      {question.year}
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
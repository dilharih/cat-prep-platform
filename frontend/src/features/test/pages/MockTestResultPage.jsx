import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  // Loading
  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">
          Loading result...
        </h2>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold text-red-600">
          {error}
        </h2>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">
          Result not found.
        </h2>
      </div>
    );
  }

  // Convert seconds into minutes and seconds
  const minutes = Math.floor(result.timeTaken / 60);
  const seconds = result.timeTaken % 60;

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {result.mockTest.title}
        </h1>

        <p className="mt-2 text-gray-500">
          Mock Test Result
        </p>
      </div>

      {/* Result Card */}
      <div className="rounded-xl border bg-white p-8 shadow-sm">

        {/* Main Stats */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* Score */}
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">
              Score
            </p>

            <p className="mt-2 text-4xl font-bold">
              {result.score}
            </p>
          </div>

          {/* Accuracy */}
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">
              Accuracy
            </p>

            <p className="mt-2 text-4xl font-bold">
              {result.accuracy}%
            </p>
          </div>

          {/* Time */}
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <p className="text-sm text-gray-500">
              Time Taken
            </p>

            <p className="mt-2 text-4xl font-bold">
              {minutes}:
              {String(seconds).padStart(2, "0")}
            </p>
          </div>

        </div>

        {/* Test Information */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold">
            Test Information
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">

            <div>
              <p className="text-sm text-gray-500">
                Year
              </p>

              <p className="font-medium">
                {result.mockTest.year || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Slot
              </p>

              <p className="font-medium">
                {result.mockTest.slot || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Duration
              </p>

              <p className="font-medium">
                {result.mockTest.duration} minutes
              </p>
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 border-t pt-6">

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => navigate("/mock-test")}
            className="rounded-lg bg-gray-200 px-5 py-2 font-medium hover:bg-gray-300"
          >
            Take Test Again
          </button>

        </div>
      </div>
    </div>
  );
}

export default MockTestResultPage;
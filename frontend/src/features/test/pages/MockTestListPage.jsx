import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../lib/api";

function MockTestListPage() {
  const navigate = useNavigate();

  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMockTests() {
      try {
        const response = await api.get("/mock-tests");

        setMockTests(response.data.data);
      } catch (error) {
        console.error(
          "Failed to load mock tests:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load question papers."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMockTests();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Question Papers
        </h1>

        <p className="mt-2 text-gray-500">
          Loading available papers...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Question Papers
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
          Question Papers
        </h1>

        <p className="mt-2 text-gray-500">
          Choose a CAT paper and solve the complete
          question paper.
        </p>
      </div>

      {/* Empty State */}
      {mockTests.length === 0 && (
        <div className="mt-8 rounded-xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold">
            No question papers available
          </h2>

          <p className="mt-2 text-gray-500">
            Question papers will appear here once
            they are added.
          </p>
        </div>
      )}

      {/* Papers */}
      {mockTests.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockTests.map((mockTest) => (
            <div
              key={mockTest.id}
              className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {/* Title */}
              <h2 className="text-xl font-bold">
                {mockTest.title}
              </h2>

              {/* Metadata */}
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                {mockTest.year && (
                  <p>
                    <span className="font-medium">
                      Year:
                    </span>{" "}
                    {mockTest.year}
                  </p>
                )}

                {mockTest.slot && (
                  <p>
                    <span className="font-medium">
                      Slot:
                    </span>{" "}
                    {mockTest.slot}
                  </p>
                )}

                <p>
                  <span className="font-medium">
                    Questions:
                  </span>{" "}
                  {mockTest._count?.questions || 0}
                </p>

                <p>
                  <span className="font-medium">
                    Duration:
                  </span>{" "}
                  {mockTest.duration} minutes
                </p>
              </div>

              {/* Official Badge */}
              <div className="mt-4">
                {mockTest.isOfficial ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Official Paper
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    Practice Paper
                  </span>
                )}
              </div>

              {/* Start */}
              <button
                onClick={() =>
                  navigate(
                    `/mock-test/${mockTest.id}`
                  )
                }
                className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Start Paper
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MockTestListPage;
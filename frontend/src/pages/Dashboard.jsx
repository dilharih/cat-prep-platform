import { useEffect, useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import api from "../lib/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const correctAnswers =
  stats?.correctAnswers ??
  Math.round(
    (stats?.questionsSolved || 0) *
      ((stats?.accuracy || 0) / 100)
  );

const wrongAnswers =
  stats?.wrongAnswers ??
  Math.max(
    0,
    (stats?.questionsSolved || 0) -
      correctAnswers
  );

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const response = await api.get(
          "/dashboard/stats"
        );

        setStats(response.data.data);
      } catch (error) {
        console.error(
          "Failed to load dashboard stats:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Loading your statistics...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-500">
        Track your CAT preparation progress.
      </p>

      {/* Main Statistics */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Questions Solved"
          value={stats.questionsSolved}
          subtitle={
            stats.questionsSolved === 0
              ? "Start practicing today"
              : "Questions attempted"
          }
        />

        <StatCard
          title="Accuracy"
          value={`${stats.accuracy}%`}
          subtitle={
            stats.questionsSolved === 0
              ? "No attempts yet"
              : `${stats.correctAnswers} correct answers`
          }
        />

        <StatCard
          title="Mock Tests"
          value={stats.mockTests}
          subtitle={
            stats.mockTests === 0
              ? "Take your first mock"
              : "Mock tests completed"
          }
        />

        <StatCard
          title="Study Streak"
          value={stats.studyStreak}
          subtitle={
            stats.studyStreak === 1
              ? "day"
              : "days"
          }
        />
      </div>

      {/* Practice Summary */}
      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">
          Practice Summary
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Your overall question-solving performance.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">

          {/* Solved */}
          <div>
            <p className="text-sm text-gray-500">
              Questions Solved
            </p>

            <p className="mt-1 text-2xl font-bold">
              {stats.questionsSolved}
            </p>
          </div>

          {/* Correct */}
          <div>
            <p className="text-sm text-gray-500">
              Correct
            </p>

            <p className="mt-1 text-2xl font-bold">
              {correctAnswers}
            </p>
          </div>

          {/* Wrong */}
          <div>
            <p className="text-sm text-gray-500">
              Wrong
            </p>

            <p className="mt-1 text-2xl font-bold">
              {wrongAnswers}
            </p>
          </div>
        </div>

        {/* Accuracy Progress */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Accuracy
            </p>

            <p className="text-sm font-semibold">
              {stats.accuracy}%
            </p>
          </div>

          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${Math.min(
                  stats.accuracy,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
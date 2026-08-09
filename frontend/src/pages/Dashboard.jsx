import { useEffect, useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import api from "../lib/api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const response = await api.get("/dashboard/stats");

        setStats(response.data.data);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);

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

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-500">
          Loading your statistics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-500">
        Track your CAT preparation progress.
      </p>

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
              : "Overall accuracy"
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
          subtitle="Stay consistent"
        />
      </div>
    </div>
  );
}

export default Dashboard;
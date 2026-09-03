import { useEffect, useState } from "react";
import { FiArrowRight, FiBarChart2, FiCheckCircle, FiClock, FiTarget, FiTrendingUp, FiXCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../lib/api";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data.data);
      } catch (requestError) {
        console.error("Failed to load dashboard stats:", requestError);
        setError(
          requestError.response?.data?.message ||
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
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-36 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const questionsSolved = stats?.questionsSolved ?? 0;
  const accuracy = stats?.accuracy ?? 0;
  const mockTests = stats?.mockTests ?? 0;
  const studyStreak = stats?.studyStreak ?? 0;
  const correctAnswers = stats?.correctAnswers ?? Math.round(questionsSolved * (accuracy / 100));
  const wrongAnswers = stats?.wrongAnswers ?? Math.max(0, questionsSolved - correctAnswers);
  const displayName = user?.name || user?.username || "CAT Aspirant";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Welcome panel */}
      <section className="relative overflow-hidden rounded-[2rem] border border-[#276678]/20 bg-gradient-to-br from-[#276678] via-[#1687a7] to-[#276678] p-7 text-white shadow-[0_18px_45px_rgba(39,102,120,0.28)] sm:p-9">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-32 right-20 h-72 w-72 rounded-full bg-[#d3e0ea]/10 blur-3xl" />

        <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-2xl font-bold shadow-lg backdrop-blur-sm">
              {initial}
            </div>
            <div>
              <p className="text-sm font-medium text-white/75">Welcome back</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{displayName}!</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                Keep building your CAT momentum. Your next mock test is one step closer to exam day.
              </p>
            </div>
          </div>

          <Link
            to="/mock-tests"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#276678] shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Take a Mock Test
            <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Depth cards */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<FiTarget />} label="Questions Solved" value={questionsSolved} detail={questionsSolved ? "Keep the momentum going" : "Your journey starts here"} />
        <StatCard icon={<FiTrendingUp />} label="Accuracy" value={`${accuracy}%`} detail={questionsSolved ? `${correctAnswers} correct answers` : "No attempts yet"} />
        <StatCard icon={<FiBarChart2 />} label="Mock Tests" value={mockTests} detail={mockTests ? "Tests completed" : "Take your first mock"} />
        <StatCard icon={<FiClock />} label="Study Streak" value={studyStreak} detail={studyStreak === 1 ? "day active" : "days active"} />
      </section>

      <div className="grid gap-7 lg:grid-cols-[1.5fr_1fr]">
        {/* Performance */}
        <section className="rounded-[2rem] border border-slate-200/80 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_15px_40px_rgba(0,0,0,0.22)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#1687a7]">Your performance</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Practice overview</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">A quick look at how your attempts are going.</p>
            </div>
            <div className="hidden rounded-xl bg-[#d3e0ea]/60 p-3 text-xl text-[#276678] dark:bg-[#194353] dark:text-[#d3e0ea] sm:block">
              <FiBarChart2 />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <PerformanceItem icon={<FiTarget />} label="Attempted" value={questionsSolved} />
            <PerformanceItem icon={<FiCheckCircle />} label="Correct" value={correctAnswers} />
            <PerformanceItem icon={<FiXCircle />} label="Wrong" value={wrongAnswers} />
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between text-sm font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Accuracy</span>
              <span className="text-[#276678] dark:text-[#7ec6d9]">{accuracy}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#276678] to-[#1687a7] transition-all duration-700"
                style={{ width: `${Math.min(accuracy, 100)}%` }}
              />
            </div>
          </div>
        </section>

        {/* Next step */}
        <section className="relative overflow-hidden rounded-[2rem] border border-[#1687a7]/20 bg-[#f6f5f5] p-7 shadow-[0_12px_35px_rgba(39,102,120,0.10)] dark:border-[#1687a7]/30 dark:bg-[#102a33] sm:p-8">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#1687a7]/10" />
          <p className="relative text-sm font-semibold uppercase tracking-wider text-[#1687a7]">Next step</p>
          <h2 className="relative mt-2 text-2xl font-bold text-[#276678] dark:text-[#d3e0ea]">Ready for a timed challenge?</h2>
          <p className="relative mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Simulate the pressure of the real exam with a full-length mock test and review your performance afterwards.
          </p>
          <Link
            to="/mock-tests"
            className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-[#276678] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#276678]/20 transition hover:-translate-y-0.5 hover:bg-[#1687a7]"
          >
            Explore Mock Tests
            <FiArrowRight />
          </Link>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, detail }) {
  return (
    <div className="group relative overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_8px_0_0_#d3e0ea,0_15px_30px_rgba(15,23,42,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_0_0_#1687a7,0_22px_38px_rgba(15,23,42,0.14)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_8px_0_0_#194353,0_18px_35px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_8px_0_0_#1687a7,0_24px_42px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d3e0ea]/70 text-xl text-[#276678] dark:bg-[#194353] dark:text-[#7ec6d9]">
          {icon}
        </div>
        <span className="h-2 w-2 rounded-full bg-[#1687a7] opacity-60 transition group-hover:scale-150" />
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{value}</p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
    </div>
  );
}

function PerformanceItem({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-800/60">
      <div className="flex items-center gap-2 text-[#276678] dark:text-[#7ec6d9]">{icon}<span className="text-sm font-medium">{label}</span></div>
      <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

export default Dashboard;

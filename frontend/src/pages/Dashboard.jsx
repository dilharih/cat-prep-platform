import StatCard from "../components/dashboard/StatCard";

function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-500">
        Track your CAT preparation progress.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Questions Solved"
          value="0"
          subtitle="Start practicing today"
        />

        <StatCard
          title="Accuracy"
          value="0%"
          subtitle="No attempts yet"
        />

        <StatCard
          title="Mock Tests"
          value="0"
          subtitle="Take your first mock"
        />

        <StatCard
          title="Study Streak"
          value="0"
          subtitle="Stay consistent"
        />
      </div>
    </div>
  );
}

export default Dashboard;
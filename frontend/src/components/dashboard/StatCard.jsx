function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition">
      <h3 className="text-sm font-medium text-gray-500">
        {title}
      </h3>

      <p className="mt-3 text-4xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        {subtitle}
      </p>
    </div>
  );
}

export default StatCard;
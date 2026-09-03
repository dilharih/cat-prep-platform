import { useEffect, useState } from "react";
import { FiArrowRight, FiBookOpen, FiCalendar, FiClock, FiFilter, FiLayers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../../lib/api";

function MockTestListPage() {
  const navigate = useNavigate();

  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [slotFilter, setSlotFilter] = useState("ALL");

  useEffect(() => {
    async function loadMockTests() {
      try {
        const response = await api.get("/mock-tests");
        setMockTests(response.data.data);
      } catch (requestError) {
        console.error("Failed to load mock tests:", requestError);
        setError(
          requestError.response?.data?.message ||
            "Failed to load question papers."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMockTests();
  }, []);

  const years = [
    ...new Set(mockTests.map((mockTest) => mockTest.year).filter(Boolean)),
  ].sort((a, b) => b - a);

  const slots = [
    ...new Set(mockTests.map((mockTest) => mockTest.slot).filter(Boolean)),
  ].sort((a, b) => a - b);

  const filteredMockTests = mockTests.filter((mockTest) => {
    const matchesYear =
      yearFilter === "ALL" || String(mockTest.year) === yearFilter;
    const matchesSlot =
      slotFilter === "ALL" || String(mockTest.slot) === slotFilter;

    return matchesYear && matchesSlot;
  });

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 pb-12 sm:pb-16">
        <div className="h-32 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-slate-800" />
        <div className="rounded-[2rem] bg-slate-200 p-6 dark:bg-slate-800">
          <div className="h-5 w-28 animate-pulse rounded bg-slate-300 dark:bg-slate-700" />
          <div className="mt-5 h-11 w-full animate-pulse rounded-xl bg-slate-300 dark:bg-slate-700" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-[1.75rem] bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl pb-12 sm:pb-16">
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-7 text-red-700 shadow-sm dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          <p className="text-sm font-semibold uppercase tracking-wider">Question Papers</p>
          <h1 className="mt-2 text-2xl font-bold">Unable to load papers</h1>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pt-5 pb-12 sm:pt-7 sm:pb-16">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#276678]/20 bg-gradient-to-br from-[#276678] via-[#1687a7] to-[#276678] p-7 text-white shadow-[0_18px_45px_rgba(39,102,120,0.22)] sm:p-9">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-28 right-24 h-60 w-60 rounded-full bg-[#d3e0ea]/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              <FiBookOpen />
              CAT preparation
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Question Papers
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Choose a CAT paper and solve the complete question paper in a timed exam environment.
            </p>
          </div>
          <div className="hidden rounded-2xl border border-white/20 bg-white/10 p-4 text-3xl backdrop-blur-sm sm:block">
            <FiLayers />
          </div>
        </div>
      </section>

      {mockTests.length > 0 && (
        <section className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_15px_40px_rgba(0,0,0,0.22)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#1687a7]">
                <FiFilter />
                Filter papers
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Narrow the list by year or exam slot.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[430px]">
              <FilterSelect
                label="Year"
                value={yearFilter}
                onChange={setYearFilter}
                options={years.map((year) => ({ value: String(year), label: year }))}
              />
              <FilterSelect
                label="Slot"
                value={slotFilter}
                onChange={setSlotFilter}
                options={slots.map((slot) => ({ value: String(slot), label: `Slot ${slot}` }))}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-5 text-sm dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-500 dark:text-slate-400">
              Showing <span className="font-bold text-slate-900 dark:text-slate-100">{filteredMockTests.length}</span> of <span className="font-bold text-slate-900 dark:text-slate-100">{mockTests.length}</span> papers
            </p>
            {(yearFilter !== "ALL" || slotFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setYearFilter("ALL");
                  setSlotFilter("ALL");
                }}
                className="self-start font-semibold text-[#1687a7] transition hover:text-[#276678] focus:outline-none focus:ring-2 focus:ring-[#1687a7] focus:ring-offset-2 dark:focus:ring-offset-slate-900 sm:self-auto"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>
      )}

      {mockTests.length === 0 && (
        <EmptyState
          title="No question papers available"
          description="Question papers will appear here once they are added."
        />
      )}

      {mockTests.length > 0 && filteredMockTests.length === 0 && (
        <EmptyState
          title="No papers found"
          description="Try changing your year or slot filter."
          action={
            <button
              type="button"
              onClick={() => {
                setYearFilter("ALL");
                setSlotFilter("ALL");
              }}
              className="rounded-xl bg-[#276678] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#276678]/20 transition hover:-translate-y-0.5 hover:bg-[#1687a7] focus:outline-none focus:ring-2 focus:ring-[#1687a7] focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Clear Filters
            </button>
          }
        />
      )}

      {filteredMockTests.length > 0 && (
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#1687a7]">Available papers</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Pick your paper</h2>
            </div>
            <span className="rounded-full bg-[#d3e0ea]/70 px-3 py-1 text-xs font-bold text-[#276678] dark:bg-[#194353] dark:text-[#d3e0ea]">
              {filteredMockTests.length} available
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMockTests.map((mockTest) => (
              <article
                key={mockTest.id}
                className="group flex h-full flex-col rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_8px_0_0_#d3e0ea,0_15px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_0_0_#1687a7,0_22px_38px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_8px_0_0_#194353,0_18px_35px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_8px_0_0_#1687a7,0_24px_42px_rgba(0,0,0,0.3)] sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d3e0ea]/70 text-xl text-[#276678] dark:bg-[#194353] dark:text-[#7ec6d9]">
                    <FiBookOpen />
                  </div>
                  <span className="rounded-full bg-[#d3e0ea]/70 px-3 py-1 text-xs font-bold text-[#276678] dark:bg-[#194353] dark:text-[#d3e0ea]">
                    {mockTest.isOfficial ? "Official Paper" : "Previous-Year Paper"}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {mockTest.title}
                </h3>

                <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-[#d3e0ea] py-4 dark:border-slate-700">
                  <InfoItem icon={<FiCalendar />} label="Year" value={mockTest.year || "—"} />
                  <InfoItem icon={<FiLayers />} label="Slot" value={mockTest.slot || "—"} />
                  <InfoItem icon={<FiBookOpen />} label="Questions" value={mockTest._count?.questions || 0} />
                  <InfoItem icon={<FiClock />} label="Duration" value={`${mockTest.duration} min`} />
                </div>

                <div className="mt-5 flex-1" />

                <button
                  type="button"
                  onClick={() => navigate(`/mock-test/${mockTest.id}`)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#276678] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#276678]/20 transition hover:-translate-y-0.5 hover:bg-[#1687a7] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#1687a7] focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                  Start Paper
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-[#1687a7] focus:ring-2 focus:ring-[#1687a7]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <option value="ALL">{label === "Year" ? "All Years" : "All Slots"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f6f5f5] px-3 py-2.5 dark:bg-[#102a33]">
      <div className="flex min-w-0 items-center gap-2 text-[#1687a7]">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#5f7f8d] dark:text-[#91b2bf]">{label}</span>
      </div>
      <p className="shrink-0 text-sm font-bold text-[#276678] dark:text-[#d3e0ea]">{value}</p>
    </div>
  );
}

function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-[2rem] border border-slate-200/80 bg-white p-10 text-center shadow-[0_12px_35px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_15px_40px_rgba(0,0,0,0.22)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d3e0ea]/70 text-2xl text-[#276678] dark:bg-[#194353] dark:text-[#7ec6d9]">
        <FiBookOpen />
      </div>
      <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default MockTestListPage;

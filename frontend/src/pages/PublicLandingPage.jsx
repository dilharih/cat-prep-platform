import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const benefits = [
  {
    number: "01",
    title: "Practice real CAT questions",
    description:
      "Work through previous-year questions and build exam-ready confidence.",
  },
  {
    number: "02",
    title: "Take focused mock tests",
    description:
      "Attempt full-length tests or practice one CAT section at a time.",
  },
  {
    number: "03",
    title: "Track your progress",
    description:
      "Review attempts, accuracy, and performance so you know what to improve.",
  },
];

function PublicLandingPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="public-landing-page min-h-screen overflow-y-auto bg-[#f6f5f5] text-[#276678]">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-6 sm:px-10 lg:px-12 lg:pb-20 lg:pt-8">
        <nav className="public-landing-nav flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-[#276678]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#276678] text-sm font-black text-white">
              C
            </span>
            CAT <span className="text-[#1687a7]">Prep</span>
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-[#276678] bg-white px-5 py-2.5 text-sm font-bold text-[#276678] transition hover:bg-[#276678] hover:text-white"
          >
            Log in
          </Link>
        </nav>

        <div className="grid items-center gap-10 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:pt-14">
          <div className="public-landing-copy">
            <div className="mb-5 inline-flex items-center rounded-full border border-[#d3e0ea] bg-white px-4 py-2 text-sm font-bold text-[#276678] shadow-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-[#1687a7]" />
              Free CAT preparation
            </div>

            <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.04] tracking-tight text-[#276678] sm:text-6xl lg:text-[4.25rem]">
              Practice better.
              <span className="block text-[#1687a7]">Score higher.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#5f7f8d] sm:text-xl">
              Prepare for CAT with previous-year questions, realistic mock tests,
              and focused practice—all in one simple platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-xl bg-[#1687a7] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1687a7]/15 transition hover:bg-[#276678]"
              >
                Start practicing
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-[#b5cbd5] bg-white px-6 py-3.5 text-sm font-bold text-[#276678] transition hover:border-[#1687a7] hover:text-[#1687a7]"
              >
                Explore mock tests
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-[#d3e0ea] pt-6">
              <div>
                <p className="text-sm font-bold text-[#276678]">CAT PYQs</p>
                <p className="mt-1 text-xs leading-5 text-[#5f7f8d]">Real past questions</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#276678]">Mock tests</p>
                <p className="mt-1 text-xs leading-5 text-[#5f7f8d]">Full & section-wise</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#276678]">Progress</p>
                <p className="mt-1 text-xs leading-5 text-[#5f7f8d]">Know what to improve</p>
              </div>
            </div>
          </div>

          <div className="public-landing-visual overflow-hidden rounded-[2rem] border border-[#d3e0ea] bg-white p-2 shadow-[0_28px_80px_rgba(39,102,120,0.16)] sm:p-3">
            <img
              src="/landing-study.png"
              alt="Focused CAT preparation with books, notes, and past papers"
              className="h-auto max-h-[650px] w-full rounded-[1.5rem] object-contain"
            />
          </div>
        </div>
      </section>

      <section id="features" className="public-landing-features border-y border-[#194353] bg-[#102a33]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12 lg:py-16">
          <div className="mb-9 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#1687a7]">
              Everything you need
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#d3e0ea] sm:text-4xl">
              Built for focused CAT preparation.
            </h2>
          </div>

          <div className="grid overflow-hidden rounded-2xl border border-[#d3e0ea] md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.number}
                className="border-b border-[#d3e0ea] bg-[#f6f5f5] p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <span className="text-sm font-extrabold text-[#1687a7]">
                  {benefit.number}
                </span>
                <h3 className="mt-5 text-xl font-bold text-[#276678]">
                  {benefit.title}
                </h3>
                <p className="mt-3 leading-7 text-[#5f7f8d]">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-landing-cta mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 px-6 py-16 sm:px-10 lg:flex-row lg:items-center lg:px-12 lg:py-20">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#1687a7]">
            Start when you're ready
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight text-[#276678] sm:text-4xl">
            Your next CAT practice session is one click away.
          </h2>
        </div>
        <Link
          to="/login"
          className="shrink-0 rounded-xl bg-[#1687a7] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#276678]"
        >
          Get started
        </Link>
      </section>
    </main>
  );
}

export default PublicLandingPage;

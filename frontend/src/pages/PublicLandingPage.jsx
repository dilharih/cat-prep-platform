import { Link } from "react-router-dom";

const benefits = [
  {
    number: "01",
    title: "Practice real CAT questions",
    description: "Work through previous-year questions and build exam-ready confidence.",
  },
  {
    number: "02",
    title: "Take full mock tests",
    description: "Experience a focused CAT-style test environment before the real exam.",
  },
  {
    number: "03",
    title: "See how you improve",
    description: "Review your attempts, accuracy, and performance over time.",
  },
];

function PublicLandingPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f5] text-[#276678]">
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-8 sm:px-10 lg:px-12 lg:pb-28 lg:pt-10">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-[#276678]">
            CAT <span className="text-[#1687a7]">Prep</span>
          </Link>

          <Link
            to="/login"
            className="rounded-full border border-[#276678] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#276678] hover:text-white"
          >
            Log in
          </Link>
        </nav>

        <div className="grid items-center gap-14 pt-20 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:pt-28">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-[#1687a7]">
              Free CAT preparation
            </p>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-[#276678] sm:text-6xl lg:text-7xl">
              Prepare for CAT with a practice system that stays focused.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5f7f8d] sm:text-xl">
              Practice previous-year questions, take mock tests, and understand your progress — without unnecessary distractions.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-full bg-[#1687a7] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#276678]"
              >
                Start practicing
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-[#b5cbd5] bg-white px-6 py-3.5 text-sm font-bold text-[#276678] transition hover:border-[#1687a7] hover:text-[#1687a7]"
              >
                Explore the platform
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-[2rem] border border-[#d3e0ea] bg-white p-4 shadow-[0_24px_70px_rgba(39,102,120,0.14)] sm:p-6">
              <div className="rounded-2xl bg-[#276678] p-5 text-white sm:p-7">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">CAT Mock Test</span>
                  <span className="rounded-full bg-white/15 px-3 py-1">02:14:36</span>
                </div>
                <div className="mt-8 h-2 rounded-full bg-white/15">
                  <div className="h-2 w-[42%] rounded-full bg-[#d3e0ea]" />
                </div>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-[#d3e0ea]">
                  Quantitative Ability · Question 14
                </p>
                <p className="mt-3 text-lg font-semibold leading-7">
                  Choose the correct option for the question below.
                </p>
                <div className="mt-6 space-y-3">
                  {["A", "B", "C", "D"].map((option, index) => (
                    <div
                      key={option}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                        index === 1
                          ? "border-[#45aeca] bg-[#1687a7] text-white"
                          : "border-white/15 bg-white/10 text-[#d3e0ea]"
                      }`}
                    >
                      <span className="mr-3">{option}</span>
                      {index === 1 ? "Selected answer" : "Answer option"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d3e0ea] bg-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-[#d3e0ea] md:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.number} className="bg-white px-7 py-9 sm:px-10">
              <span className="text-sm font-bold text-[#1687a7]">{benefit.number}</span>
              <h2 className="mt-5 text-xl font-bold text-[#276678]">{benefit.title}</h2>
              <p className="mt-3 leading-7 text-[#5f7f8d]">{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-24">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1687a7]">Ready when you are</p>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-[#276678] sm:text-5xl">
          Start with one question.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5f7f8d]">
          Create your account and make your CAT practice sessions count.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-flex rounded-full bg-[#1687a7] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#276678]"
        >
          Get started
        </Link>
      </section>
    </main>
  );
}

export default PublicLandingPage;

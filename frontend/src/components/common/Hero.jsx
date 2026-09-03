import { Link } from "react-router-dom";
import { FaCheckCircle, FaClock, FaChartLine } from "react-icons/fa";
import Button from "../ui/Button";
import Container from "../ui/Container";

function Hero() {
  return (
    <section className="overflow-hidden py-16 md:py-24">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-cyan-600">
              Free CAT Preparation
            </p>

            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
              Prepare for CAT with a clearer plan.
            </h1>

            <p className="mb-8 max-w-xl text-lg leading-8 text-gray-600 md:text-xl">
              Practice previous-year questions, take full mock tests, and see
              where you can improve — all in one focused platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/practice">
                <Button>Start Practicing</Button>
              </Link>
              <Link to="/mock-tests">
                <Button variant="secondary">Explore Mock Tests</Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-cyan-600" /> Previous-year questions
              </span>
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-cyan-600" /> Section-wise practice
              </span>
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-cyan-600" /> Progress tracking
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl md:p-7">
              <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
                    Mock Test 01
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    CAT Practice Session
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-gray-700">
                  <FaClock /> 60:00
                </div>
              </div>

              <p className="mb-5 text-sm font-semibold text-gray-800">
                Which option best completes the following sequence?
              </p>

              <div className="space-y-3">
                {[
                  ["A", "Option A", false],
                  ["B", "Option B", true],
                  ["C", "Option C", false],
                  ["D", "Option D", false],
                ].map(([letter, option, selected]) => (
                  <div
                    key={letter}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-sm font-medium ${
                      selected
                        ? "border-green-500 bg-green-50 text-green-900"
                        : "border-slate-200 bg-slate-50 text-gray-700"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${
                        selected
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-slate-300 bg-white text-gray-700"
                      }`}
                    >
                      {letter}
                    </span>
                    {option}
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-gray-500">Questions</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">24</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-gray-500">Answered</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">18</p>
                </div>
                <div className="col-span-2 rounded-xl bg-slate-50 p-3 sm:col-span-1">
                  <p className="text-xs text-gray-500">Accuracy</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-bold text-gray-900">
                    <FaChartLine className="text-cyan-600" /> 83%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;

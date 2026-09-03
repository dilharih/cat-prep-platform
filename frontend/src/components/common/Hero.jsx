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
              Take complete CAT question papers under a focused, exam-style test environment and see where you can improve.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/mock-tests">
                <Button>Explore Mock Tests</Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-cyan-600" /> Previous-year CAT papers
              </span>
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-cyan-600" /> Full-length mock tests
              </span>
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-cyan-600" /> Performance tracking
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl md:p-7">
              <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
                    CAT Mock Test
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    Full Question Paper
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-gray-700">
                  <FaClock /> Timed
                </div>
              </div>

              <p className="mb-5 text-sm font-semibold text-gray-800">
                Attempt the complete paper in the same focused flow as the real exam.
              </p>

              <div className="space-y-3">
                {[
                  ["VARC", "Verbal Ability & Reading Comprehension"],
                  ["DILR", "Data Interpretation & Logical Reasoning"],
                  ["QA", "Quantitative Ability"],
                ].map(([section, description]) => (
                  <div
                    key={section}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <span className="flex h-9 w-12 items-center justify-center rounded-lg bg-[#1687a7] text-xs font-bold text-white">
                      {section}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {description}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-gray-500">Questions</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">120+</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-gray-500">Sections</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">3</p>
                </div>
                <div className="col-span-2 rounded-xl bg-slate-50 p-3 sm:col-span-1">
                  <p className="text-xs text-gray-500">Mode</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-bold text-gray-900">
                    <FaChartLine className="text-cyan-600" /> Exam style
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

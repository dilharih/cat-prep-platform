import { FaBookOpen, FaChartLine, FaClipboardList } from "react-icons/fa";
import Container from "../ui/Container";
import FeatureCard from "../ui/FeatureCard";

function Features() {
  const features = [
    {
      icon: <FaBookOpen />,
      title: "Practice Real CAT Questions",
      description:
        "Work through previous-year questions and become familiar with the patterns and difficulty of the exam.",
    },
    {
      icon: <FaClipboardList />,
      title: "Practice Your Way",
      description:
        "Choose a section or take a complete mock test when you want to simulate the real exam.",
    },
    {
      icon: <FaChartLine />,
      title: "Know Your Progress",
      description:
        "Review your attempts, accuracy, and performance so you know what to focus on next.",
    },
  ];

  return (
    <section className="border-y border-slate-200 bg-white py-16 md:py-20">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-cyan-600">
            Everything you need
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            One place to prepare, practice, and improve.
          </h2>
          <p className="mt-4 text-lg leading-7 text-gray-600">
            No clutter. Just the tools that matter for your CAT preparation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-[#276678] px-6 py-10 text-center md:px-10">
          <h3 className="text-2xl font-bold text-white md:text-3xl">
            Start with one question.
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#d3e0ea]">
            Build consistency one practice session at a time and turn your
            preparation into measurable progress.
          </p>
          <a
            href="/practice"
            className="mt-6 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-bold text-[#276678] transition hover:bg-[#f6f5f5]"
          >
            Start Practicing
          </a>
        </div>
      </Container>
    </section>
  );
}

export default Features;

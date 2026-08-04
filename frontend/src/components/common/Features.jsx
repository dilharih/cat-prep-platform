import { FaBookOpen, FaChartLine, FaClipboardList } from "react-icons/fa";
import Container from "../ui/Container";
import FeatureCard from "../ui/FeatureCard";

function Features() {
  const features = [
    {
      icon: <FaBookOpen />,
      title: "Previous Year Papers",
      description:
        "Practice real CAT questions from previous years to understand the exam pattern.",
    },
    {
      icon: <FaClipboardList />,
      title: "Section-wise Practice",
      description:
        "Focus on VARC, DILR, or Quant individually and improve weak areas.",
    },
    {
      icon: <FaChartLine />,
      title: "Performance Analytics",
      description:
        "Track your accuracy, speed, and progress after every practice session.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900">
            Everything You Need to Crack CAT
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Practice smarter with previous year papers, mock tests, and detailed
            performance insights.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Features;
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Container from "../ui/Container";

function Hero() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-2">
          
          {/* Left Side */}
          <div>
            <p className="mb-3 font-semibold text-blue-600">
              CAT Preparation Platform
            </p>

            <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900">
              Crack CAT with
              <span className="text-blue-600"> Confidence</span>
            </h1>

            <p className="mb-8 text-lg text-gray-600">
              Practice CAT Previous Year Questions, attempt full-length mock
              tests, improve your accuracy, and track your progress—all in one
              place.
            </p>

            <div className="flex gap-4">
              <Link to="/practice">
                <Button>Start Practice</Button>
              </Link>

              <Link to="/mock-tests">
                <Button variant="secondary">Attempt Mock Test</Button>
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex h-96 items-center justify-center rounded-2xl bg-gray-100">
            <p className="text-gray-500 text-xl">
              Illustration Coming Soon
            </p>
          </div>

        </div>
      </Container>
    </section>
  );
}

export default Hero;
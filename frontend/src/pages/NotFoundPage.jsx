import { Link } from "react-router-dom";
import GradientWaves from "../components/common/GradientWaves";
import ThemeToggle from "../components/common/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import "../styles/not-found.css";
import "../styles/not-found-scroll-fix.css";

function NotFoundPage() {
  const { darkMode } = useTheme();

  return (
    <main className={`not-found-page ${darkMode ? "nf-dark" : "nf-light"}`}>
      <div className="nf-background" aria-hidden="true">
        <GradientWaves
          horizonColor={darkMode ? "#091a21" : "#F6F5F5"}
          waveColor="#1687A7"
          crestColor={darkMode ? "#D3E0EA" : "#276678"}
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={darkMode ? 0.85 : 1}
          opacity={0.9}
          mouseInteraction
          parallaxStrength={0.5}
          grain
          grainIntensity={0.05}
        />
      </div>

      <div className="nf-vignette" aria-hidden="true" />
      <div className="nf-noise" aria-hidden="true" />

      <header className="nf-header">
        <Link to="/" className="nf-brand" aria-label="CAT Prep home">
          CAT <span>Prep</span>
        </Link>
        <ThemeToggle />
      </header>

      <section className="nf-content">
        <p className="nf-eyebrow">ERROR 404</p>

        <div className="nf-number" aria-label="404">
          <span className="nf-four">4</span>
          <span className="nf-zero">0</span>
          <span className="nf-four">4</span>
        </div>

        <div className="nf-message">
          <h1>Wrong turn.</h1>
          <p>This page doesn’t exist or has moved somewhere else.</p>
          <Link to="/" className="nf-home-button">
            Back to Home
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default NotFoundPage;

import { Link } from "react-router-dom";
import GradientWaves from "../components/common/GradientWaves";
import ThemeToggle from "../components/common/ThemeToggle";
import "../styles/not-found.css";
import "../styles/not-found-scroll-fix.css";

function Portal() {
  return (
    <div className="nf-portal" aria-hidden="true">
      <div className="nf-portal-glow" />
      <div className="nf-portal-sky" />
      <div className="nf-portal-mountains" />
      <div className="nf-portal-water" />
      <div className="nf-portal-steps">
        {Array.from({ length: 7 }, (_, index) => <span key={index} />)}
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="nf-background" aria-hidden="true">
        <GradientWaves
          horizonColor="#091a21"
          waveColor="#1687A7"
          crestColor="#D3E0EA"
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
          brightness={0.85}
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
          <div className="nf-zero-wrap">
            <span className="nf-zero">0</span>
            <Portal />
          </div>
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

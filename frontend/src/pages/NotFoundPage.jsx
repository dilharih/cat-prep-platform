import { Link } from "react-router-dom";
import "../styles/not-found.css";

const shards = [
  { className: "nf-shard nf-shard-a", points: "0,34 18,0 39,12 28,55" },
  { className: "nf-shard nf-shard-b", points: "0,20 16,0 32,22 12,38" },
  { className: "nf-shard nf-shard-c", points: "0,18 30,0 22,32" },
  { className: "nf-shard nf-shard-d", points: "0,28 24,0 39,20 18,42" },
  { className: "nf-shard nf-shard-e", points: "0,24 18,0 36,14 18,39" },
  { className: "nf-shard nf-shard-f", points: "0,12 23,0 30,21 9,28" },
  { className: "nf-shard nf-shard-g", points: "0,20 20,0 33,12 17,31" },
  { className: "nf-shard nf-shard-h", points: "0,17 15,0 30,16 13,28" },
];

function Portal() {
  return (
    <div className="nf-portal" aria-hidden="true">
      <div className="nf-portal-sky" />
      <div className="nf-portal-mountains" />
      <div className="nf-portal-water" />
      <div className="nf-portal-steps">
        {Array.from({ length: 7 }, (_, index) => <span key={index} />)}
      </div>
    </div>
  );
}

function Four() {
  return <span className="nf-four">4</span>;
}

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="nf-noise" aria-hidden="true" />
      <div className="nf-stars" aria-hidden="true" />
      <div className="nf-orbit nf-orbit-one" aria-hidden="true" />
      <div className="nf-orbit nf-orbit-two" aria-hidden="true" />

      {shards.map((shard) => (
        <svg key={shard.className} className={shard.className} viewBox="0 0 40 55" aria-hidden="true">
          <polygon points={shard.points} />
        </svg>
      ))}

      <header className="nf-header">
        <Link to="/" className="nf-brand" aria-label="CAT Prep home">
          CAT <span>Prep</span>
        </Link>
        <div className="nf-tagline">
          <span>Same Destination.</span>
          <span>A Smarter You.</span>
          <i />
        </div>
      </header>

      <section className="nf-content">
        <p className="nf-eyebrow">PAGE NOT FOUND</p>

        <div className="nf-number" aria-label="404">
          <Four />
          <div className="nf-zero-wrap">
            <span className="nf-zero">0</span>
            <Portal />
          </div>
          <Four />
        </div>

        <div className="nf-side-label nf-side-left">
          <span>DIFFERENT</span>
          <span>PATHS</span>
          <i />
        </div>
        <div className="nf-side-label nf-side-right">
          <span>SAME</span>
          <span>GOAL</span>
          <i />
        </div>

        <div className="nf-message">
          <h1>Looks like you’ve taken a wrong turn.</h1>
          <p>The page you’re looking for doesn’t exist or has been moved.</p>
          <Link to="/" className="nf-home-button">
            <span className="nf-home-icon">⌂</span>
            Back to Home
          </Link>
        </div>
      </section>

      <div className="nf-floor" aria-hidden="true">
        <div className="nf-path nf-path-one" />
        <div className="nf-path nf-path-two" />
        <div className="nf-floor-glow" />
      </div>
    </main>
  );
}

export default NotFoundPage;

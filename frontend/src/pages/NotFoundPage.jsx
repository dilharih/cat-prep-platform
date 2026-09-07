import { Link } from "react-router-dom";
import AeroShards from "../components/common/AeroShards";
import "../styles/aero-shards.css";

function NotFoundPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#091a21] text-[#d3e0ea]">
      <AeroShards />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div aria-hidden="true" className="relative select-none leading-none">
          <span className="block text-[clamp(9rem,28vw,22rem)] font-black tracking-[-0.08em] text-[#1687A7] opacity-20">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[clamp(7rem,22vw,17rem)] font-black tracking-[-0.08em] text-[#d3e0ea]">
            404
          </span>
        </div>

        <p className="mt-2 max-w-md text-sm text-[#d3e0ea]/70 sm:text-base">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-6 rounded-full bg-[#276678] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1687A7] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2 focus:ring-offset-[#091a21]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;

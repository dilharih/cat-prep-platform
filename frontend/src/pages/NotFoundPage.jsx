import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F6F5F5] text-[#276678] dark:bg-[#091a21] dark:text-[#d3e0ea]">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div aria-hidden="true" className="relative select-none leading-none">
          <span className="block text-[clamp(9rem,28vw,22rem)] font-black tracking-[-0.08em] text-[#1687A7] opacity-15 dark:text-[#d3e0ea]">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[clamp(7rem,22vw,17rem)] font-black tracking-[-0.08em] text-[#276678] dark:text-[#1687A7]">
            404
          </span>
        </div>

        <Link
          to="/"
          className="mt-2 rounded-full bg-[#276678] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1687A7] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2 focus:ring-offset-[#F6F5F5] dark:focus:ring-offset-[#091a21]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;

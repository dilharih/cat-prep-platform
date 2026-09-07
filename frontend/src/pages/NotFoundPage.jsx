import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#F6F5F5] px-6 text-[#276678] dark:bg-[#091a21] dark:text-[#d3e0ea]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center text-center">
        <p className="text-[clamp(7rem,22vw,16rem)] font-black leading-none tracking-[-0.08em] text-[#1687A7] dark:text-[#1687A7]">
          404
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex items-center rounded-full bg-[#276678] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1687A7] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2 focus:ring-offset-[#F6F5F5] dark:focus:ring-offset-[#091a21]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;

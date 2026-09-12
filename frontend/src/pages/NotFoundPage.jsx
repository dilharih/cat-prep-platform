import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F5F5] px-6 text-center dark:bg-[#091a21]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1687A7]">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#276678] dark:text-[#D3E0EA]">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          This is a temporary 404 page. We will design it later.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-lg bg-[#1687A7] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#276678]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;

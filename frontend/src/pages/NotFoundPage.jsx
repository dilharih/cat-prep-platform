import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/common/ThemeToggle";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-[#F6F5F5] text-[#276678] dark:bg-[#091a21] dark:text-[#D3E0EA]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-16">
        
        {/* Header */}
        <header className="flex items-center justify-between">
  <Link
    to="/"
    className="text-xl font-bold tracking-tight text-[#276678] dark:text-[#D3E0EA]"
  >
    CAT <span className="text-[#1687A7]">Prep</span>
  </Link>

  <nav className="flex items-center gap-3" aria-label="Main navigation">
    <Link
      to="/"
      className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[#276678]/80 transition hover:bg-[#D3E0EA]/50 hover:text-[#276678] focus:outline-none focus:ring-2 focus:ring-[#1687A7] dark:text-[#D3E0EA]/80 dark:hover:bg-[#102a33] dark:hover:text-[#D3E0EA] sm:block"
    >
      Home
    </Link>

    <ThemeToggle />
  </nav>
</header>

        {/* Main content */}
        <section className="flex flex-1 flex-col items-center justify-center text-center">
          
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#1687A7]">
            Page not found
          </p>

          <h1
  aria-label="404"
  className="select-none text-[clamp(9rem,28vw,22rem)] font-black leading-[0.7] tracking-[-0.1em] text-[#276678] dark:text-[#1687A7]"
>
  404
</h1>

          <div className="mt-10 max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-[#276678] dark:text-[#D3E0EA] sm:text-3xl">
              Looks like you took a wrong turn.
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#276678]/70 dark:text-[#D3E0EA]/70 sm:text-base">
              The page you're looking for doesn't exist or may have been moved.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
  <Link
    to="/"
    className="inline-flex items-center gap-2 rounded-full bg-[#276678] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1687A7] focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2 dark:bg-[#1687A7] dark:hover:bg-[#276678] dark:focus:ring-offset-[#091a21]"
  >
    Back to Home
    <span aria-hidden="true">→</span>
  </Link>

  <button
    type="button"
    onClick={() => navigate(-1)}
    className="inline-flex items-center gap-2 rounded-full border border-[#276678]/20 px-6 py-3 text-sm font-semibold text-[#276678] transition hover:bg-[#D3E0EA]/40 focus:outline-none focus:ring-2 focus:ring-[#1687A7] focus:ring-offset-2 dark:border-[#D3E0EA]/20 dark:text-[#D3E0EA] dark:hover:bg-[#102a33] dark:focus:ring-offset-[#091a21]"
  >
    ← Go Back
  </button>
</div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-[#276678]/50 dark:text-[#D3E0EA]/40">
          CAT Prep · Keep learning. Keep improving.
        </footer>
      </div>
    </main>
  );
}

export default NotFoundPage;
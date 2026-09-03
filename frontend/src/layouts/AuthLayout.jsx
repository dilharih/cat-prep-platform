import { Link } from "react-router-dom";
import ThemeToggle from "../components/common/ThemeToggle";
import "../styles/login-page.css";

function AuthLayout({ children }) {
  return (
    <div className="auth-page min-h-screen">
      <header className="auth-page__header border-b">
        <div className="auth-page__header-inner mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-extrabold tracking-tight sm:text-xl"
            aria-label="CAT Prep home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#276678] text-sm font-black text-white shadow-sm">
              C
            </span>
            <span>
              CAT <span className="text-[#1687a7]">Prep</span>
            </span>
          </Link>

          <ThemeToggle />
        </div>
      </header>

      <main className="auth-page__main flex items-center justify-center px-6 py-10 sm:px-8 sm:py-12">
        <div className="auth-page__shell w-full max-w-md">
          <section className="auth-page__card rounded-2xl p-7 sm:p-9">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;

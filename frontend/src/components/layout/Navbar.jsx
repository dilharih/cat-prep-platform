import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import ThemeToggle from "../common/ThemeToggle";

const linkClass = ({ isActive }) =>
  [
    "rounded-lg px-3 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-[#d3e0ea] text-[#276678] dark:bg-[#194353] dark:text-[#d3e0ea]"
      : "text-slate-600 hover:bg-slate-100 hover:text-[#276678] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
  ].join(" ");

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-950 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <NavLink
          to="/dashboard"
          className="text-xl font-extrabold tracking-tight text-[#276678] dark:text-white"
          aria-label="CAT Prep dashboard"
        >
          CAT <span className="text-[#1687a7]">Prep</span>
        </NavLink>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <nav
        className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4 dark:border-slate-800"
        aria-label="Main navigation"
      >
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/mock-tests" className={linkClass}>
          Question Papers
        </NavLink>
        <NavLink to="/history" className={linkClass}>
          Attempt History
        </NavLink>

        {user?.role === "ADMIN" && (
          <NavLink to="/admin/mock-tests" className={linkClass}>
            Manage Mock Tests
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default Navbar;

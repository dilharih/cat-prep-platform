import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import ThemeToggle from "../common/ThemeToggle";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-950">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.name}!
        </h1>

        <p className="text-gray-500 dark:text-slate-400">
          Let's solve some CAT questions today.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-5 py-2 text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useTheme } from "../../context/ThemeContext";

const links = [
  { name: "Home", path: "/", publicOnly: true },
  { name: "Dashboard", path: "/dashboard", protected: true },
  { name: "Practice", path: "/practice", protected: true },
  { name: "Mock Tests", path: "/mock-tests", protected: true },
  { name: "History", path: "/history", protected: true },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const isLoginPage = location.pathname === "/login";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const visibleLinks = links.filter((link) => {
    if (link.publicOnly) return !user;
    return !link.protected || user;
  });

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to={user ? "/dashboard" : "/"} className="shrink-0 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          CAT <span className="text-blue-600 dark:text-blue-400">Prep</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {visibleLinks.map((link) => {
            const active =
              link.path === "/"
                ? location.pathname === "/"
                : location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="theme-switch"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <label className="switch" aria-label="Toggle dark mode">
              <input
                id="dark-mode"
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <div className="slider round">
                <div className="sun-moon">
                  {["moon-dot-1", "moon-dot-2", "moon-dot-3", "light-ray-1", "light-ray-2", "light-ray-3"].map((id) => (
                    <svg key={id} id={id} className={id.startsWith("moon") ? "moon-dot" : "light-ray"} viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" /></svg>
                  ))}
                  {[1, 2, 3].map((id) => (
                    <svg key={`dark-cloud-${id}`} id={`cloud-${id}`} className="cloud-dark" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" /></svg>
                  ))}
                  {[4, 5, 6].map((id) => (
                    <svg key={`light-cloud-${id}`} id={`cloud-${id}`} className="cloud-light" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" /></svg>
                  ))}
                </div>
                <div className="stars">
                  {[1, 2, 3, 4].map((star) => (
                    <svg key={star} id={`star-${star}`} className="star" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
                    </svg>
                  ))}
                </div>
              </div>
            </label>
          </div>

          {user && (
            <span className="hidden text-sm font-medium text-slate-600 lg:block dark:text-slate-300">
              Hi, {user.name}
            </span>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
            >
              Logout
            </button>
          ) : (
            !isLoginPage && (
              <Link
                to="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Login
              </Link>
            )
          )}
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-5 py-2 md:hidden dark:border-slate-800">
        {visibleLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${
              location.pathname === link.path
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;

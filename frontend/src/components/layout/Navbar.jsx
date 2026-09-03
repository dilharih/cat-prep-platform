import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useTheme } from "../../context/ThemeContext";
import GooeyNav from "./GooeyNav";

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

  const items = user
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Practice", href: "/practice" },
        { label: "Mock Tests", href: "/mock-tests" },
        { label: "History", href: "/history" },
      ]
    : [{ label: "Home", href: "/" }];

  const activeIndex = Math.max(
    items.findIndex((item) =>
      item.href === "/"
        ? location.pathname === "/"
        : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
    ),
    0
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link to={user ? "/dashboard" : "/"} className="shrink-0 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          CAT <span className="text-blue-600 dark:text-blue-400">Prep</span>
        </Link>

        <nav className="hidden md:block">
          <GooeyNav items={items} initialActiveIndex={activeIndex} animationTime={600} timeVariance={300} colors={[1, 2, 3, 1, 2, 3, 1, 4]} />
        </nav>

        <div className="flex items-center gap-3">
          <div className="theme-switch" title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <label className="switch" aria-label="Toggle dark mode">
              <input id="dark-mode" type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
              <div className="slider round">
                <div className="sun-moon">
                  {["moon-dot-1", "moon-dot-2", "moon-dot-3", "light-ray-1", "light-ray-2", "light-ray-3"].map((id) => (
                    <svg key={id} id={id} className={id.startsWith("moon") ? "moon-dot" : "light-ray"} viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" /></svg>
                  ))}
                  {[1, 2, 3].map((id) => <svg key={`dark-cloud-${id}`} id={`cloud-${id}`} className="cloud-dark" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" /></svg>)}
                  {[4, 5, 6].map((id) => <svg key={`light-cloud-${id}`} id={`cloud-${id}`} className="cloud-light" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="50" /></svg>)}
                </div>
                <div className="stars">
                  {[1, 2, 3, 4].map((star) => (
                    <svg key={star} id={`star-${star}`} className="star" viewBox="0 0 20 20" aria-hidden="true"><path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" /></svg>
                  ))}
                </div>
              </div>
            </label>
          </div>

          {user && <span className="hidden text-sm font-medium text-slate-600 lg:block dark:text-slate-300">Hi, {user.name}</span>}

          {user ? (
            <button onClick={handleLogout} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400">Logout</button>
          ) : (
            !isLoginPage && <Link to="/login" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">Login</Link>
          )}
        </div>
      </div>

      <style>{`
        .gooey-nav { isolation: isolate; }
        .gooey-particle { transform: translate(-50%, -50%); animation: gooey-pop ease-out forwards; }
        .gooey-color-1 { background: #1687a7; }
        .gooey-color-2 { background: #276678; }
        .gooey-color-3 { background: #d3e0ea; }
        .gooey-color-4 { background: #45aeca; }
        @keyframes gooey-pop {
          0% { opacity: .9; transform: translate(-50%, -50%) scale(.3); }
          45% { opacity: .8; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(var(--scale)); }
          100% { opacity: 0; transform: translate(calc(-50% + var(--dx) * 1.8), calc(-50% + var(--dy) * 1.8)) scale(.05); }
        }
      `}</style>
    </header>
  );
}

export default Navbar;

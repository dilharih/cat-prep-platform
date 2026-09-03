import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const links = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard", protected: true },
  { name: "Practice", path: "/practice", protected: true },
  { name: "Mock Tests", path: "/mock-tests", protected: true },
  { name: "History", path: "/history", protected: true },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isLoginPage = location.pathname === "/login";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const visibleLinks = links.filter((link) => !link.protected || user);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link to="/" className="shrink-0 text-xl font-extrabold tracking-tight text-slate-950">
          CAT <span className="text-blue-600">Prep</span>
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
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden text-sm font-medium text-slate-600 lg:block">
              Hi, {user.name}
            </span>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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

      <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-5 py-2 md:hidden">
        {visibleLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${
              location.pathname === link.path
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600"
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

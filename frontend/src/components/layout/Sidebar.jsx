import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Practice", path: "/practice" },
  { name: "Mock Test", path: "/test" },
  { name: "Results", path: "/result" },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">
        CAT Prep
      </h1>

      <nav className="space-y-3">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block rounded-lg px-4 py-3 transition ${
              location.pathname === item.path
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
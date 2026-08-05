import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name}! 
        </h1>

        <p className="text-gray-500">
          Let's solve some CAT questions today.
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-lg bg-red-500 px-5 py-2 text-white transition hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
}

export default Navbar;
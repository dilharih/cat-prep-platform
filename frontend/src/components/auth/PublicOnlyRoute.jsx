import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f6f5f5] text-[#276678] dark:bg-[#091a21] dark:text-[#d3e0ea]">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicOnlyRoute;

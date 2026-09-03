import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function SiteLayout() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <main className="min-h-[calc(100vh-72px)]">
        <Outlet />
      </main>
    </div>
  );
}

export default SiteLayout;

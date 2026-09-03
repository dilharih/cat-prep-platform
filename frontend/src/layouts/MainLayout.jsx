import Sidebar from "../components/layout/Sidebar";

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}

export default MainLayout;

import Navbar from "../components/layout/Navbar";

function SiteLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="min-h-[calc(100vh-72px)]">{children}</main>
    </div>
  );
}

export default SiteLayout;

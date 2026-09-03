import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import PublicLandingPage from "../pages/PublicLandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import MockTestListPage from "../features/test/pages/MockTestListPage";
import MockTestPage from "../features/test/pages/MockTestPage";
import MockTestResultPage from "../features/test/pages/MockTestResultPage";
import MockTestReviewPage from "../features/test/pages/MockTestReviewPage";
import AttemptHistoryPage from "../features/practice/pages/AttemptHistoryPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicOnlyRoute from "../components/auth/PublicOnlyRoute";
import ThemeToggle from "../components/common/ThemeToggle";
import SiteLayout from "../layouts/SiteLayout";

function AppRouterContent() {
  const location = useLocation();
  const isMockTestPage = /^\/mock-test\/[^/]+$/.test(location.pathname);

  return (
    <>
      {isMockTestPage && (
        <div className="fixed right-[174px] top-[84px] z-[100] rounded-xl border border-white/10 bg-slate-900/80 p-1 shadow-lg backdrop-blur-sm">
          <ThemeToggle />
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <PublicLandingPage />
            </PublicOnlyRoute>
          }
        />

        <Route element={<SiteLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><AttemptHistoryPage /></ProtectedRoute>} />
          <Route path="/mock-tests" element={<ProtectedRoute><MockTestListPage /></ProtectedRoute>} />
          <Route path="/mock-test-result/:attemptId" element={<ProtectedRoute><MockTestResultPage /></ProtectedRoute>} />
          <Route path="/mock-test-review/:attemptId" element={<ProtectedRoute><MockTestReviewPage /></ProtectedRoute>} />
        </Route>

        <Route
          path="/mock-test/:mockTestId"
          element={<ProtectedRoute><MockTestPage /></ProtectedRoute>}
        />
      </Routes>
    </>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <AppRouterContent />
    </BrowserRouter>
  );
}

export default AppRouter;

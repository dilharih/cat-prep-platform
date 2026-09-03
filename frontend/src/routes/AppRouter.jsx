import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import SiteLayout from "../layouts/SiteLayout";

function AppRouter() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default AppRouter;

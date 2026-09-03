import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import LoginPage from "../features/auth/pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import PracticePage from "../features/practice/pages/PracticePage";
import MockTestListPage from "../features/test/pages/MockTestListPage";
import MockTestPage from "../features/test/pages/MockTestPage";
import MockTestResultPage from "../features/test/pages/MockTestResultPage";
import MockTestReviewPage from "../features/test/pages/MockTestReviewPage";
import AttemptHistoryPage from "../features/practice/pages/AttemptHistoryPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import SiteLayout from "../layouts/SiteLayout";

function AppRouter() {
  return (
    <BrowserRouter>
      <SiteLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <PracticePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <AttemptHistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mock-tests"
            element={
              <ProtectedRoute>
                <MockTestListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mock-test/:mockTestId"
            element={
              <ProtectedRoute>
                <MockTestPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mock-test-result/:attemptId"
            element={
              <ProtectedRoute>
                <MockTestResultPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mock-test-review/:attemptId"
            element={
              <ProtectedRoute>
                <MockTestReviewPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  );
}

export default AppRouter;

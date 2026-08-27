import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import LoginPage from "../features/auth/pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import PracticePage from "../features/practice/pages/PracticePage";
import Test from "../pages/Test";
import Result from "../pages/Result";

import MockTestPage from "../features/test/pages/MockTestPage";
import MockTestResultPage from "../features/test/pages/MockTestResultPage";
import AttemptHistoryPage from "../features/practice/pages/AttemptHistoryPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/test" element={<Test />} />

        <Route path="/result" element={<Result />} />

        {/* Protected routes */}
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
          path="/mock-test"
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
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
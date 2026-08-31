import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import LoginPage from "../features/auth/pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import PracticePage from "../features/practice/pages/PracticePage";
import Test from "../pages/Test";
import Result from "../pages/Result";

import MockTestListPage from "../features/test/pages/MockTestListPage";
import MockTestPage from "../features/test/pages/MockTestPage";
import MockTestResultPage from "../features/test/pages/MockTestResultPage";
import MockTestReviewPage from "../features/test/pages/MockTestReviewPage";

import AttemptHistoryPage from "../features/practice/pages/AttemptHistoryPage";

import ProtectedRoute from "../components/auth/ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/test"
          element={<Test />}
        />

        <Route
          path="/result"
          element={<Result />}
        />


        {/* =================================================
            PROTECTED ROUTES
        ================================================= */}

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* Practice */}

        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <PracticePage />
            </ProtectedRoute>
          }
        />


        {/* Attempt History */}

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <AttemptHistoryPage />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            MOCK TEST ROUTES
        ================================================= */}

        {/* Mock Test List */}

        <Route
          path="/mock-tests"
          element={
            <ProtectedRoute>
              <MockTestListPage />
            </ProtectedRoute>
          }
        />


        {/* Individual Mock Test */}

        <Route
          path="/mock-test/:mockTestId"
          element={
            <ProtectedRoute>
              <MockTestPage />
            </ProtectedRoute>
          }
        />


        {/* Mock Test Result */}

        <Route
          path="/mock-test-result/:attemptId"
          element={
            <ProtectedRoute>
              <MockTestResultPage />
            </ProtectedRoute>
          }
        />


        {/* Mock Test Attempt Review */}

        <Route
          path="/mock-test-review/:attemptId"
          element={
            <ProtectedRoute>
              <MockTestReviewPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
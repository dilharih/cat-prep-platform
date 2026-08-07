import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import LoginPage from "../features/auth/pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import PracticePage from "../features/practice/pages/PracticePage";
import Test from "../pages/Test";
import Result from "../pages/Result";
import ProtectedRoute from "../components/auth/ProtectedRoute";
function AppRouter() {
  return (
    <BrowserRouter>
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

        <Route path="/test" element={<Test />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
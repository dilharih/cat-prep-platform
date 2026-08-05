import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../features/auth/pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import Practice from "../pages/Practice";
import Test from "../pages/Test";
import Result from "../pages/Result";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
  element={
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/practice" element={<Practice />} />
  <Route path="/test" element={<Test />} />
  <Route path="/result" element={<Result />} />
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
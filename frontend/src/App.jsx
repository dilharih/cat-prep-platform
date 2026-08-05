import AppRouter from "./routes/AppRouter";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return <AppRouter />;
}

export default App;
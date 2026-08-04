import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Container from "../ui/Container";

function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <Container className="flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          CAT Prep
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/practice"
            className="text-gray-700 transition hover:text-blue-600"
          >
            Practice
          </Link>

          <Link to="/login">
  <Button>Login</Button>
</Link>
        </div>
      </Container>
    </header>
  );
}

export default Navbar;
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login as loginService } from "../services/auth.service";import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { loginSchema } from "../schemas/loginSchema";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data) {
  try {
const response = await loginService(data);
    // Store JWT
    login(response.user, response.token);

navigate("/dashboard");

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message || "Login failed"
    );
  }
}

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">
        Welcome Back
      </h1>

      <p className="mb-8 text-gray-600">
        Sign in to continue your CAT preparation.
      </p>

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="mt-6">
        <Button
          type="submit"
          className="w-full"
        >
          Login
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
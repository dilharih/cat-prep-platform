import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login as loginService } from "../services/auth.service";
import { useAuth } from "../../../context/useAuth";

import Input from "../../../components/ui/Input";
import { loginSchema } from "../schemas/loginSchema";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data) {
    try {
      const response = await loginService(data);
      login(response.user, response.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-8">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[#1687a7]">
          Welcome back
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#276678] sm:text-4xl">
          Sign in to CAT Prep
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#5f7f8d] sm:text-base">
          Continue your preparation and pick up where you left off.
        </p>
      </div>

      <div className="space-y-1">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          className="auth-page__input"
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          className="auth-page__input"
          {...register("password")}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="auth-page__submit mt-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Login"}
      </button>

      <div className="mt-7 flex items-center justify-between gap-4 text-sm">
        <Link to="/" className="auth-page__back font-semibold transition">
          ← Back to home
        </Link>
        <span className="text-[#7c9aa6]">Secure sign in</span>
      </div>
    </form>
  );
}

export default LoginForm;

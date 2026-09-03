import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login as loginService } from "../services/auth.service";
import { useAuth } from "../../../context/useAuth";
import ThemeToggle from "../../../components/common/ThemeToggle";

import Input from "../../../components/ui/Input";
import { loginSchema } from "../schemas/loginSchema";
import "../../../styles/login-page.css";

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
    <form className="auth-login-form relative" onSubmit={handleSubmit(onSubmit)}>
      <div className="fixed right-5 top-5 z-50 sm:right-8 sm:top-7">
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <div className="mb-7 flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#276678] text-sm font-black text-white shadow-sm">
            C
          </span>
          <span className="text-xl font-extrabold tracking-tight text-[#276678]">
            CAT <span className="text-[#1687a7]">Prep</span>
          </span>
        </div>

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
        <span className="auth-login-secure text-[#7c9aa6]">Secure sign in</span>
      </div>
    </form>
  );
}

export default LoginForm;

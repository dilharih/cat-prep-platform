import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { login as loginService, googleLogin } from "../services/auth.service";
import { useAuth } from "../../../context/useAuth";

import Input from "../../../components/ui/Input";
import { loginSchema } from "../schemas/loginSchema";
import "../../../styles/login-page.css";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const googleButtonRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      return undefined;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            setGoogleError("");
            const result = await googleLogin(response.credential);
            login(result.user);
            navigate("/dashboard");
          } catch (error) {
            setGoogleError(
              error.response?.data?.message || "Google sign-in failed. Please try again."
            );
          }
        },
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 360,
        text: "continue_with",
        shape: "rectangular",
      });
      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return undefined;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [login, navigate]);

  async function onSubmit(data) {
    try {
      const response = await loginService(data);
      login(response.user);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <form className="auth-login-form" onSubmit={handleSubmit(onSubmit)}>
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

      <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7c9aa6] dark:text-[#7899a5]">
        <span className="h-px flex-1 bg-[#d3e0ea] dark:bg-[#285363]" />
        <span>or</span>
        <span className="h-px flex-1 bg-[#d3e0ea] dark:bg-[#285363]" />
      </div>

      {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
        <div className="flex justify-center overflow-hidden rounded-xl">
          <div ref={googleButtonRef} className="min-h-10" />
        </div>
      ) : (
        <button
          type="button"
          disabled
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#d3e0ea] bg-white px-4 py-3 text-sm font-semibold text-[#276678] opacity-70 dark:border-[#285363] dark:bg-[#091a21] dark:text-[#d3e0ea]"
          title="Google sign-in requires VITE_GOOGLE_CLIENT_ID"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>
      )}

      {googleError && (
        <p className="mt-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
          {googleError}
        </p>
      )}

      {!googleReady && import.meta.env.VITE_GOOGLE_CLIENT_ID && (
        <p className="mt-2 text-center text-xs text-[#7c9aa6] dark:text-[#7899a5]">
          Loading Google sign-in…
        </p>
      )}

      <div className="mt-6 text-center text-sm text-[#5f7f8d] dark:text-[#9bb5bf]">
        New to CAT Prep?{" "}
        <Link
          to="/signup"
          className="font-semibold text-[#1687a7] hover:text-[#276678] dark:hover:text-[#45aeca]"
        >
          Create an account
        </Link>
      </div>

      <div className="mt-5 text-sm">
        <Link to="/" className="auth-page__back font-semibold transition">
          ← Back to home
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;

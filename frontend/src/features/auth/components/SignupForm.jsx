import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";

import Input from "../../../components/ui/Input";
import { useAuth } from "../../../context/useAuth";
import { googleLogin, register as registerUser } from "../services/auth.service";
import { signupSchema } from "../schemas/signupSchema";

function SignupForm() {
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
    resolver: zodResolver(signupSchema),
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
      setGoogleError("");
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      login(result.user);
      navigate("/dashboard");
    } catch (error) {
      setGoogleError("");
      alert(error.response?.data?.message || "Registration failed");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-7">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#276678] text-sm font-black text-white shadow-sm">
            C
          </span>
          <span className="text-xl font-extrabold tracking-tight text-[#276678] dark:text-[#d3e0ea]">
            CAT <span className="text-[#1687a7]">Prep</span>
          </span>
        </div>

        <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[#1687a7]">
          Get started
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#276678] dark:text-[#d3e0ea] sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#5f7f8d] dark:text-[#9bb5bf] sm:text-base">
          Start your CAT preparation and keep your progress in one place.
        </p>
      </div>

      <div className="space-y-1">
        <Input
          label="Name"
          type="text"
          placeholder="Your name"
          error={errors.name?.message}
          className="auth-page__input"
          {...register("name")}
        />

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
          placeholder="At least 15 characters"
          error={errors.password?.message}
          className="auth-page__input"
          {...register("password")}
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          className="auth-page__input"
          {...register("confirmPassword")}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="auth-page__submit mt-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
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

      <div className="mt-7 flex items-center justify-between gap-4 text-sm">
        <Link to="/" className="auth-page__back font-semibold transition">
          ← Back to home
        </Link>
        <span className="text-[#5f7f8d] dark:text-[#9bb5bf]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#1687a7] hover:text-[#276678] dark:hover:text-[#45aeca]">
            Log in
          </Link>
        </span>
      </div>
    </form>
  );
}

export default SignupForm;

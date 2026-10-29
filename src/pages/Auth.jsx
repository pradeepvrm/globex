import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const apiBaseUrl = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

function AuthPage({ mode }) {
  const isSignUp = mode === "sign-up";
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentFormData) => ({ ...currentFormData, [name]: value }));
    setFeedback(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/users/${isSignUp ? "register" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isSignUp
              ? formData
              : { username: formData.username, password: formData.password },
          ),
        },
      );
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("The server returned an unexpected response. Check that the backend API is running.");
      }
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.msg || "The request could not be completed.");
      }

      setFeedback({
        type: "success",
        message: isSignUp
          ? `Account created for ${result.data.username}. You can now sign in.`
          : `Login successful. Welcome, ${result.data.username}!`,
      });

      if (isSignUp) {
        setFormData({ username: "", email: "", password: "" });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to connect to the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-[#f9faff] px-4 py-10 text-[#272727] sm:px-6 sm:py-14">
        <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-[0_12px_40px_rgba(0,7,27,0.06)] md:min-h-135 md:grid-cols-[0.85fr_1.15fr]">

          <section className="flex items-center px-6 py-9 sm:px-10 sm:py-12">
            <div className="mx-auto w-full max-w-md">
              <header>
                <h2 className="text-2xl font-bold text-[#00071b]">
                  {isSignUp ? "Create an account" : "Sign in"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#646464]">
                  {isSignUp
                    ? "Enter your details to register."
                    : "Enter your account details below."}
                </p>
              </header>

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div>
                  <label htmlFor="auth-username" className="mb-2 block text-sm font-semibold">
                    Username
                  </label>
                  <input
                    id="auth-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[#dedede] px-3.5 py-3 text-sm outline-none transition focus:border-[#00071b] focus:ring-2 focus:ring-[#00071b]/10"
                  />
                </div>

                {isSignUp && (
                  <div>
                    <label htmlFor="auth-email" className="mb-2 block text-sm font-semibold">
                      Email address
                    </label>
                    <input
                      id="auth-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[#dedede] px-3.5 py-3 text-sm outline-none transition focus:border-[#00071b] focus:ring-2 focus:ring-[#00071b]/10"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="auth-password" className="mb-2 block text-sm font-semibold">
                    Password
                  </label>
                  <input
                    id="auth-password"
                    name="password"
                    type="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[#dedede] px-3.5 py-3 text-sm outline-none transition focus:border-[#00071b] focus:ring-2 focus:ring-[#00071b]/10"
                  />
                </div>

                {feedback && (
                  <p
                    role={feedback.type === "error" ? "alert" : "status"}
                    className={`rounded-lg px-3.5 py-3 text-sm ${
                      feedback.type === "error"
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {feedback.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#00071b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#17213a] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#00071b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Please wait..."
                    : isSignUp
                      ? "Create account"
                      : "Sign in"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#646464]">
                {isSignUp ? "Already registered?" : "New to Globex?"}{" "}
                <Link
                  to={isSignUp ? "/sign-in" : "/sign-up"}
                  className="font-semibold text-[#00071b] underline underline-offset-4 hover:text-[#45516d]"
                >
                  {isSignUp ? "Sign in" : "Create an account"}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export function SignInPage() {
  return <AuthPage mode="sign-in" />;
}

export function SignUpPage() {
  return <AuthPage mode="sign-up" />;
}

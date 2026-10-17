import { SignIn, SignUp } from "@clerk/react";
import Navbar from "../components/Navbar";

function AuthPage({ mode }) {
  const isSignUp = mode === "sign-up";

  return (
    <>
    <Navbar />
    <main className="flex min-h-screen items-center justify-center bg-[#f9faff] px-4 py-10 sm:py-14">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">

        <section className="flex items-center justify-center px-5 py-10 sm:px-10">
          {isSignUp ? (
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              fallbackRedirectUrl="/"
            />
          ) : (
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/"
            />
          )}
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

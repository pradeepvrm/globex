import { Link, Navigate, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";
import Orders from "./Orders";

export default function Profile() {
  const { isSignedIn, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isSignedIn ) return <Navigate to="/sign-in" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f5f6f8] pb-12">
        <section className="bg-[#00071b] text-white">
          <div className="mx-auto flex w-full max-w-300 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl font-bold uppercase sm:h-20 sm:w-20 sm:text-3xl" aria-hidden="true">
                {user?.username?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Your account</p>
                <h1 className="mt-1 text-2xl font-bold sm:text-2xl">Welcome, {user?.username || "there"}</h1>
                <p className="mt-1 text-sm text-white/65">Manage your orders and shopping shortcuts.</p>
              </div>
            </div>
            <button type="button" onClick={handleLogout} className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 lg:self-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg>
              Log out
            </button>
          </div>
        </section>

        <div className="mx-auto w-full max-w-300 px-4 sm:px-6 lg:px-8">
          <section className="pt-7 sm:pt-8 lg:pt-9">
            <div className="mb-4 sm:mb-5">
              <h2 className="text-xl font-bold text-[#00071b]">Quick links</h2>
              <p className="mt-1 text-sm text-[#777f8d]">Pick up where you left off.</p>
            </div>
            <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
              <Link to="/cart" className="group flex min-h-30 items-center gap-4 rounded-xl border border-[#e6e8ec] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#cbd0da] hover:shadow-md sm:p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f2f6] text-[#00071b]">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 9H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-[#00071b]">Your cart</span>
                  <span className="block text-sm leading-5 text-[#777f8d]">Review items you’re ready to buy.</span>
                </span>
                <span className="text-xl text-[#9aa1ad] transition group-hover:translate-x-1 group-hover:text-[#00071b]" aria-hidden="true">→</span>
              </Link>
              <Link to="/wishlist" className="group flex min-h-30 items-center gap-4 rounded-xl border border-[#e6e8ec] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#cbd0da] hover:shadow-md sm:p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fdf0f1] text-[#a33448]">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20.8 8.8c0 5.1-8.8 11-8.8 11S3.2 13.9 3.2 8.8A4.3 4.3 0 0 1 12 6.5a4.3 4.3 0 0 1 8.8 2.3Z"/></svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-[#00071b]">Your wishlist</span>
                  <span className="block text-sm leading-5 text-[#777f8d]">Find the pieces you’ve saved.</span>
                </span>
                <span className="text-xl text-[#9aa1ad] transition group-hover:translate-x-1 group-hover:text-[#00071b]" aria-hidden="true">→</span>
              </Link>
            </div>
          </section>

          <section className="mt-8 overflow-hidden rounded-xl border border-[#e6e8ec] bg-white shadow-sm sm:mt-10">
            <Orders embedded />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";
import Orders from "./Orders";
import { fetchApi } from "../data/api";

const apiBaseUrl = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export default function Profile() {
  const { isSignedIn, isAdmin, user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: user?.username || "", email: user?.email || "", fullname: user?.fullname || "" });
  const [passwordData, setPasswordData] = useState({ password: "", confirmPassword: "" });
  const [feedback, setFeedback] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    setPasswordData({ password: "", confirmPassword: "" });
    fetchApi(`${apiBaseUrl}/api/users/profile`)
      .then((profile) => setFormData({ username: profile.username || "", email: profile.email || "", fullname: profile.fullname || "" }))
      .catch((error) => setFeedback({ type: "error", message: error.message || "Could not load your profile." }));
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function closeOnEscape(event) {
      if (event.key === "Escape" && !isSaving) setIsEditing(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isEditing, isSaving]);

  if (!isSignedIn ) return <Navigate to="/sign-in" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  async function handleProfileSubmit(event, updatePassword = false) {
    event.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    try {
      const updatedUser = await fetchApi(`${apiBaseUrl}/api/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...(updatePassword ? passwordData : {}) }),
      });
      login(updatedUser.token);
      if (updatePassword) setPasswordData({ password: "", confirmPassword: "" });
      setFeedback({ type: "success", message: "Your account details have been updated." });
      setIsEditing(false);
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Could not update your profile." });
    } finally {
      setIsSaving(false);
    }
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
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Your account</p>
                  <button type="button" onClick={() => { setFeedback(null); setIsEditing(true); }} aria-label="Edit your account details" title="Edit account details" className="grid h-7 w-7 place-items-center rounded-full text-white/75 transition hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m14 5 5 5M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z"/></svg>
                  </button>
                </div>
                <h1 className="mt-1 text-2xl font-bold sm:text-2xl">Welcome, {user?.fullname || user?.username || "there"}</h1>
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
          {feedback && <p role={feedback.type === "error" ? "alert" : "status"} className={`mt-4 rounded-lg px-4 py-3 text-sm ${feedback.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{feedback.message}</p>}
        </div>
      </main>
      <Footer />
      {isEditing && (
      <div className="no-scrollbar fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-[#101828]/50 p-4 backdrop-blur-[3px]" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSaving) setIsEditing(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" className="max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_24px_90px_rgba(13,22,41,0.25)] sm:p-8">
            <header className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#858b98]">Your account</p><h2 id="edit-profile-title" className="mt-1 text-xl font-bold text-[#101828]">Edit profile</h2><p className="mt-2 text-sm text-[#667085]">Update your account details.</p></div>
              <button type="button" onClick={() => setIsEditing(false)} disabled={isSaving} aria-label="Close edit profile form" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#667085] hover:bg-[#f2f4f7] disabled:opacity-50"><svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15"/></svg></button>
            </header>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              <form onSubmit={(event) => handleProfileSubmit(event)} className="mt-6 min-w-0 space-y-4">
                <div><label htmlFor="profile-fullname" className="mb-1.5 block text-sm font-semibold text-[#344054]">Full name</label><input id="profile-fullname" name="fullname" autoComplete="name" maxLength={100} value={formData.fullname} onChange={(event) => setFormData((current) => ({ ...current, fullname: event.target.value }))} className="h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#667085] focus:ring-2 focus:ring-[#101828]/10" /></div>
                <div><label htmlFor="profile-username" className="mb-1.5 block text-sm font-semibold text-[#344054]">Username</label><input id="profile-username" name="username" autoComplete="username" required minLength={3} maxLength={40} value={formData.username} onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value }))} className="h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#667085] focus:ring-2 focus:ring-[#101828]/10" /></div>
                <div><label htmlFor="profile-email" className="mb-1.5 block text-sm font-semibold text-[#344054]">Email address</label><input id="profile-email" name="email" type="email" autoComplete="email" required maxLength={254} value={formData.email} onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))} className="h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#667085] focus:ring-2 focus:ring-[#101828]/10" /></div>
                {feedback?.type === "error" && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{feedback.message}</p>}
                <button type="submit" disabled={isSaving} className="min-h-11 w-full rounded-lg bg-[#00071b] px-5 text-sm font-semibold text-white hover:bg-[#17213a] disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? "Saving…" : "Save profile"}</button>
              </form>
              <form onSubmit={(event) => handleProfileSubmit(event, true)} className="mt-6 min-w-0 space-y-4 border-t border-[#eaecf0] pt-5 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <div><h3 className="text-sm font-bold text-[#101828]">Change password</h3><p className="mt-1 text-xs text-[#667085]">Choose a new password and confirm it to update your sign-in details.</p></div>
                <div><label htmlFor="profile-password" className="mb-1.5 block text-sm font-semibold text-[#344054]">New password</label><input id="profile-password" name="password" type="password" autoComplete="new-password" minLength={8} value={passwordData.password} onChange={(event) => setPasswordData((current) => ({ ...current, password: event.target.value }))} className="h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#667085] focus:ring-2 focus:ring-[#101828]/10" /></div>
                <div><label htmlFor="profile-confirm-password" className="mb-1.5 block text-sm font-semibold text-[#344054]">Confirm new password</label><input id="profile-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} value={passwordData.confirmPassword} onChange={(event) => setPasswordData((current) => ({ ...current, confirmPassword: event.target.value }))} className="h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm outline-none focus:border-[#667085] focus:ring-2 focus:ring-[#101828]/10" /></div>
                {feedback?.type === "error" && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{feedback.message}</p>}
                <button type="submit" disabled={isSaving} className="min-h-11 w-full rounded-lg border border-[#d0d5dd] px-4 text-sm font-semibold text-[#344054] hover:bg-[#f9fafb] disabled:opacity-50">{isSaving ? "Saving…" : "Update password"}</button>
              </form>
            </div>
            <button type="button" onClick={() => setIsEditing(false)} disabled={isSaving} className="mt-4 min-h-11 w-full rounded-lg px-4 text-sm font-semibold text-[#667085] hover:bg-[#f9fafb] disabled:opacity-50">Close</button>
          </section>
        </div>
      )}
    </>
  );
}

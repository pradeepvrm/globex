import { useUser } from "@clerk/react";
import { Navigate } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function AdminRoute({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <main className="min-h-[55vh] bg-[#f9faff] px-4 py-12 text-center text-sm text-[#646464]">
          Loading admin panel...
        </main>
        <Footer />
      </>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (user?.publicMetadata?.role !== "admin") {
    return (
      <>
        <Navbar />
        <main className="min-h-[55vh] bg-[#f9faff] px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-blue-950">Admins only</h1>
          <p className="mt-3 text-sm text-[#646464]">
            Your account does not have access to the admin panel.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return children;
}

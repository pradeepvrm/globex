import { useUser, useAuth } from "@clerk/react";
import { Link, Navigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

const PAYMENT_LABELS = {
  card: "Credit / debit card",
  cod: "Cash on delivery",
};

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Orders() {
  const { isLoaded, user } = useUser();
  const { isSignedIn } = useAuth();
  const userId = user?.id ?? "guest";

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <main className="min-h-[55vh] bg-[#f9faff] px-4 py-12 text-center text-sm text-[#646464]">
          Loading orders...
        </main>
        <Footer />
      </>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return <OrdersForUser userId={userId} />;
}

function OrdersForUser({ userId }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL}/api/orders/${userId}`;
    const controller = new AbortController();

    const fetchOrders = async () => {
      setLoadError("");
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Could not load your orders. Please try again.");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load orders", error);
          setLoadError(error.message || "Could not connect to the order service.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    fetchOrders();
    return () => controller.abort();
  }, [userId]);

  return (
    <>
      <Navbar />
      <main className="min-h-[55vh] bg-[#f9faff]">
        <section className="mx-auto w-full max-w-300 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-blue-950 sm:text-3xl">My Orders</h1>
              <p className="mt-2 text-sm text-[#646464]">
                {orders.length} {orders.length === 1 ? "order" : "orders"} placed
              </p>
            </div>
            <Link to="/products" className="text-xs font-bold text-blue-950 underline underline-offset-4 hover:text-[#646464]">
              Continue shopping
            </Link>
          </div>

          {isLoading ? (
            <p className="py-12 text-center text-sm text-[#646464]">Loading orders...</p>
          ) : loadError ? (
            <p role="alert" className="rounded-xl border border-[#fecdca] bg-white px-5 py-8 text-center text-sm text-[#b42318]">
              {loadError}
            </p>
          ) : orders.length ? (
            <ul className="space-y-5">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </ul>
          ) : (
            <section className="rounded-xl border border-[#e8e8e8] bg-white px-5 py-12 text-center shadow-[0_0_20px_rgba(0,0,0,0.04)]">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#f0f0f0] text-[#646464]" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5z" />
                  <path d="M4 7.5 12 12l8-4.5M12 12v9" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-bold text-[#00071b]">No orders yet</h2>
              <p className="mt-2 text-xs text-[#646464]">Once you place an order, it will appear here.</p>
              <Link to="/products" className="mt-5 inline-flex rounded-md bg-[#00071b] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#17213a]">
                Start shopping
              </Link>
            </section>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function OrderCard({ order }) {
  const items = order.items.filter((item) => (
    item && typeof item.id === "number" && Number.isInteger(item.quantity) && item.quantity > 0
  ));
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = Number(order.total ?? items.reduce((amount, item) => amount + item.price * item.quantity, 0));

  return (
    <li>
      <article className="overflow-hidden rounded-xl border border-[#e8e8e8] bg-white shadow-[0_0_20px_rgba(0,0,0,0.04)]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8e8e8] bg-[#f8f9fb] px-4 py-4 sm:px-5">
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-[#848484]">Order</dt>
              <dd className="mt-1 text-xs font-bold text-[#00071b] sm:text-sm">#{order.id}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-[#848484]">Placed</dt>
              <dd className="mt-1 text-xs font-semibold text-[#272727] sm:text-sm">{formatDate(order.placedAt)}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wide text-[#848484]">Total</dt>
              <dd className="mt-1 text-xs font-bold text-[#00071b] sm:text-sm">{formatPrice(total)}</dd>
            </div>
          </dl>
          <span className="rounded-full bg-[#ecfdf3] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#039855]">
            {order.status || "Confirmed"}
          </span>
        </header>

        <ul className="divide-y divide-[#e8e8e8]">
          {items.map((item) => (
            <li key={`${item.id}-${item.size || "one-size"}`} className="flex items-center gap-3 px-4 py-4 sm:px-5">
              <Link to={`/products/${item.id}`} className="shrink-0">
                <img src={item.image} alt={item.imageAlt || item.name} className="h-20 w-16 rounded-md bg-[#f0f0f0] object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#848484]">{item.brand}</p>
                <h2 className="mt-1 line-clamp-2 text-xs font-bold text-[#272727] sm:text-sm">
                  <Link to={`/products/${item.id}`} className="hover:underline">{item.name}</Link>
                </h2>
                {item.size && <p className="mt-1 text-[10px] text-[#646464]">Size: {item.size}</p>}
                <p className="mt-1 text-[10px] text-[#848484]">Quantity: {item.quantity}</p>
              </div>
              <span className="text-xs font-bold text-[#00071b]">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e8e8e8] px-4 py-3.5 text-[10px] text-[#848484] sm:px-5">
          <span>{itemCount} {itemCount === 1 ? "item" : "items"} · {PAYMENT_LABELS[order.paymentMethod] || "Payment confirmed"}</span>
          <span>Free delivery on orders over Rs. 1000</span>
        </footer>
      </article>
    </li>
  );
}

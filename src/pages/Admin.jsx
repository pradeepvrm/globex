import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AdminProducts from "./AdminProducts";
import AdminUsers from "./AdminUsers";
import { useAuth } from "../auth/AuthContext";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Admin() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");
  const [view, setView] = useState("orders");
  const [ordersForUser, setOrdersForUser] = useState(null);
  const [userOrdersLoading, setUserOrdersLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      try {
        setError("");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.msg || "Could not load orders.");
        }

        const data = await response.json();
        if (!cancelled) {
          setAllOrders(data.data || []);
          setOrders(data.data || []);
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || "Could not connect to the API.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadOrders();

    const loadStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.msg || "Could not load dashboard statistics.");
        if (!cancelled) setStats(body.data);
      } catch (statsError) {
        if (!cancelled) setError(statsError.message || "Could not load dashboard statistics.");
      }
    };
    loadStats();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleStatusChange = async (orderNumber, status) => {
    setSavingId(orderNumber);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderNumber}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.msg || "Could not update the order status.");
      }

      setOrders((current) =>
        current.map((order) => (order.id === orderNumber ? { ...order, status } : order)),
      );
    } catch (updateError) {
      setError(updateError.message || "Could not update the order status.");
    } finally {
      setSavingId("");
    }
  };

  const handleViewUserOrders = async (user) => {
    setOrdersForUser(user);
    setView("orders");
    setUserOrdersLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${user.id}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.msg || "Could not load this user's orders.");
      setOrders(body.data || []);
    } catch (loadError) {
      setError(loadError.message || "Could not load this user's orders.");
    } finally {
      setUserOrdersLoading(false);
    }
  };

  const showAllOrders = () => {
    setOrdersForUser(null);
    setOrders(allOrders);
    setIsLoading(false);
    setUserOrdersLoading(false);
    setError("");
    setView("orders");
  };

  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-3.5rem)] bg-[#f4f6fa]">
        <section className="mx-auto w-full max-w-360 px-4 py-6 sm:px-6 sm:py-9 lg:px-10">
          <div className="mb-7 overflow-hidden rounded-3xl bg-[#101a31] px-6 py-7 text-white shadow-[0_18px_50px_rgba(16,26,49,0.16)] sm:px-9 sm:py-9">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#aebbd2]">Globex / Administration</p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Welcome back, Admin</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#c5cede]">
                {view === "orders"
                  ? ordersForUser ? `Orders for ${ordersForUser.username} · ${orders.length} ${orders.length === 1 ? "order" : "orders"} · ${formatPrice(revenue)} total` : `${orders.length} ${orders.length === 1 ? "order" : "orders"} · ${formatPrice(revenue)} total`
                : view === "products" ? "Manage the product catalog" : "Manage registered users"}
                </p>
              </div>
              <nav aria-label="Admin sections" className="flex w-full rounded-xl border border-white/10 bg-white/5 p-1 sm:w-fit">
                {[
                  ["orders", "Orders", showAllOrders],
                  ["products", "Products", () => setView("products")],
                  ["users", "Users", () => setView("users")],
                ].map(([section, label, onClick]) => (
                  <button
                    key={section}
                    type="button"
                    onClick={onClick}
                    aria-current={view === section ? "page" : undefined}
                    className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none ${
                      view === section
                        ? "bg-white text-[#101a31] shadow-sm"
                        : "text-[#d5dbea] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          <div className="mb-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8993a5]">Overview</p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#172238]">Store performance</h2>
              </div>
              <span className="hidden text-xs text-[#8993a5] sm:inline">Live store metrics</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
              {[
                ["Revenue", formatPrice(stats?.revenue)],
                ["Total orders", stats?.totalOrders],
                ["Total users", stats?.totalUsers],
                ["Pending orders", stats?.pendingOrders],
                ["Cancelled orders", stats?.cancelledOrders],
                ["Total products", stats?.totalProducts],
                ["Out of stock", stats?.outOfStockProducts],
              ].map(([label, value]) => (
                <article key={label} className="group min-h-27 rounded-2xl border border-[#e7eaf0] bg-white p-4 shadow-[0_3px_14px_rgba(16,26,49,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-[#d7ddea] hover:shadow-[0_10px_24px_rgba(16,26,49,0.08)] sm:p-5">
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-bold uppercase leading-4 tracking-[0.11em] text-[#8993a5]">{label}</p>
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#a8b7d0] transition-colors group-hover:bg-[#385583]" />
                  </div>
                  <p className="text-xl font-semibold tracking-tight text-[#172238] sm:text-2xl">{value ?? "—"}</p>
                </article>
              ))}
            </div>
          </div>

          {view === "orders" ? (
            <>
          {ordersForUser && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e7eaf0] bg-white px-5 py-4 shadow-sm">
              <p className="text-sm text-[#657087]">Showing orders for <span className="font-semibold text-[#172238]">{ordersForUser.username}</span></p>
              <button type="button" onClick={showAllOrders} className="text-sm font-semibold text-[#385583] transition-colors hover:text-[#172238]">Show all orders <span aria-hidden="true">→</span></button>
            </div>
          )}
          {error && (
            <p role="alert" className="mb-5 rounded-2xl border border-[#fecdca] bg-white px-5 py-4 text-sm text-[#b42318]">
              {error}
            </p>
          )}

          {isLoading || userOrdersLoading ? (
            <p className="rounded-2xl border border-[#e7eaf0] bg-white py-16 text-center text-sm text-[#657087]">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="rounded-2xl border border-[#e7eaf0] bg-white px-5 py-16 text-center text-sm text-[#657087]">
              No orders yet.
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#e7eaf0] bg-white shadow-[0_4px_20px_rgba(16,26,49,0.045)]">
              <div className="flex items-center justify-between border-b border-[#edf0f5] px-5 py-4 sm:px-6">
                <div>
                  <h2 className="text-base font-semibold text-[#172238]">{ordersForUser ? "Customer orders" : "Recent orders"}</h2>
                  <p className="mt-1 text-xs text-[#8993a5]">{orders.length} {orders.length === 1 ? "order" : "orders"} in this view</p>
                </div>
                <span className="rounded-full bg-[#f1f4f9] px-3 py-1 text-[11px] font-semibold text-[#657087]">Orders</span>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-left text-sm">
                <thead className="bg-[#f8f9fb] text-[10px] font-bold uppercase tracking-[0.12em] text-[#8993a5]">
                  <tr>
                    <th className="px-5 py-3.5 sm:px-6">Order ID</th>
                    <th className="px-5 py-3.5">Placed At</th>
                    <th className="px-5 py-3.5">Customer ID</th>
                    <th className="px-5 py-3.5">Items</th>
                    <th className="px-5 py-3.5">Total</th>
                    <th className="px-5 py-3.5 sm:pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf0f5]">
                  {orders.map((order) => (
                    <tr key={order.id} className="align-middle transition-colors hover:bg-[#fafbfc]">
                      <td className="px-5 py-4 font-semibold text-[#172238] sm:px-6">#{order.id}</td>
                      <td className="px-5 py-4 text-[#657087]">{formatDate(order.placedAt)}</td>
                      <td className="px-5 py-4 text-[#657087]">{order.userId}</td>
                      <td className="px-5 py-4 text-[#657087]">
                        {(order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#172238]">{formatPrice(order.total)}</td>
                      <td className="px-5 py-4 sm:pr-6">
                        <select
                          value={order.status}
                          disabled={savingId === order.id}
                          onChange={(event) => handleStatusChange(order.id, event.target.value)}
                          aria-label={`Update status for order ${order.id}`}
                          className="rounded-lg border border-[#e0e5ed] bg-[#f8f9fb] px-3 py-2 text-xs font-semibold capitalize text-[#35445f] outline-none transition focus:border-[#7187ad] focus:ring-2 focus:ring-[#7187ad]/15 disabled:cursor-wait disabled:opacity-50"
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
            </>
          ) : view === "products" ? (
            <AdminProducts />
          ) : (
            <AdminUsers onViewOrders={handleViewUserOrders} />
          )}
        </section>
      </main>
    </>
  );
}

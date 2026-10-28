import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AdminProducts from "./AdminProducts";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Admin() {
  const { getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");
  const [view, setView] = useState("orders");

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      try {
        setError("");
        const token = await getToken();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.msg || "Could not load orders.");
        }

        const data = await response.json();
        if (!cancelled) setOrders(data.data);
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || "Could not connect to the API.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  const handleStatusChange = async (orderNumber, status) => {
    setSavingId(orderNumber);
    setError("");

    try {
      const token = await getToken();
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

  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <>
      <Navbar />
      <main className="min-h-[55vh] bg-[#f9faff]">
        <section className="mx-auto w-full max-w-300 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-blue-950 sm:text-3xl">Welcome, Admin</h1>
              <p className="mt-2 text-sm text-[#646464]">
                {view === "orders"
                  ? `${orders.length} ${orders.length === 1 ? "order" : "orders"} · ${formatPrice(revenue)} total`
                  : "Manage the product catalog"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setView("orders")}
                className={`rounded-md px-4 py-2 text-xs font-bold ${view === "orders" ? "bg-[#00071b] text-white" : "border border-[#d0d5dd] text-[#272727]"}`}
              >
                Orders
              </button>
              <button
                type="button"
                onClick={() => setView("products")}
                className={`rounded-md px-4 py-2 text-xs font-bold ${view === "products" ? "bg-[#00071b] text-white" : "border border-[#d0d5dd] text-[#272727]"}`}
              >
                Products
              </button>
            </div>
          </div>

          {view === "orders" ? (
            <>
          {error && (
            <p role="alert" className="mb-5 rounded-xl border border-[#fecdca] bg-white px-5 py-4 text-sm text-[#b42318]">
              {error}
            </p>
          )}

          {isLoading ? (
            <p className="py-12 text-center text-sm text-[#646464]">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="rounded-xl border border-[#e8e8e8] bg-white px-5 py-12 text-center text-sm text-[#646464]">
              No orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#e8e8e8] bg-white shadow-[0_0_20px_rgba(0,0,0,0.04)]">
              <table className="w-full min-w-190 text-left text-sm">
                <thead className="border-b border-[#e8e8e8] bg-[#f8f9fb] text-[10px] font-bold uppercase tracking-wide text-[#848484]">
                  <tr>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Placed At</th>
                    <th className="px-4 py-3">Customer ID</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e8e8]">
                  {orders.map((order) => (
                    <tr key={order.id} className="align-top">
                      <td className="px-4 py-4 font-bold text-[#00071b]">#{order.id}</td>
                      <td className="px-4 py-4 text-[#646464]">{formatDate(order.placedAt)}</td>
                      <td className="px-4 py-4 text-[#646464]">{order.userId}</td>
                      <td className="px-4 py-4 text-[#646464]">
                        {(order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0)}
                      </td>
                      <td className="px-4 py-4 font-bold text-[#00071b]">{formatPrice(order.total)}</td>
                      <td className="px-4 py-4">
                        <select
                          value={order.status}
                          disabled={savingId === order.id}
                          onChange={(event) => handleStatusChange(order.id, event.target.value)}
                          className="rounded-md border border-[#d0d5dd] bg-white px-2 py-1.5 text-xs font-semibold text-[#272727] capitalize disabled:opacity-50"
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
          )}
            </>
          ) : (
            <AdminProducts />
          )}
        </section>
      </main>
    </>
  );
}

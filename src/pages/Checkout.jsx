import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/react";
import { Link, useNavigate } from "react-router-dom";
import useLocalStorage from "../data/useLocalStorage";

const formatPrice = (amount) => `Rs. ${amount.toLocaleString("en-IN")}`;

export default function Checkout({ isModal = false }) {
  const { isLoaded, user } = useUser();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id ?? "guest";

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 z-100 grid place-items-center bg-[#101828]/35 p-4 backdrop-blur-sm">
        <p className="rounded-2xl bg-white px-6 py-5 text-sm text-[#646464] shadow-2xl">Loading checkout...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return navigate("/sign-in");
  }

  return (
    <CheckoutContent
      key={userId}
      isModal={isModal}
      user={user}
      storageKey={`cartItems:${userId}`}
      onClose={() => (isModal ? navigate(-1) : navigate("/cart"))}
    />
  );
}

function CheckoutContent({ isModal, user, storageKey, onClose }) {
  const [savedItems, setItems, storageError] = useLocalStorage(storageKey, []);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const items = Array.isArray(savedItems)
    ? savedItems.filter((item) => item && typeof item.id === "number" && Number.isInteger(item.quantity) && item.quantity > 0)
    : [];
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const total = subtotal + shipping;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  async function placeOrder(event) {
    event.preventDefault();
    setSubmitError("");
    if (items.length === 0) {
      setSubmitError("Add an item to your cart before placing an order.");
      return;
    }
    const order = {
      id: `GBX-${Date.now().toString(36).toUpperCase()}`,
      userId: user.id,
      placedAt: new Date().toISOString(),
      paymentMethod,
      items: items.map(({ id, name, brand, price, quantity, image, imageAlt, size }) => ({
        id, name, brand, price, quantity, image, imageAlt, size,
      })),
      subtotal,
      shipping,
      total,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      const savedOrder = await response.json();
      if (!response.ok) {
        throw new Error(savedOrder.error || "Your order could not be saved. Please try again.");
      }
      setItems([]);
      setPlacedOrder(savedOrder);
    } catch (error) {
      setSubmitError(error.message || "Could not connect to the order service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-[#101828]/45 p-0 backdrop-blur-[3px] sm:p-5 ${isModal ? "" : "min-h-screen"}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="relative my-auto flex max-h-[min(880px,100vh)] w-full max-w-260 flex-col overflow-hidden bg-white shadow-[0_24px_90px_rgba(13,22,41,0.25)] sm:rounded-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[#ededed] px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f4f5f8] text-[#00071b]" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
                <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
                <path d="M3.5 10h17M7 14.5h3" />
              </svg>
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#858b98]">Globex store</p>
              <h1 id="checkout-title" className="text-base font-bold text-[#101828] sm:text-lg">Secure checkout</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="grid h-9 w-9 place-items-center rounded-full text-[#667085] transition-colors hover:bg-[#f2f4f7] hover:text-[#101828] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-950"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" />
            </svg>
          </button>
        </header>

        {placedOrder ? (
          <div className="grid min-h-105 flex-1 place-items-center px-6 py-12 text-center">
            <div className="max-w-sm">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#ecfdf3] text-[#039855]">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </div>
              <h2 className="mt-5 text-2xl font-bold text-[#101828]">Order placed!</h2>
              <p className="mt-2 text-xs text-[#667085]">Order #{placedOrder.id}</p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/orders" className="rounded-lg bg-[#00071b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17213a]">
                  View my orders
                </Link>
                <button type="button" onClick={onClose} className="rounded-lg border border-[#d0d5dd] px-5 py-3 text-sm font-semibold text-[#344054] transition hover:bg-[#f2f4f7]">
                  Continue shopping
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_360px]">
            <form onSubmit={placeOrder} className="px-5 py-6 sm:px-8 sm:py-7">
              <div className="mb-7 flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#00071b] text-xs font-bold text-white">1</span>
                <span className="text-sm font-semibold text-[#101828]">Delivery details</span>
                <span className="h-px flex-1 bg-[#eaecf0]" />
                <span className="text-xs text-[#98a2b3]">2</span>
                <span className="text-xs text-[#98a2b3]">Payment</span>
              </div>

              <section aria-labelledby="contact-heading">
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <h2 id="contact-heading" className="text-sm font-bold text-[#101828]">Contact information</h2>
                  </div>
                  {!user && <Link to="/sign-in" className="text-xs font-semibold text-[#344054] underline underline-offset-2">Sign in</Link>}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-medium text-[#344054]">
                    Full name
                    <input required autoComplete="name" defaultValue={user?.fullName || ""} placeholder="Your full name" className="mt-1.5 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm font-normal text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#667085] focus:ring-2 focus:ring-[#101828]/10" />
                  </label>
                  <label className="text-xs font-medium text-[#344054]">
                    Email address
                    <input required type="email" autoComplete="email" defaultValue={user.primaryEmailAddress?.emailAddress || ""} placeholder="you@example.com" className="mt-1.5 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm font-normal text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#667085] focus:ring-2 focus:ring-[#101828]/10" />
                  </label>
                </div>
              </section>

              <section aria-labelledby="address-heading" className="mt-7 border-t border-[#eaecf0] pt-6">
                <h2 id="address-heading" className="mb-4 text-sm font-bold text-[#101828]">Shipping address</h2>
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-[#344054]">
                    Street address
                    <input required autoComplete="street-address" placeholder="House number and street name" className="mt-1.5 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm font-normal text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#667085] focus:ring-2 focus:ring-[#101828]/10" />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-medium text-[#344054]">
                      City
                      <input required autoComplete="address-level2" placeholder="City" className="mt-1.5 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm font-normal text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#667085] focus:ring-2 focus:ring-[#101828]/10" />
                    </label>
                    <label className="text-xs font-medium text-[#344054]">
                      State
                      <input required autoComplete="address-level1" placeholder="State" className="mt-1.5 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm font-normal text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#667085] focus:ring-2 focus:ring-[#101828]/10" />
                    </label>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-medium text-[#344054]">
                      PIN code
                      <input required type="number" pattern="[0-9]{6}" minLength={6} maxLength={6} autoComplete="postal-code" placeholder="6-digit PIN code" className="mt-1.5 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm font-normal text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#667085] focus:ring-2 focus:ring-[#101828]/10" />
                    </label>
                    <label className="text-xs font-medium text-[#344054]">
                      Phone number
                      <input required type="number" inputMode="tel" pattern="[0-9+ -]{10,15}" minLength={10} autoComplete="tel" placeholder="+91 98765 43210" className="mt-1.5 h-11 w-full rounded-lg border border-[#d0d5dd] px-3 text-sm font-normal text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[#667085] focus:ring-2 focus:ring-[#101828]/10" />
                    </label>
                  </div>
                </div>
              </section>

              <section aria-labelledby="payment-heading" className="mt-7 border-t border-[#eaecf0] pt-6">
                <h2 id="payment-heading" className="text-sm font-bold text-[#101828]">Payment method</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    { id: "card", title: "Credit or debit card", detail: "Visa, Mastercard, RuPay" },
                    { id: "cod", title: "Cash on delivery", detail: "Pay when your order arrives" },
                  ].map((method) => (
                    <label key={method.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${paymentMethod === method.id ? "border-[#00071b] bg-[#f8f9fc]" : "border-[#eaecf0] hover:border-[#c7ccd5]"}`}>
                      <input type="radio" name="paymentMethod" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="mt-0.5 accent-[#00071b]" />
                      <span>
                        <span className="block text-xs font-semibold text-[#101828]">{method.title}</span>
                        <span className="mt-1 block text-[10px] text-[#667085]">{method.detail}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              {submitError && <p role="alert" className="mt-4 text-xs text-[#b42318]">{submitError}</p>}
              {storageError && <p role="alert" className="mt-2 text-xs text-[#b42318]">{storageError}</p>}

              <button type="submit" disabled={itemCount === 0 || isSubmitting} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#00071b] px-4 text-sm font-semibold text-white transition hover:bg-[#17213a] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#00071b] disabled:cursor-not-allowed disabled:bg-[#a5a9b1]">
                {isSubmitting ? "Saving order..." : `Place order · ${formatPrice(total)}`}
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M3.5 10h13m-5-5 5 5-5 5" />
                </svg>
              </button>
            </form>

            <aside className="border-t border-[#eaecf0] bg-[#f8f9fb] px-5 py-6 sm:px-8 lg:border-l lg:border-t-0 lg:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#101828]">Order summary</h2>
                <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-[#667085]">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
              </div>
              {items.length > 0 ? (
                <ul className="mt-5 max-h-52 space-y-4 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <li key={`${item.id}-${item.size || "one-size"}`} className="flex gap-3">
                      <div className="relative h-17 w-14 shrink-0 overflow-hidden rounded-lg bg-[#eaecf0]">
                        <img src={item.image} alt={item.imageAlt || item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-[10px] text-[#667085]">{item.brand}</p>
                        <p className="mt-1 line-clamp-2 text-xs font-semibold leading-4 text-[#101828]">{item.name}</p>
                        {item.size && <p className="mt-1 text-[10px] text-[#667085]">Size: {item.size}</p>}
                      </div>
                      <span className="pt-0.5 text-xs font-semibold text-[#101828]">{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 rounded-lg border border-dashed border-[#d0d5dd] p-4 text-center text-xs text-[#667085]">Your cart is empty.</p>
              )}
              <div className="mt-5 space-y-3 border-t border-[#e4e7ec] pt-4 text-xs">
                <div className="flex justify-between text-[#667085]"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-[#667085]"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                <div className="flex justify-between border-t border-[#e4e7ec] pt-3 text-sm font-bold text-[#101828]"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
              <p className="mt-5 text-[10px] leading-5 text-[#98a2b3]">Shipping is free on orders over Rs. 1000</p>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

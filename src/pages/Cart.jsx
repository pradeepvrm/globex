import { useUser } from "@clerk/react";
import { Link } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import OrderSummary from "../components/OrderSummary";
import useLocalStorage from "../data/useLocalStorage";

export default function Cart() {
  const { isLoaded, user } = useUser();
  const userId = user?.id ?? "guest";

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f9faff] px-4 py-12 text-center text-sm text-[#646464]">
          Loading cart...
        </main>
        <Footer />
      </>
    );
  }

  return <CartForUser key={userId} storageKey={`cartItems:${userId}`} />;
}

function CartForUser({ storageKey }) {
  const [savedItems, setItems, storageError] = useLocalStorage(storageKey, []);
  const items = Array.isArray(savedItems) ? savedItems.filter((item) => (
    item && typeof item.id === "number" && Number.isInteger(item.quantity) && item.quantity > 0
  )) : [];

  function changeQuantity(productId, change, size) {
    setItems((currentItems) => currentItems
      .map((item) => item.id === productId && item.size === size
        ? { ...item, quantity: item.quantity + change }
        : item)
      .filter((item) => item.quantity > 0));
  }

  function removeItem(productId, size) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId || item.size !== size));
  }

  return (
    <>
      <Navbar cartCount={items.reduce((total, item) => total + item.quantity, 0)} />
      <main className="min-h-screen bg-[#f9faff]">
        <section className="mx-auto w-full max-w-300 px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-blue-950 sm:text-3xl">Your cart</h1>
            </div>
            <Link to="/products" className="text-xs font-bold text-blue-950 underline underline-offset-4 hover:text-[#646464]">
              Continue shopping
            </Link>
          </div>

          {items.length > 0 ? (
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_290px] xl:grid-cols-[minmax(0,1fr)_310px]">
              <section className="overflow-hidden rounded-xl border border-[#e8e8e8] bg-white shadow-[0_0_20px_rgba(0,0,0,0.04)]">
                <div className="hidden grid-cols-[minmax(0,1fr)_100px_95px] gap-3 border-b border-[#e8e8e8] px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#848484] sm:grid md:px-5">
                  <span>Product</span><span className="text-center">Quantity</span><span className="text-right">Subtotal</span>
                </div>
                <ul className="divide-y divide-[#e8e8e8]">
                  {items.map((item) => (
                    <li key={`${item.id}-${item.size || "one-size"}`} className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_100px_95px] sm:items-center sm:gap-3 sm:px-4 sm:py-4 md:px-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <Link to={`/products/${item.id}`}><img src={item.image} alt={item.imageAlt} className="h-20 w-16 shrink-0 rounded-md bg-[#f0f0f0] object-cover sm:h-22 sm:w-18" /></Link>
                        <div className="min-w-0">
                          <p className="text-[10px] text-[#848484]">{item.brand}</p>
                          <h2 className="mt-1 truncate text-xs font-bold text-[#272727] sm:text-sm">{item.name}</h2>
                          {item.size && <p className="mt-1 text-[10px] text-[#646464]">Size: {item.size}</p>}
                          <p className="mt-1.5 text-xs font-bold text-[#00071b]">Rs. {item.price.toLocaleString("en-IN")}</p>
                          <button type="button" onClick={() => removeItem(item.id, item.size)} className="mt-1.5 text-[10px] text-[#848484] underline underline-offset-2 hover:text-[#00071b]">Remove</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-center">
                        <span className="text-xs text-[#848484] sm:hidden">Quantity</span>
                        <div className="flex items-center rounded-md border border-[#dedede]">
                          <button type="button" onClick={() => changeQuantity(item.id, -1, item.size)} className="h-7 w-7 text-base text-[#272727] hover:bg-[#f5f5f5]">−</button>
                          <span className="min-w-7 text-center text-xs text-[#272727]">{item.quantity}</span>
                          <button type="button" onClick={() => changeQuantity(item.id, 1, item.size)} className="h-7 w-7 text-base text-[#272727] hover:bg-[#f5f5f5]">+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end">
                        <span className="text-xs text-[#848484] sm:hidden">Subtotal</span>
                        <span className="text-xs font-bold text-[#00071b]">Rs. {(item.price * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
              <OrderSummary items={items} />
            </div>
          ) : (
            <section className="rounded-xl border border-[#e8e8e8] bg-white px-5 py-12 text-center shadow-[0_0_20px_rgba(0,0,0,0.04)]">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#f0f0f0] text-xl text-[#646464]" aria-hidden="true">♡</div>
              <h2 className="mt-4 text-lg font-bold text-[#00071b]">Your cart is empty</h2>
              <p className="mt-2 text-xs text-[#646464]">Looks like you haven’t added anything to your bag yet.</p>
              <Link to="/products" className="mt-5 inline-flex rounded-md bg-[#00071b] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#17213a]">Explore products</Link>
            </section>
          )}
          {storageError && <p role="alert" className="mt-4 text-sm text-[#b42318]">{storageError}</p>}
        </section>
      </main>
      <Footer />
    </>
  );
}

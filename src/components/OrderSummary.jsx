import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSummary({ items }) {
  const navigate = useNavigate();
  const location = useLocation();
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((amount, item) => amount + item.price * item.quantity, 0);
  const shipping =  total > 1000 ? 0 : 50;

  return (
    <section className="rounded-xl border border-[#e8e8e8] bg-white p-4 shadow-[0_0_20px_rgba(0,0,0,0.04)] sm:p-5 lg:sticky lg:top-20">
      <h2 className="text-base font-bold text-[#00071b]">Order summary</h2>
      <div className="mt-4 space-y-3 text-xs text-[#646464]">
        <div className="flex justify-between gap-4">
          <span>Items ({quantity})</span>
          <span className="font-bold text-[#272727]">Rs.{total}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Shipping</span>
          {shipping === 0 ? (
            <span className="font-bold text-[#272727]">
              <span className="line-through">Rs.50</span> Free
            </span>
          ) : (
            <span className="font-bold text-[#272727]">Rs.50</span>
          )}
        </div>
      </div>
      <div className="my-4 border-t border-[#e8e8e8]" />
      <div className="flex justify-between gap-4 text-sm font-bold text-[#00071b]">
        <span>Total</span>
        <span>Rs.{total + shipping}</span>
      </div>
      <button
        type="button"
        onClick={() => navigate("/checkout", { state: { backgroundLocation: location } })}
        disabled={quantity === 0}
        className="mt-5 w-full rounded-md bg-blue-950 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#17213a] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#00071b] disabled:cursor-not-allowed disabled:bg-[#a5a9b1]"
      >
        Proceed to checkout
      </button>
      <p className="mt-3 text-center text-[10px] text-[#848484]">Shipping and taxes calculated at checkout.</p>
    </section>
  );
}

export default function OrderSummary({ items }) {
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((amount, item) => amount + item.price * item.quantity, 0);
  const formatPrice = (amount) => `Rs. ${amount.toLocaleString("en-IN")}`;

  return (
    <section className="rounded-xl border border-[#e8e8e8] bg-white p-4 shadow-[0_0_20px_rgba(0,0,0,0.04)] sm:p-5 lg:sticky lg:top-20" aria-labelledby="order-summary-title">
      <h2 id="order-summary-title" className="font-libre text-base font-bold text-[#00071b]">Order summary</h2>
      <div className="mt-4 space-y-3 font-libre text-xs text-[#646464]">
        <div className="flex justify-between gap-4">
          <span>Items ({quantity})</span>
          <span className="font-bold text-[#272727]">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Total quantity</span>
          <span className="font-bold text-[#272727]">{quantity}</span>
        </div>
      </div>
      <div className="my-4 border-t border-[#e8e8e8]" />
      <div className="flex justify-between gap-4 font-libre text-sm font-bold text-[#00071b]">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      <button
        type="button"
        disabled={quantity === 0}
        className="mt-5 w-full rounded-md bg-[#00071b] px-4 py-2.5 font-libre text-xs font-bold text-white transition-colors hover:bg-[#17213a] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#00071b] disabled:cursor-not-allowed disabled:bg-[#a5a9b1]"
      >
        Proceed to checkout
      </button>
      <p className="mt-3 text-center font-libre text-[10px] text-[#848484]">Shipping and taxes calculated at checkout.</p>
    </section>
  );
}

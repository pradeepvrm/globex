export default function ProductCard({
  image,
  name = "Womens Denim Jacket",
  brand = "Prada",
  price = 700,
  originalPrice = 1000,
  rating = 4.4,
  onClick,
}) {
  const discount = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <article
      onClick={onClick}
      className="w-full max-w-85 overflow-hidden rounded-lg bg-white shadow-[0_0_20px_rgba(0,0,0,0.05)]"
    >
      <div className="aspect-4/3 w-full overflow-hidden rounded-t-lg bg-[#c4c4c4]">
        {image ? (
          <img src={image} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>

      <div className="flex min-h-26 flex-col px-4 py-3 font-libre text-[#272727]">
        <h2 className="truncate text-[17px] font-bold leading-snug">{name}</h2>

        <div className="mt-1 flex items-center gap-2 text-[13px] leading-normal">
          <p className="min-w-0 flex-1 truncate">{brand}</p>
          <div className="flex shrink-0 items-center gap-1.25 text-[#848484]">
            <span>{rating}</span>
            <span className="text-[14px] text-[#d9a526]" aria-hidden="true">★</span>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 text-[13px] leading-normal">
          <span className="text-[17px] font-bold">Rs. {price}</span>
          {discount > 0 && (
            <>
              <span className="text-[#848484] line-through">Rs. {originalPrice}</span>
              <span className="font-bold text-[#0a8200]">({discount}% off)</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

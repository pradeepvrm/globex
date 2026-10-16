import { Link } from 'react-router'

export default function ProductCard({
  id,
  image,
  name = "Womens Denim Jacket",
  brand = "Prada",
  price = 700,
  originalPrice = 1000,
  rating = 4.4,
  onClick,
  size = "regular",
  imageAlt = name,
  ratingIcon,
}) {
  const discount = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const isLarge = size === "large";
  const isTrending = size === "trending";

  return (
    <article
      onClick={onClick}
      className={`w-full ${isTrending ? "max-w-none rounded-[10px] shadow-[0_0_30px_rgba(0,0,0,0.05)]" : isLarge ? "max-w-102.5 rounded-[10px] shadow-[0_0_30px_rgba(0,0,0,0.05)]" : "max-w-85 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.05)]"} overflow-hidden bg-white`}
    >
      <div className={`${isLarge || isTrending ? "aspect-410/301" : "aspect-4/3"} w-full overflow-hidden rounded-t-lg bg-[#c4c4c4]`}>
        <Link to={`/products/${id}`}>
          <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
          </Link>
      </div>

      <div className={`flex flex-col font-libre text-[#272727] ${isTrending ? "min-h-[clamp(74px,6.35vw,122px)] px-[clamp(12px,1.1vw,21px)] py-[clamp(8px,0.625vw,12px)]" : isLarge ? "min-h-30.5 px-5 py-3" : "min-h-26 px-4 py-3"}`}>
        <h2 className={`truncate font-bold leading-snug ${isTrending ? "text-[clamp(15px,1.25vw,24px)]" : isLarge ? "text-2xl" : "text-[17px]"}`}>{name}</h2>

        <div className={`mt-1 flex items-center gap-2 leading-normal ${isTrending ? "text-[clamp(11px,0.94vw,18px)]" : isLarge ? "text-lg" : "text-[13px]"}`}>
          <p className="min-w-0 flex-1 truncate">{brand}</p>
          <div className={`flex shrink-0 items-center text-[#848484] ${isLarge ? "gap-1.5" : "gap-1.25"}`}>
            <span>{rating}</span>
            {ratingIcon ? (
              <img src={ratingIcon} alt="" className={`${isTrending ? "h-[clamp(11px,0.9vw,17px)] w-[clamp(12px,0.94vw,18px)]" : isLarge ? "h-4.25 w-4.5" : "h-3.5 w-3.5"}`} />
            ) : (
              <span className={`${isTrending ? "text-[clamp(10px,0.73vw,14px)]" : "text-[14px]"} text-[#d9a526]`} aria-hidden="true">★</span>
            )}
          </div>
        </div>

        <div className={`mt-auto flex flex-wrap items-baseline gap-x-2 leading-normal ${isTrending ? "text-[clamp(11px,0.94vw,18px)]" : isLarge ? "text-lg" : "text-[13px]"}`}>
          <span className={`font-bold ${isTrending ? "text-[clamp(15px,1.25vw,24px)]" : isLarge ? "text-2xl" : "text-[17px]"}`}>Rs. {price}</span>
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

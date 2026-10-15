export default function ProductCard({ image, title, price, rating, description }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-white/70 p-6 shadow-[0_0_15px_rgba(0,0,0,0.10)]">
      <img src={image} alt="" className="h-28 w-full object-cover" />
      <h3 className="text-lg font-semibold text-[#272727]">{title}</h3>
      <p className="text-sm text-[#848484]">{price}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#848484]">{rating}</span>
        <span className="text-xs text-[#848484]">{description}</span>
      </div>
    </div>
  );
}
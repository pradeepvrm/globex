import ProductCard from "./ProductCard";
import products from "../data/products.json";

export default function TrendingNow() {
  return (
    <section className="w-full overflow-hidden bg-white pt-10 ">
      <div className="mb-6 px-[clamp(20px,2.6vw,50px)]">
        <h2 className="text-[clamp(22px,1.875vw,36px)] font-bold leading-normal text-[#272727]">
          Trending Now
        </h2>
      </div>

      <ul className="no-scrollbar flex gap-[clamp(16px,2.08vw,40px)] overflow-x-auto px-[clamp(20px,2.6vw,50px)] pb-2">
        {products.slice(0, 12).map((product) => (
          <li key={product.id} className="w-[clamp(250px,21.35vw,410px)] shrink-0">
            <ProductCard {...product} size="trending" />
          </li>
        ))}
      </ul>
    </section>
  );
}

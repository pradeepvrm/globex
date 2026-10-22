import { Link } from "react-router-dom";
import womensPants from "../assets/home/category-womens-pants.png";
import mensJacket from "../assets/home/category-mens-jacket.png";
import sweater from "../assets/home/category-sweater.png";
import womensTops from "../assets/home/category-womens-tops.png";
import pants from "../assets/home/category-pants.png";
import womensJackets from "../assets/home/category-womens-jackets.png";

const categories = [
  { title: "Womens Pants", image: womensPants, className: "row-span-2 col-span-2 md:col-span-4" },
  { title: "Mens Jacket", image: mensJacket, className: "col-span-2 md:col-span-4" },
  { title: "Sweater", image: sweater, className: "col-span-2 md:col-span-4" },
  { title: "Womens Tops", image: womensTops, className: "col-span-2 md:col-span-4" },
  { title: "Pants", image: pants, className: "col-span-1 md:col-span-2" },
  { title: "Womens Jackets", image: womensJackets, className: "col-span-1 md:col-span-2" },
];

export default function ShopByCategories() {
  return (
    <section className="w-full bg-white pt-10">
      <h2 className="mb-6 px-[clamp(20px,2.6vw,50px)] text-[clamp(22px,1.875vw,36px)] font-bold leading-normal text-[#272727]">
        Shop by Categories
      </h2>
      <div className="mx-auto grid max-w-[1920px] grid-cols-2 auto-rows-[clamp(170px,17.22vw,330px)] gap-[clamp(8px,0.73vw,14px)] px-[clamp(20px,2.6vw,50px)] md:grid-cols-12">
        {categories.map((category) => (
          <Link
            key={category.title}
            to="/products"
            className={`group relative overflow-hidden rounded-[10px] bg-[#272727] ${category.className}`}
          >
            <img
              src={category.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute left-[clamp(12px,1.56vw,30px)] top-[clamp(12px,1.56vw,30px)] text-white">
              <h3 className="text-[clamp(13px,1.25vw,24px)] font-bold">{category.title}</h3>
              <span className="text-[clamp(11px,0.94vw,18px)]">Explore <span aria-hidden="true">→</span></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

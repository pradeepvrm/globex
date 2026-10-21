import { Link } from "react-router";
import background from "../assets/home/brand-banner.png";
import forever21Logo from "../assets/home/brand-forever21.svg";

export default function BrandBanner() {
  return (
    <section className="relative flex h-[clamp(360px,46.46vw,892px)] w-full items-center justify-center overflow-hidden bg-[#272727] text-center text-white mt-16">
      <img src={background} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" loading="lazy" />
      <div className="relative z-10 flex flex-col items-center gap-[clamp(18px,2.5vw,48px)] px-5">
        <img src={forever21Logo} alt="Forever 21" className="max-h-[clamp(55px,7vw,135px)] max-w-[70vw]" />
        <h2 className="text-[clamp(22px,2.5vw,48px)] font-bold">
          Big Fashion Festival
        </h2>
        <p className="text-[clamp(24px,2.5vw,48px)] font-bold">
          70% - 80% off
        </p>
        <Link
          to="/products"
          className="rounded-[10px] border-2 border-white px-7 py-2 text-base text-white transition-colors hover:bg-white hover:text-[#272727] sm:text-xl"
        >
          Explore
        </Link>
      </div>
    </section>
  );
}

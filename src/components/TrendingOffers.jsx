import { Link } from "react-router";
import levisLogo from "../assets/home/levis.svg";
import forever21Logo from "../assets/home/forever21.svg";
import mainImage from "../assets/home/offer-main.png";
import sideImage from "../assets/home/offer-side.png";

function SideOffer({ image, className, logo }) {
  return (
    <Link
      to="/products"
      aria-label="Explore Forever 21 offers"
      className={`absolute top-[12.45%] hidden h-[75.13%] overflow-hidden rounded-[10px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.1)] xl:block ${className}`}
    >
      <img src={image} alt="" className="absolute right-0 h-full w-[47.29%] object-cover" />
      <div className="absolute inset-y-0 left-0 flex w-[52.71%] flex-col items-center justify-center gap-5 px-4 text-center">
        <img src={logo} alt="" className="max-h-12 max-w-[78%]" />
        <p className="font-libre text-[clamp(24px,2.5vw,48px)] font-bold text-[#272727]">
          Min 50% off
        </p>
        <span className="rounded-md border border-[#272727] px-5 py-1 font-libre text-sm">
          Explore
        </span>
      </div>
    </Link>
  );
}

export default function TrendingOffers() {
  return (
    <section className="w-full overflow-hidden bg-white py-10 sm:py-12">
      <h2 className="mb-6 px-[clamp(20px,2.6vw,50px)] font-libre text-[clamp(22px,1.875vw,36px)] font-bold leading-normal text-[#272727]">
        Trending Offers
      </h2>

      <div className="relative mx-auto h-[clamp(320px,30.57vw,587px)] w-full max-w-[1920px] overflow-hidden">
        <SideOffer
          image={sideImage}
          logo={forever21Logo}
          className="left-[calc(50%-min(59.7vw,1146px)/2-min(40.6vw,779px)-3.7vw)] w-[min(40.6vw,779px)]"
        />
        <SideOffer
          image={sideImage}
          logo={forever21Logo}
          className="left-[calc(50%+min(59.7vw,1146px)/2+3.7vw)] w-[min(40.6vw,779px)]"
        />

        <article className="absolute left-1/2 top-0 flex h-full w-[clamp(320px,59.7vw,1146px)] -translate-x-1/2 overflow-hidden rounded-[10px] shadow-[0_0_12px_rgba(0,0,0,0.1)]">
          <div className="flex w-[52.71%] shrink-0 flex-col items-center justify-center gap-[clamp(16px,2vw,38px)] bg-white px-4 text-center sm:px-8">
            <img src={levisLogo} alt="Levi's" className="max-h-[clamp(36px,4vw,77px)] max-w-[60%]" />
            <h3 className="font-libre text-[clamp(24px,2.5vw,48px)] font-bold leading-tight text-[#272727]">
              Min 60% off
            </h3>
            <Link
              to="/products"
              className="rounded-lg border border-[#222] px-5 py-1.5 font-libre text-sm text-[#272727] transition-colors hover:bg-[#222] hover:text-white sm:px-7 sm:text-base"
            >
              Explore
            </Link>
          </div>
          <div className="relative min-w-0 flex-1 overflow-hidden bg-[#c4c4c4]">
            <img src={mainImage} alt="Model in a summer dress against a blue door" className="h-full w-full object-cover" />
          </div>
        </article>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import levisLogo from "../assets/home/levis.svg";
import denimImage from "../assets/home/deal-denim.png";
import portraitImage from "../assets/home/deal-portrait.png";
import fashionImage from "../assets/home/deal-fashion.png";

const deals = [
  { image: denimImage, alt: "Model in a denim jacket" },
  { image: portraitImage, alt: "Portrait of a woman" },
  { image: fashionImage, alt: "Model wearing a formal outfit" },
  { image: denimImage, alt: "Model in a denim jacket" },
];

export default function DealsOfTheDay() {
  return (
    <section className="w-full overflow-hidden bg-white pt-10">
      <h2 className="mb-6 px-[clamp(20px,2.6vw,50px)] text-[clamp(22px,1.875vw,36px)] font-bold leading-normal text-[#272727]">
        Deals of the Day
      </h2>
      <ul className="flex gap-[clamp(24px,3.65vw,70px)] overflow-x-auto px-[clamp(20px,2.6vw,50px)] pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {deals.map((deal, index) => (
          <li key={`${deal.image}-${index}`} className="w-[clamp(280px,25.47vw,489px)] shrink-0">
            <Link
              to="/products"
              className="block overflow-hidden rounded-[10px] bg-white shadow-[0_0_30px_rgba(165,165,165,0.07)]"
            >
              <img
                src={deal.image}
                alt={deal.alt}
                className="block aspect-489/298 w-full object-cover"
                loading="lazy"
              />
              <div className="flex min-h-[clamp(180px,14.12vw,271px)] flex-col items-center px-4 py-6 text-center text-[#272727] sm:py-8">
                <div className="flex h-[clamp(38px,3.4vw,65px)] items-center justify-center">
                  <img src={levisLogo} alt="Levi's" className="max-h-full max-w-full" />
                </div>
                <h3 className="mt-4 text-[clamp(21px,1.875vw,36px)] font-bold leading-tight">
                  Best of Styles
                </h3>
                <p className="mt-2 text-[clamp(15px,1.25vw,24px)] font-bold">
                  Under Rs.799
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

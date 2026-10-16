import localIcon from "../assets/home/benefit-local.svg";
import deliveryIcon from "../assets/home/benefit-delivery.svg";
import returnIcon from "../assets/home/benefit-return.svg";
import supportIcon from "../assets/home/benefit-support.svg";
import offersIcon from "../assets/home/benefit-offers.svg";

const benefits = [
  { title: "Locally Owned", description: "We have local business and sell best quality clothes", icon: localIcon },
  { title: "Fast Delivery", description: "We provide fast delivery to our customers", icon: deliveryIcon },
  { title: "Easy Return", description: "We provide easy return policy.", icon: returnIcon },
  { title: "Online Support", description: "We give 24/7 online support", icon: supportIcon },
  { title: "Best Offers", description: "We give best offers to our customers", icon: offersIcon },
];

export default function ServiceBenefits() {
  return (
    <section className="w-full bg-white py-8 sm:py-12">
      <ul className="mx-auto grid max-w-[1920px] grid-cols-1 gap-4 px-[clamp(20px,2.6vw,50px)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {benefits.map((benefit) => (
          <li key={benefit.title} className="flex min-h-[clamp(170px,10.52vw,202px)] flex-col items-center rounded-[10px] bg-[#f0f0f0] px-4 py-5 text-center font-libre text-[#272727]">
            <div className="flex h-14 w-14 items-center justify-center">
              <img src={benefit.icon} alt="" className="max-h-full max-w-full" loading="lazy" />
            </div>
            <h2 className="mt-2 text-base font-bold sm:text-lg xl:text-xl">{benefit.title}</h2>
            <p className="mt-2 text-xs leading-snug sm:text-sm">{benefit.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

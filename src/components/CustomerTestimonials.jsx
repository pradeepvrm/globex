import { useRef } from "react";
import avatar from "../assets/home/review-avatar.png";
import filledStar from "../assets/home/review-star.svg";
import emptyStar from "../assets/home/review-star-empty.svg";
import previousIcon from "../assets/home/offer-prev.svg";
import nextIcon from "../assets/home/offer-next.svg";

const reviews = [1, 2, 3];

function ReviewCard() {
  return (
    <article className="flex h-[clamp(360px,24.8vw,476px)] w-[clamp(320px,49.27vw,946px)] shrink-0 snap-center flex-col items-center rounded-[10px] bg-white px-[clamp(20px,3.4vw,64px)] py-[clamp(28px,3vw,58px)] text-center shadow-[0_0_10px_rgba(0,0,0,0.1)]">
      <img src={avatar} alt="Customer portrait" className="h-[clamp(90px,7.8vw,150px)] w-[clamp(90px,7.8vw,150px)] rounded-full object-cover" loading="lazy" />
      <div className="mt-5 flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((star) => (
          <img key={star} src={star === 4 ? emptyStar : filledStar} alt="" className="h-[clamp(14px,1.25vw,24px)] w-[clamp(14px,1.25vw,24px)]" />
        ))}
        <span className="ml-2 text-xs text-[#272727]">4.4</span>
      </div>
      <p className="mt-5 text-[clamp(13px,1.25vw,24px)] leading-snug text-[#272727]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dui vel morbi cursus sed sodales molestie proin dictum gravida. Porttitor maecenas tincidunt ipsum semper malesuada. In sapien feugiat laoreet convallis eu sed. Sapien et montes, duis tempor euismod augue cras eu eget. Risus suspendisse mauris ullamcorper.
      </p>
    </article>
  );
}

export default function CustomerTestimonials() {
  const trackRef = useRef(null);

  function scroll(direction) {
    trackRef.current?.scrollBy({
      left: direction * trackRef.current.clientWidth * 0.65,
      behavior: "smooth",
    });
  }

  return (
    <section className="w-full overflow-hidden bg-white py-10 sm:py-12">
      <h2 className="mb-6 px-[clamp(20px,2.6vw,50px)] text-[clamp(22px,1.875vw,36px)] font-bold leading-normal text-[#272727]">
        What Our Customer Says
      </h2>
      <div className="relative">
        <div
          ref={trackRef}
          className="ml-[calc(50%-min(49.27vw,946px)*1.5-clamp(24px,3.23vw,62px))] flex snap-x snap-mandatory gap-[clamp(24px,3.23vw,62px)] overflow-x-auto py-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((review) => <ReviewCard key={review} />)}
        </div>
        <button
          type="button"
          aria-label="Previous customer review"
          onClick={() => scroll(-1)}
          className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 p-3 text-white"
        >
          <img src={previousIcon} alt="" className="max-h-full max-w-full" />
        </button>
        <button
          type="button"
          aria-label="Next customer review"
          onClick={() => scroll(1)}
          className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 p-3 text-white"
        >
          <img src={nextIcon} alt="" className="max-h-full max-w-full" />
        </button>
      </div>
    </section>
  );
}

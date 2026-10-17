import heroLeft from "../assets/heroLeft.png";
import heroRight from "../assets/heroRight.png";

export default function HeroSection({
  onExplore,
}) {
  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="grid min-h-100 w-full grid-cols-1 md:min-h-100 md:grid-cols-2 lg:h-160 lg:min-h-0">

        {/* Left side: main fashion image */}
        <div className="relative min-h-95 overflow-hidden bg-[#c4c4c4] md:min-h-0">
          <img
            src={heroLeft}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>

        <div className="relative flex min-h-100 items-center justify-center overflow-hidden bg-[#f5f3f0] px-5 py-16 md:min-h-0 md:px-8 lg:px-10">

          <img
            src={heroRight}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-50"
          />

          {/* Text and CTA */}
          <div className="relative z-10 flex w-full flex-col items-center text-center">
            <h1 className="text-4xl font-bold leading-snug text-slate-900 sm:text-5xl lg:text-8xl mb-4">PRADA</h1>
            <h3 className="text-3xl font-bold leading-snug text-[#565656] sm:text-4xl lg:text-4xl">
              Big Fashion Festival
            </h3>

            <p className="mt-5 text-3xl font-bold leading-snug text-[#565656] sm:text-4xl lg:text-4xl">
              50% - 80% off
            </p>

            <button
              type="button"
              onClick={onExplore}
              className="mt-10 rounded-[10px] border-2 border-[#222222] px-8 py-2 text-xl text-[#272727] transition-colors hover:bg-[#222222] hover:text-white focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#222222] sm:text-2xl"
            >
              Explore
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}

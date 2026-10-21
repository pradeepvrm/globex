import aboutus from "../assets/aboutus.png";

export default function AboutUs() {
  return (
    <section className="w-full bg-white px-5 text-[#272727] sm:px-8 md:px-12 lg:px-12.5">
      <div className="mx-auto max-w-360">

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12 pb-12">
          {/* About text */}
          <div className="flex flex-col items-start">
            <h3 className="text-xl font-bold leading-snug sm:text-3xl">
              About Us
            </h3>

            <p className="mt-2 text-sm leading-8 sm:text-lg lg:text-md">
              Discover a world of timeless style and refined elegance.
              We believe fashion should express individuality while
              celebrating quality, craftsmanship, and thoughtful design.
              Our collection brings together carefully selected pieces
              for those who appreciate understated luxury and enduring
              style.
              We are committed to providing a considered shopping
              experience, from discovering your next favourite piece
              to receiving it at your doorstep. Explore our collection
              and find styles that feel uniquely yours.
            </p>

            {/* Contact information */}
            <div className="mt-4 w-full">
              <h4 className=" text-sm font-bold sm:text-2xl">
                Contact Information
              </h4>

              <div className="mt-2 text-xs sm:text-lg">
                <a
                  href="tel:+911256378409"
                  className="block w-fit transition-opacity hover:opacity-60"
                >
                  +91 1256378409
                </a>

                <a
                  href="mailto:something@random.com"
                  className="block w-fit break-all transition-opacity hover:opacity-60"
                >
                  something@random.com
                </a>
              </div>    

              <a
                href="#"
                className="mt-2 inline-flex min-h-6 min-w-36 items-center justify-center rounded-lg border-2 border-[#272727] px-6 py-2 text-md transition-colors hover:bg-[#272727] hover:text-white focus-visible:outline focus-visible:outline-offset-4"
              >
                Directions
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="w-full overflow-hidden rounded-[10px] lg:mt-1">
            <img
              src={aboutus}
              className="block aspect-907/655 w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

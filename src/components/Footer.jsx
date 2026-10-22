import facebook from "../assets/facebook.png";
import instagram from "../assets/instagram.png";
import logoFooter from "../assets/logo-footer.png";
import twitter from "../assets/twitter.png";
import whatsapp from "../assets/whatsapp.png";
import { Link } from "react-router-dom";

const footerSections = [
  { title: "Women", links: ["All Women", "Skirts", "T-Shirts", "Tops", "Jackets"] },
  { title: "Kids", links: ["All Kids", "Shirts", "T-Shirts", "Shorts", "Jackets"] },
  { title: "Men", links: ["All Men", "Shirts", "T-Shirts", "Shorts", "Jackets"] },
  { title: "Shopping", links: ["Your cart", "Your orders", "Compared items", "Wishlist", "Shipping Details"] },
  { title: "More links", links: ["Blogs", "Gift center", "Buying guides", "New arrivals", "Clearance", "Contact us"] },
];

const socialIcons = {
  Facebook: facebook,
  Instagram: instagram,
  WhatsApp: whatsapp,
  Twitter: twitter,
};

export default function Footer({
  logo = "Globex",
  onSubscribe,
  socialLinks = [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "WhatsApp", href: "#" },
    { label: "Twitter", href: "#" },
  ],
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    onSubscribe?.(email);
  };

  return (
    <footer className="w-full bg-[#00071b] text-white">
      <div className="mx-12 max-w-[1920px] px-6 pb-8 pt-8 sm:px-8 lg:px-[5%] lg:pb-10 lg:pt-9">
        <div className="mb-8 flex items-center gap-3 sm:mb-10">
          <div className="flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12">
            <img src={logoFooter} alt="" className="h-full w-full object-contain" />
          </div>
          <a href="/" className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {logo}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 ">
          {footerSections.map((section) => (
            <nav key={section.title}>
              <h2 className="mb-4 text-base font-bold sm:text-lg">{section.title}</h2>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    {link === "Contact us" ? (
                      <Link to="/contact" className="text-2xs text-white/90 transition-colors hover:text-white hover:underline sm:text-sm">{link}</Link>
                    ) : (
                      <a href="#" className="text-2xs text-white/90 transition-colors hover:text-white hover:underline sm:text-sm">{link}</a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <section className="col-span-2 sm:col-span-3 lg:col-span-1">
            <h2 className="mb-4 text-base font-bold sm:text-lg">Stay In Touch</h2>
            <p className="mb-4 max-w-md text-xs leading-5 text-white/90 sm:text-sm">
              Stay in touch to get special offers, free giveaways and once in a lifetime deals.
            </p>
            <form onSubmit={handleSubmit} className="flex w-full max-w-xl">
              <label htmlFor="footer-email" className="sr-only">Enter your email</label>
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-l-sm border border-r-0 border-white px-2">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0">
                  <path d="M3 6.75h18v10.5H3z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="m3.75 7.5 8.25 6 8.25-6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <input id="footer-email" name="email" type="email" required placeholder="Enter your email"
                  className="min-w-0 flex-1 bg-transparent py-2 text-xs text-white outline-none placeholder:text-[#ababab] sm:text-sm" />
              </div>
              <button type="submit" className="rounded-r-sm border border-white px-3 text-xs transition-colors hover:bg-white hover:text-[#00071b] sm:text-sm">
                Join
              </button>
            </form>
          </section>
        </div>
      </div>

      <div className="border-t border-white/70">
        <div className="mx-12 justify-center gap-x-40 flex max-w-[1920px] flex-col items-center gap-5 px-6 py-5 sm:px-8 lg:flex-row  lg:px-[5%]">
          <div className="flex flex-wrap justify-center gap-x-40 gap-y-3 text-xs sm:text-sm">
            <a href="#" className="transition-opacity hover:opacity-70">Terms & Conditions</a>
            <a href="#" className="transition-opacity hover:opacity-70">Privacy Policy</a>
          </div>
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} className="rounded-sm transition-opacity hover:opacity-70">
                {socialIcons[social.label] && (
                  <img src={socialIcons[social.label]} alt="" className="h-6 w-6 object-contain" />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

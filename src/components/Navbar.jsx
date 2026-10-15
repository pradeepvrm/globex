import { useState } from "react";

export default function Navbar({
  userName = "Anne Doe",
  cartCount = 0,
  onSearch = () => {},
  onAccountClick = () => {},
  onWishlistClick = () => {},
  onCartClick = () => {},
}) {
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = ["Men", "Women", "Kids", "Shop", "Contact us"];

  function submitSearch(event) {
    event.preventDefault();
    onSearch(search.trim());
  }

  return (
    <header className="relative z-40 w-full bg-white shadow-[0_0_15px_rgba(0,0,0,0.10)]">
      <nav
        className="mx-auto flex min-h-20 w-full max-w-[1920px] items-center gap-5 px-4 sm:px-6 lg:gap-8 lg:px-10 2xl:px-12"
      >
        {/* logo */}
        <a href="/" className="flex shrink-0 items-center">
          <img src="./assets/logo.png" alt="" className="h-8 w-auto max-w-28 object-contain sm:h-9" />
        </a>

        {/* Desktop links */}
        <div className="hidden shrink-0 items-center gap-5 whitespace-nowrap font-serif text-[15px] text-[#272727] md:flex lg:gap-6 lg:text-[16px] xl:gap-8">
          {links.map((label) => (
            <a
              key={label}
              href={label === "Contact us" ? "/contact" : `/collections/${label.toLowerCase().replaceAll(" ", "-")}`}
              className="transition-colors hover:text-[#848484]"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={submitSearch} role="search" className="ml-auto hidden min-w-32 max-w-107.5 flex-1 md:flex">
          <label htmlFor="navbar-search" className="sr-only">Search products</label>
          <div className="flex h-11 w-full items-center rounded-lg bg-[#f0f0f0] px-4 transition-shadow focus-within:ring-2 focus-within:ring-black/20">
            <input
              id="navbar-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search here"
              className="min-w-0 flex-1 bg-transparent font-serif text-sm text-[#272727] outline-none placeholder:text-[#848484] lg:text-base"
            />
            <button type="submit" aria-label="Submit search" className="ml-3 shrink-0 text-[#272727]">
              <img src="/assets/search.svg" alt="" className="h-4.5 w-4.5" />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-4 sm:gap-5 md:ml-0 lg:gap-6">
          <button
            type="button"
            onClick={onAccountClick}
            className="hidden font-serif text-[15px] text-[#646464] transition-colors hover:text-black lg:inline-flex"
          >
            {userName}
          </button>
          <button
            type="button"
            onClick={onWishlistClick}
            className="hidden h-7 w-7 items-center justify-center sm:flex"
          >
            <img src="/assets/heart.svg" alt="" className="h-5.5 w-5.5" />
          </button>
          <button
            type="button"
            onClick={onCartClick}
            className="relative flex h-8 w-8 items-center justify-center"
          >
            <img src="/assets/cart.svg" alt="" className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.25 md:hidden"
          >
            <span className={`h-px w-5 bg-[#272727] transition-transform ${mobileMenuOpen ? "translate-y-0.75 rotate-45" : ""}`} />
            <span className={`h-px w-5 bg-[#272727] transition-opacity ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`h-px w-5 bg-[#272727] transition-transform ${mobileMenuOpen ? "-translate-y-2.25 -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-black/10 bg-white px-5 pb-5 pt-4 md:hidden">
          <form onSubmit={submitSearch} role="search" className="mb-5 flex">
            <label htmlFor="navbar-search-mobile" className="sr-only">Search products</label>
            <div className="flex h-11 w-full items-center rounded-lg bg-[#f0f0f0] px-4">
              <input
                id="navbar-search-mobile"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search here"
                className="min-w-0 flex-1 bg-transparent font-serif text-sm outline-none placeholder:text-[#848484]"
              />
              <button type="submit" aria-label="Submit search">
                <img src="/assets/search.svg" alt="" className="h-4.5 w-4.5" />
              </button>
            </div>
          </form>
          <div className="flex flex-col font-serif text-base text-[#272727]">
            {links.map((label) => (
              <a
                key={label}
                href={label === "Contact us" ? "/contact" : `/collections/${label.toLowerCase().replaceAll(" ", "-")}`}
                className="border-b border-black/10 py-3 last:border-b-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <button type="button" onClick={onAccountClick} className="border-b border-black/10 py-3 text-left text-[#646464]">
              {userName}
            </button>
            <button type="button" onClick={onWishlistClick} className="py-3 text-left">
              Wishlist
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

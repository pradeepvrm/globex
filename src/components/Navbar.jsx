import { useState } from "react";
import logo from "../assets/logo.png";
import searchIcon from "../assets/searchIcon.png";
import heart from "../assets/heart.png";
import cart from "../assets/cart.png";

export default function Navbar({
  userName = "Anne Doe",
  cartCount = 0,
  onSearch = () => {},
}) {
  const [search, setSearch] = useState("");

  const links = ["Men", "Women", "Kids", "Shop", "Contact us"];

  function submitSearch(event) {
    event.preventDefault();
    onSearch(search.trim());
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <nav
        className="mx-auto flex min-h-14 w-full max-w-[1920px] items-center gap-5 px-4 sm:px-6 lg:gap-8 lg:px-10 2xl:px-12"
      >
        {/* logo */}
        <a href="/" className="flex shrink-0 items-center">
          <img src={logo} className="h-8 w-auto max-w-28 object-contain sm:h-9" />
        </a>

        {/* Nav links */}
        <div className="hidden shrink-0 items-center gap-5 whitespace-nowrap text-[15px] text-[#272727] md:flex lg:gap-6 lg:text-[16px] xl:gap-8 m-auto">
          {links.map((label) => (
            <a
              key={label}
              href={label.toLowerCase().includes("shop") ? "/products" : "#"}
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
              className="min-w-0 flex-1 bg-transparent text-sm text-[#272727] outline-none placeholder:text-[#848484] lg:text-base"
            />
            <button type="submit" className="ml-3 shrink-0 text-[#272727]">
              <img src={searchIcon} alt="" className="h-4.5 w-4.5" />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-4 sm:gap-5 md:ml-0 lg:gap-6">
          <button
            type="button"
            className="hidden h-7 w-7 items-center justify-center sm:flex"
          >
            <img src={heart} alt="" className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="relative flex h-8 w-8 items-center justify-center"
          >
            <img src={cart} alt="" className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
          
          <button
            type="button"
            className="hidden text-[15px] text-[#646464] transition-colors hover:text-black lg:inline-flex"
          >
            {userName}
          </button>
        </div>
      </nav>
    </header>
  );
}

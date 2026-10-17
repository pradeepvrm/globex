import { Link, useNavigate } from "react-router";
import logo from "../assets/logo.png";
import heart from "../assets/heart.png";
import cart from "../assets/cart.png";
import useLocalStorage from "../data/useLocalStorage";
import SearchAutocomplete from "./SearchAutocomplete";

export default function Navbar({ userName = "Anne Doe" }) {
  const navigate = useNavigate();
  const [cartItems] = useLocalStorage("cartItems", []);
  const displayedCartCount = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + (Number.isInteger(item?.quantity) ? item.quantity : 0), 0)
    : 0;

  const links = ["Men", "Women", "Kids", "Shop", "Contact us"];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
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

        <SearchAutocomplete
          onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)}
        />

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-4 sm:gap-5 md:ml-0 lg:gap-6">
          <Link to="/wishlist">
            <button
              type="button"
              className="hidden h-7 w-7 items-center justify-center sm:flex"
            >
              <img src={heart} alt="" className="h-5 w-5" />
            </button>
          </Link>
          <Link to="/cart">
            <button
              type="button"
              className="relative flex h-8 w-8 items-center justify-center"
            >
              <img src={cart} alt="" className="h-5 w-5" />
              {displayedCartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                  {displayedCartCount}
                </span>
              )}
            </button>
          </Link>
          
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

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import logo from "../assets/logo.png";
import heart from "../assets/heart.png";
import cart from "../assets/cart.png";
import login from "../assets/login.png"
import useLocalStorage from "../data/useLocalStorage";
import SearchAutocomplete from "./SearchAutocomplete";

export default function Navbar() {
  const { isSignedIn, user, logout } = useAuth();
  const userId = user?.id ?? "guest";

  return (
    <NavbarContent
      key={userId}
      isSignedIn={isSignedIn}
      username={user?.username}
      onSignOut={logout}
      cartStorageKey={`cartItems:${userId}`}
    />
  );
}

function NavbarContent({ isSignedIn, username, onSignOut, cartStorageKey }) {
  const navigate = useNavigate();
  const [cartItems] = useLocalStorage(cartStorageKey, []);
  const displayedCartCount = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + (Number.isInteger(item?.quantity) ? item.quantity : 0), 0)
    : 0;

  const categoryLinks = ["Men", "Women", "Kids"];

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
          {categoryLinks.map((label) => (
            <Link
              key={label}
              to={`/products?category=${label.toLowerCase()}`}
              className="transition-colors hover:text-[#848484]"
            >
              {label}
            </Link>
          ))}
          <Link to="/products" className="transition-colors hover:text-[#848484]">Shop</Link>
          <Link to="/contact" className="transition-colors hover:text-[#848484]">Contact us</Link>
          <Link to="/orders" className="transition-colors hover:text-[#848484]">My Orders</Link>
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
          
          {isSignedIn ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="max-w-28 truncate text-[#646464]">{username}</span>
              <button type="button" onClick={onSignOut} className="text-[#646464] transition-colors hover:text-black">
                <img className="max-w-5 cursor-pointer" src={login} />
              </button>
            </div>
          ) : (
            <Link
              to="/sign-in"
              className="text-[15px] text-[#646464] transition-colors hover:text-black"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

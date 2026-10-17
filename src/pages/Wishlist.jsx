import { Link } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import products from "../data/products.json";
import useLocalStorage from "../data/useLocalStorage";

export default function Wishlist() {
  const [savedWishlistIds, setWishlistIds, storageError] = useLocalStorage("wishlistItems", []);
  const wishlistIds = Array.isArray(savedWishlistIds)
    ? savedWishlistIds.filter((id) => Number.isInteger(id))
    : [];
  const wishlistProducts = products.filter((product) => wishlistIds.includes(product.id));

  function removeFromWishlist(productId) {
    setWishlistIds((currentIds) => currentIds.filter((id) => id !== productId));
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[55vh] bg-[#f9faff]">
        <section className="mx-auto w-full max-w-[1822px] px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-blue-950 sm:text-3xl">My Wishlist</h1>
              <p className="mt-2 text-sm text-[#646464]">{wishlistProducts.length} saved {wishlistProducts.length === 1 ? "item" : "items"}</p>
            </div>
            <Link to="/products" className="text-xs font-bold text-blue-950 underline underline-offset-4 hover:text-[#646464]">
              Continue shopping
            </Link>
          </div>

          {storageError && <p role="alert" className="mb-5 text-sm text-[#b42318]">{storageError}</p>}

          {wishlistProducts.length ? (
            <ul className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {wishlistProducts.map((product) => (
                <li key={product.id} className="w-full max-w-85">
                  <ProductCard {...product} />
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    className="mt-3 w-full rounded-md border border-[#dedede] bg-white px-4 py-2 text-sm text-[#646464] transition-colors hover:border-[#b42318] hover:text-[#b42318]"
                  >
                    Remove from wishlist
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <section className="rounded-xl border border-[#e8e8e8] bg-white px-5 py-12 text-center shadow-[0_0_20px_rgba(0,0,0,0.04)]">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#f0f0f0] text-xl text-[#646464]" aria-hidden="true">♡</div>
              <h2 className="mt-4 text-lg font-bold text-[#00071b]">Your wishlist is empty</h2>
              <p className="mt-2 text-xs text-[#646464]">Save products you love and find them here later.</p>
              <Link to="/products" className="mt-5 inline-flex rounded-md bg-[#00071b] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#17213a]">
                Explore products
              </Link>
            </section>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
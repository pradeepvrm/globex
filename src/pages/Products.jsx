import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import products from "../data/products.json";

export default function Products() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9faff]">
        <section className="mx-auto w-full max-w-360 px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pt-10">
          <div className="mb-6 flex items-center justify-end gap-6 font-libre text-[14px] text-[#272727] sm:text-[16px]">
            <button type="button" className="flex items-center gap-2">
              <span>Filters</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h16M7 12h10m-7 6h4" strokeLinecap="round" />
              </svg>
            </button>
            <button type="button" className="flex items-center gap-2">
              <span>Sort By</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";


export default function Products() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.trim().toLowerCase() ?? "";
  const category = searchParams.get("category")?.trim().toLowerCase() ?? "";
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL}/api/products`;
    async function fetchProducts() {
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return <ProductListing key={`${category}-${products.length}`} category={category} searchQuery={searchQuery} products={products} />;
}

function ProductListing({ category, searchQuery, products }) {
  const categoryProducts = useMemo(
    () => category ? products.filter((product) => product.category === category) : products,
    [category, products],
  );
  const priceBounds = useMemo(() => {
    const prices = categoryProducts.map((product) => product.price);
    return {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    };
  }, [categoryProducts]);
  const brands = useMemo(
    () => [...new Set(categoryProducts.map((product) => product.brand))],
    [categoryProducts],
  );
  const [priceRange, setPriceRange] = useState(priceBounds);
  const [selectedBrands, setSelectedBrands] = useState(brands);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    const filtered = categoryProducts.filter((product) => {
      const discount = product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

      return product.price >= priceRange.min
        && product.price <= priceRange.max
        && selectedBrands.includes(product.brand)
        && (!searchQuery || `${product.name} ${product.brand}`.toLowerCase().includes(searchQuery))
        && (selectedDiscounts.length === 0 || selectedDiscounts.some((threshold) => discount >= threshold));
    });

    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      case "rating":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "discount":
        return filtered.sort((a, b) => {
          const discountA = (a.originalPrice - a.price) / a.originalPrice;
          const discountB = (b.originalPrice - b.price) / b.originalPrice;
          return discountB - discountA;
        });
      default:
        return filtered;
    }
  }, [categoryProducts, priceRange, searchQuery, selectedBrands, selectedDiscounts, sortBy]);

  function clearFilters() {
    setPriceRange(priceBounds);
    setSelectedBrands(brands);
    setSelectedDiscounts([]);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9faff]">
        <section className="mx-auto w-full max-w-360 px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pt-10">
          <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8 2xl:grid-cols-[407px_minmax(0,1fr)]">
            <ProductFilters
              brands={brands}
              priceBounds={priceBounds}
              priceRange={priceRange}
              selectedBrands={selectedBrands}
              selectedDiscounts={selectedDiscounts}
              sortBy={sortBy}
              filtersOpen={filtersOpen}
              onPriceRangeChange={setPriceRange}
              onBrandsChange={setSelectedBrands}
              onDiscountsChange={setSelectedDiscounts}
              onSortChange={setSortBy}
              onClear={clearFilters}
              onToggleFilters={() => setFiltersOpen((open) => !open)}
            />

            <div className="min-w-0">
              {category && (
                <h1 className="mb-5 text-2xl font-bold text-[#272727] capitalize">{category}</h1>
              )}
              <div className="mb-4 hidden items-center justify-between text-sm text-[#646464] lg:flex">
                <p aria-live="polite">{visibleProducts.length} products</p>
                <label className="flex items-center gap-2">
                  Sort by
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="rounded-md border border-[#dedede] bg-white px-3 py-2 text-[#272727] outline-none focus-visible:ring-2 focus-visible:ring-[#00071b]"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </label>
              </div>

              <div className="mb-4 text-sm text-[#646464] lg:hidden">
                <p aria-live="polite">{visibleProducts.length} products</p>
              </div>

              {visibleProducts.length ? (
                <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleProducts.map((product) => (
                    <Link key={product.id} to={`/products/${product.id}`} className="w-full max-w-85">
                      <ProductCard {...product} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-white px-6 py-16 text-center text-[#646464] shadow-[0_0_20px_rgba(0,0,0,0.05)]">
                  <p className="text-lg font-bold text-[#272727]">No products found</p>
                  <p className="mt-2">
                    {searchQuery ? "Try another search or adjust your filters." : "Try adjusting your filters."}
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-md bg-[#00071b] px-4 py-2 text-white transition-colors hover:bg-[#17213a] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#00071b]"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

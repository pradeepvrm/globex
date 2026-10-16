import { useState } from "react";

const sortOptions = [
  ["popularity", "Popularity"],
  ["price-low", "Price: Low to High"],
  ["price-high", "Price: High to Low"],
  ["newest", "Newest"],
];

const discountOptions = [20, 30, 40, 50, 60];
const colorOptions = [
  ["Black", "#252525"],
  ["Blue", "#4169a1"],
  ["Navy", "#1f315b"],
  ["Green", "#5c7c50"],
  ["Red", "#b64242"],
  ["Pink", "#e5a9b5"],
  ["Purple", "#75518d"],
];

function SortSelect({ sortBy, onSortChange }) {
  return (
    <label className="flex items-center gap-2 font-libre text-xs text-[#272727]">
      <span>Sort by</span>
      <select
        value={sortBy}
        onChange={(event) => onSortChange(event.target.value)}
        className="min-w-0 rounded-md border border-[#dedede] bg-white px-2 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#00071b]"
      >
        {sortOptions.map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </label>
  );
}

function AccordionFilter({ title, open, onToggle, children }) {
  return (
    <section className="border-t border-[#d2d2d2]">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex min-h-8.5 w-full items-center justify-between py-2 text-left font-libre text-sm text-[#272727] focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-[#00398f]"
      >
        <span>{title}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="m3.5 6 4.5 4 4.5-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </section>
  );
}

export default function ProductFilters({
  brands,
  priceBounds,
  priceRange,
  selectedBrands,
  selectedDiscounts,
  sortBy,
  filtersOpen,
  onPriceRangeChange,
  onBrandsChange,
  onDiscountsChange,
  onSortChange,
  onClear,
  onToggleFilters,
}) {
  const [openFilters, setOpenFilters] = useState({
    brand: false,
    color: false,
    discount: false,
  });
  const [selectedColors, setSelectedColors] = useState([]);

  function toggleBrand(brand) {
    onBrandsChange((current) => (
      current.includes(brand)
        ? current.filter((item) => item !== brand)
        : [...current, brand]
    ));
  }

  function toggleFilter(name) {
    setOpenFilters((current) => ({ ...current, [name]: !current[name] }));
  }

  function toggleColor(color) {
    setSelectedColors((current) => (
      current.includes(color)
        ? current.filter((item) => item !== color)
        : [...current, color]
    ));
  }

  function toggleDiscount(discount) {
    onDiscountsChange((current) => (
      current.includes(discount)
        ? current.filter((item) => item !== discount)
        : [...current, discount]
    ));
  }

  function clearFilters() {
    setSelectedColors([]);
    onClear();
  }

  return (
    <div>
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          aria-expanded={filtersOpen}
          onClick={onToggleFilters}
          className="inline-flex items-center gap-2 rounded-md border border-[#dedede] bg-white px-3 py-2 font-libre text-sm text-[#272727] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#00071b]"
        >
          Filters
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6h16M7 12h10m-7 6h4" strokeLinecap="round" />
          </svg>
        </button>
        <SortSelect sortBy={sortBy} onSortChange={onSortChange} />
      </div>

      <aside className={`${filtersOpen ? "block" : "hidden"} rounded-md bg-white px-2.5 pb-1 shadow-[0_0_20px_rgba(0,0,0,0.07)] lg:block`}>
        <div className="flex items-center justify-between pt-3 pb-2">
          <h1 className="font-libre text-lg font-bold leading-tight text-[#272727]">Filters</h1>
          <button
            type="button"
            onClick={clearFilters}
            className="font-libre text-[10px] text-[#00398f] hover:underline focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#00398f]"
          >
            Clear all
          </button>
        </div>

        <section className="pb-2">
          <h2 className="mb-1 font-libre text-xs text-[#272727]">Price</h2>
          <div className="relative mx-1 h-5">
            <div className="absolute top-2 left-0 right-0 h-0.5 rounded bg-[#a8a8a8]" />
            <div
              className="absolute top-2 h-0.5 rounded bg-[#1683e8]"
              style={{
                left: `${((priceRange.min - priceBounds.min) / (priceBounds.max - priceBounds.min || 1)) * 100}%`,
                right: `${100 - ((priceRange.max - priceBounds.min) / (priceBounds.max - priceBounds.min || 1)) * 100}%`,
              }}
            />
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              value={priceRange.min}
              onChange={(event) => {
                const value = Number(event.target.value);
                onPriceRangeChange((current) => ({
                  ...current,
                  min: Math.min(value, current.max),
                }));
              }}
              className="pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-[#bdbdbd] [&::-moz-range-thumb]:bg-white [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#bdbdbd] [&::-webkit-slider-thumb]:bg-white"
            />
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              value={priceRange.max}
              onChange={(event) => {
                const value = Number(event.target.value);
                onPriceRangeChange((current) => ({
                  ...current,
                  max: Math.max(value, current.min),
                }));
              }}
              className="pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-[#bdbdbd] [&::-moz-range-thumb]:bg-white [&::-moz-range-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#bdbdbd] [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
          <div className="mt-0.5 flex justify-between px-0.5" aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => (
              <span key={index} className="h-0.5 w-0.5 rounded-full bg-[#272727]" />
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 font-libre text-[9px] leading-tight text-[#646464]">
            <p>Min<br /><span className="text-[#272727]">Rs. {priceRange.min}</span></p>
            <p className="text-right">Max<br /><span className="text-[#272727]">Rs. {priceRange.max}</span></p>
          </div>
        </section>

        <AccordionFilter
          title="Brand"
          open={openFilters.brand}
          onToggle={() => toggleFilter("brand")}
        >
          <div className="space-y-1.5">
            {brands.map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-2 font-libre text-[11px] text-[#646464]">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-3 w-3 accent-[#00071b]"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </AccordionFilter>

        <AccordionFilter
          title="Color"
          open={openFilters.color}
          onToggle={() => toggleFilter("color")}
        >
          <div className="space-y-1.5">
            {colorOptions.map(([color, swatch]) => (
              <label key={color} className="flex cursor-pointer items-center gap-2 font-libre text-[11px] text-[#646464]">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => toggleColor(color)}
                  className="h-3 w-3 accent-[#00071b]"
                />
                <span aria-hidden="true" className="h-3 w-3 rounded-full border border-black/15" style={{ backgroundColor: swatch }} />
                <span>{color}</span>
              </label>
            ))}
          </div>
        </AccordionFilter>

        <AccordionFilter
          title="Discount Range"
          open={openFilters.discount}
          onToggle={() => toggleFilter("discount")}
        >
          <div className="space-y-1.5">
            {discountOptions.map((discount) => (
              <label key={discount} className="flex cursor-pointer items-center gap-2 font-libre text-[11px] text-[#646464]">
                <input
                  type="checkbox"
                  checked={selectedDiscounts.includes(discount)}
                  onChange={() => toggleDiscount(discount)}
                  className="h-3 w-3 accent-[#00071b]"
                />
                <span>{discount}% and above</span>
              </label>
            ))}
          </div>
        </AccordionFilter>
      </aside>
    </div>
  );
}

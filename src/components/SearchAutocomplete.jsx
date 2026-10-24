import { useEffect, useState } from "react";
import searchIcon from "../assets/searchIcon.png";

export default function SearchAutocomplete({ onSearch }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const normalizedSearch = search.trim().toLowerCase();

  useEffect(() => {
    if (!normalizedSearch) {
      setSuggestions([]);
      return undefined;
    }
    
    const timeoutId = setTimeout(async () => {
        const url = `${import.meta.env.VITE_API_URL}/api/products?search=${normalizedSearch}`;
        const response = await fetch(url);
        const products = await response.json();
        setSuggestions(Array.isArray(products) ? products.slice(0, 5) : []);
        
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [normalizedSearch]);

  function submitSearch(value = search) {
    const query = value.trim();
    if (!query) return;

    setSearch(query);
    setIsOpen(false);
    setActiveIndex(-1);
    onSearch(query);
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowDown" && suggestions.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestions.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      submitSearch(suggestions[activeIndex].name);
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submitSearch();
      }}
      role="search"
      className="relative ml-auto hidden min-w-32 max-w-107.5 flex-1 md:flex"
    >
      <label htmlFor="navbar-search" className="sr-only">Search products</label>
      <div className="flex h-11 w-full items-center rounded-lg bg-[#f0f0f0] px-4 transition-shadow focus-within:ring-2 focus-within:ring-black/20">
        <input
          id="navbar-search"
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search here"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="product-search-suggestions"
          aria-expanded={isOpen && Boolean(normalizedSearch)}
          aria-activedescendant={activeIndex >= 0 ? `search-suggestion-${suggestions[activeIndex]?.id}` : undefined}
          className="min-w-0 flex-1 bg-transparent text-sm text-[#272727] outline-none placeholder:text-[#848484] lg:text-base"
        />
        <button type="submit" aria-label="Search" className="ml-3 shrink-0 text-[#272727]">
          <img src={searchIcon} alt="" className="h-4.5 w-4.5" />
        </button>
      </div>
      {isOpen && normalizedSearch && (
        <ul
          id="product-search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-lg border border-[#e5e5e5] bg-white py-2 shadow-lg"
        >
          {suggestions.length ? suggestions.map((product, index) => (
            <li key={product.id} role="option" aria-selected={activeIndex === index}>
              <button
                id={`search-suggestion-${product.id}`}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => submitSearch(product.name)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[#f5f5f5] ${
                  activeIndex === index ? "bg-[#f5f5f5]" : ""
                }`}
              >
                <span className="block font-medium text-[#272727]">{product.name}</span>
                <span className="mt-0.5 block text-xs text-[#848484]">{product.brand}</span>
              </button>
            </li>
          )) : (
            <li className="px-4 py-3 text-sm text-[#646464]">No matching products</li>
          )}
        </ul>
      )}
    </form>
  );
}

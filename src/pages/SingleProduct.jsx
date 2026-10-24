import { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import useLocalStorage from "../data/useLocalStorage";

const sizes = ["XS", "S", "M", "L", "XL"];
const colors = ["Blue", "Black", "White"];
const tabs = ["Product Details", "Specification", "Ratings & Reviews"];

const reviews = [
  {
    name: "Anna Cloe",
    date: "28 September",
    rating: 4.4,
    text: "The fit is comfortable, the quality is lovely, and this piece is easy to style for everyday wear.",
  },
  {
    name: "Mia Thomas",
    date: "12 September",
    rating: 4.5,
    text: "I ordered my usual size and it fits perfectly. The fabric feels comfortable throughout the day.",
  },
  {
    name: "Sarah Parker",
    date: "04 September",
    rating: 4.2,
    text: "A great everyday choice with a flattering fit. The color is beautiful and easy to pair with other pieces.",
  },
];

function StarRating({ rating, color = "text-[#d9a526]", size = "text-sm" }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${color} ${size}`} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true">{index < Math.round(rating) ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

function ProductInformation({ product }) {
  return (
    <div className="max-w-3xl space-y-6 text-[#272727]">
      <section>
        <h2 className="text-lg font-bold">Product Details</h2>
        <p className="mt-2 text-sm leading-6 text-[#646464]">
          {product.id === 1
            ? "Blue washed jacket, has a spread collar, 4 pockets, button closure, long sleeves, straight hem."
            : `${product.name} by ${product.brand}, made for comfortable everyday wear with a timeless, easy-to-style finish.`}
        </p>
      </section>
      <section>
        <h2 className="text-lg font-bold">Size &amp; Fit</h2>
        <p className="mt-2 text-sm leading-6 text-[#646464]">
          {product.id === 1 ? "The model (height 5'8\") is wearing a size S." : "Refer to the size chart for garment measurements."}
        </p>
      </section>
      <section>
        <h2 className="text-lg font-bold">Material &amp; Care</h2>
        <p className="mt-2 text-sm leading-6 text-[#646464]">
          {product.id === 1 ? <>100% cotton<br />Machine wash</> : "Refer to the garment label for material and care instructions."}
        </p>
      </section>
    </div>
  );
}

function ProductSpecifications({ product }) {
  const specificationRows = [
    ["Brand", product.brand],
    ["Product", product.name],
    ["Color", product.id === 1 ? "Blue" : "As shown"],
    ["Fit", product.id === 1 ? "Regular fit" : "Refer to size chart"],
    ["Material", product.id === 1 ? "100% cotton" : "See garment label"],
    ["Care", product.id === 1 ? "Machine wash" : "See garment label"],
  ];

  return (
    <dl className="max-w-3xl divide-y divide-[#e8e8e8]">
      {specificationRows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[minmax(110px,0.6fr)_minmax(0,1fr)] gap-4 py-3 text-sm">
          <dt className="text-[#646464]">{label}</dt>
          <dd className="text-[#272727]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProductReviews({ product, image }) {
  return (
    <section className="">
      <h2 className="text-xl font-bold text-[#272727]">Ratings</h2>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <p className="text-4xl text-[#272727]">{product.rating.toFixed(1)}</p>
        <div>
          <StarRating rating={product.rating} size="text-xl" />
          <p className="mt-1 text-sm text-[#646464]">40 Verified Buyers</p>
        </div>
      </div>

      <div className="mt-8 max-w-5xl divide-y divide-[#e8e8e8]">
        {reviews.map((review) => (
          <article key={review.name} className="py-6 first:pt-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <StarRating rating={review.rating} />
              <span className="text-sm text-[#646464]">{review.rating.toFixed(1)}</span>
            </div>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-[#646464]">{review.text}</p>
            <div className="mt-4 flex gap-3">
              {[0, 1, 2].map((index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Customer photo ${index + 1} for ${product.name}`}
                  className="h-20 w-20 rounded-lg object-contain sm:h-28 sm:w-28 lg:h-32 lg:w-32"
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-[#272727]">
              {review.name}<span className="mx-3 text-[#bdbdbd]">|</span>{review.date}
            </p>
          </article>
        ))}
      </div>
      <button type="button" className="mt-4 text-sm font-bold text-[#00398f] underline underline-offset-4">
        View all Reviews
      </button>
    </section>
  );
}

function ProductRail({ title, items }) {
  return (
    <section className="mt-14">
      <h2 className="mb-5 text-2xl font-bold text-[#272727] sm:text-3xl">{title}</h2>
      <div className="flex gap-5 overflow-x-auto pb-5 sm:gap-10 no-scrollbar" aria-label={title}>
        {items.map((item) => (
          <div key={item.id} className="w-[clamp(260px,21.35vw,410px)] shrink-0">
            <ProductCard {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SingleProduct() {
  const { productId } = useParams();
  const { isLoaded, user } = useUser();
  const userId = user?.id ?? "guest";

  if (!isLoaded) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[55vh] items-center justify-center bg-[#f9faff] text-sm text-[#646464]">
          Loading product...
        </main>
        <Footer />
      </>
    );
  }

  return (
    <SingleProductView
      key={`${productId}:${userId}`}
      productId={productId}
      cartStorageKey={`cartItems:${userId}`}
      wishlistStorageKey={`wishlistItems:${userId}`}
    />
  );
}

function SingleProductView({ productId, cartStorageKey, wishlistStorageKey }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productError, setProductError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      
      try {
        const url = `${import.meta.env.VITE_API_URL}/api/products`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) return;
        const data = await response.json();
        if (!controller.signal.aborted && Array.isArray(data)) setProducts(data);
      } catch (error) {
        if (error.name !== "AbortError") console.error("Failed to load recommended products", error);
      }
    }

    fetchProducts();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      setProductLoading(true);
      setProductError(false);

      try {
        const url = `${import.meta.env.VITE_API_URL}/api/products/${productId}`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Product request failed with status ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setProduct(null);
          setProductError(true);
        }
      } finally {
        if (!controller.signal.aborted) setProductLoading(false);
      }
    }

    fetchProduct();
    return () => controller.abort();
  }, [productId]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [cartItems, setCartItems, cartStorageError] = useLocalStorage(cartStorageKey, []);
  const [savedWishlistIds, setWishlistIds, wishlistStorageError] = useLocalStorage(wishlistStorageKey, []);
  const wishlistIds = Array.isArray(savedWishlistIds) ? savedWishlistIds : [];
  const isFavorite = product ? wishlistIds.includes(product.id) : false;
  const inCart = Array.isArray(cartItems)
    ? product && cartItems.find((item) => item.id === product.id && item.size === selectedSize)
    : false;

  if (productLoading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[55vh] items-center justify-center bg-[#f9faff] text-sm text-[#646464]" aria-live="polite">
          Loading product...
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[55vh] flex-col items-center justify-center bg-[#f9faff] px-4 text-center">
          <h1 className="text-2xl font-bold text-[#272727]">Product not found</h1>
          <p className="mt-2 text-sm text-[#646464]">{productError ? "We couldn't load this product. Please try again later." : "The product you are looking for may have been removed."}</p>
          <Link to="/products" className="mt-5 rounded-md bg-[#00071b] px-5 py-3 text-sm font-bold text-white hover:bg-[#17213a]">
            Browse products
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const heroImage = gallery[selectedImageIndex % gallery.length];
  const galleryThumbnails = Array.from({ length: 5 }, (_, index) => gallery[index % gallery.length]);
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const otherProducts = products.filter((item) => item.id !== product.id);
  const similarProducts = otherProducts.slice(0, 5);
  const alsoLiked = otherProducts.slice(5, 10);
  const displayName = product.id === 1 ? "Womens Denim Jacket (Blue)" : product.name;

  function toggleCartItem() {
    setCartItems((currentItems) => {
      if (inCart) {
        return currentItems.filter((item) => item.id !== product.id || item.size !== selectedSize);
      }

      const existingItem = currentItems.find((item) => item?.id === product.id && item.size === selectedSize);
      return existingItem
        ? currentItems.map((item) => item?.id === product.id && item.size === selectedSize
          ? { ...item, quantity: item.quantity + 1 }
          : item)
        : [...currentItems, { ...product, size: selectedSize, quantity: 1 }];
    });
  }

  function toggleWishlist() {
    setWishlistIds((currentIds) => isFavorite
      ? currentIds.filter((id) => id !== product.id)
      : [...currentIds, product.id]);
  }

  function buyNow() {
    const saved = setCartItems([{ ...product, size: selectedSize, quantity: 1 }]);

    if (saved) {
      navigate("/checkout", { state: { backgroundLocation: location } });
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f9faff] pb-14 pt-6 sm:pb-16">
        <section className="mx-auto grid w-full max-w-[1822px] items-start gap-8 px-4 sm:px-8 lg:px-12 min-[900px]:grid-cols-[minmax(0,1.3fr)_minmax(350px,1fr)] min-[900px]:gap-[4%]">
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-4 min-[900px]:grid-cols-[clamp(80px,9.4vw,180px)_minmax(0,1fr)]">
            <div className="order-2 flex gap-3 overflow-x-auto sm:gap-4 min-[900px]:order-1 min-[900px]:grid min-[900px]:grid-rows-5 min-[900px]:gap-3 min-[900px]:overflow-visible">
              {galleryThumbnails.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  aria-pressed={selectedImageIndex === index}
                  className={`aspect-square w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-colors sm:w-20 min-[900px]:w-full ${selectedImageIndex === index ? "border-[#00398f]" : "border-transparent"}`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="order-1 aspect-4/3 min-w-0 overflow-hidden rounded-lg bg-[#e9edf2] sm:aspect-5/4 min-[900px]:order-2 min-[900px]:aspect-837/900">
              <img src={heroImage} className="h-full w-full object-contain" />
            </div>
          </div>

          <section className="min-w-0 text-[#272727]">
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl 2xl:text-[36px]">{displayName}</h1>
            <p className="mt-3 text-lg sm:text-xl">{product.brand}</p>
            <p className="mt-3 text-sm text-[#646464]">Sold By : Sellers Name</p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <StarRating rating={product.rating} color="text-[#272727]" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-[#00398f] underline underline-offset-2">{product.id === 1 ? "36 Reviews" : "Reviews"}</span>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-bold">{product.currency} {product.price.toLocaleString("en-IN")}</span>
              {discount > 0 && (
                <>
                  <span className="text-base text-[#646464] line-through">{product.currency} {product.originalPrice.toLocaleString("en-IN")}</span>
                  <span className="text-base font-bold text-[#299e00]">({discount}% off)</span>
                </>
              )}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Select Size</h2>
                <button type="button" className="text-sm text-[#00398f] hover:underline">
                  Size Chart <span aria-hidden="true">›</span>
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => {
                      setSelectedSize(size);
                    }}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm transition-colors ${selectedSize === size ? "border-[#002482] bg-[#002482] text-white" : "border-[#d8d8d8] bg-white text-[#272727] hover:border-[#002482]"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-bold">Select Color <span className="font-normal text-[#646464]">· {selectedColor}</span></h2>
              <div className="mt-4 flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Select ${color} color`}
                    aria-pressed={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-18.5 w-18.5 overflow-hidden rounded-md border-2 ${selectedColor === color ? "border-[#00398f]" : "border-transparent"}`}
                  >
                    <img src={heroImage} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <section className="mt-6">
              <h2 className="text-lg font-bold">Best Offers</h2>
              <ul className="mt-2 space-y-2 text-sm leading-5 text-[#272727]">
                <li><strong>Special offer</strong> get 25% off <a href="#terms" className="ml-2 text-[#00398f] underline">T&amp;C</a></li>
                <li><strong>Bank offer</strong> get 30% off on Axis Bank Credit card <a href="#terms" className="ml-2 text-[#00398f] underline">T&amp;C</a></li>
                <li><strong>Wallet offer</strong> get 40% cashback via Paytm wallet on first transaction <a href="#terms" className="ml-2 text-[#00398f] underline">T&amp;C</a></li>
                <li><strong>Special offer</strong> get 25% off <a href="#terms" className="ml-2 text-[#00398f] underline">T&amp;C</a></li>
              </ul>
            </section>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={buyNow}
                className="rounded-md bg-[#002482] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#001b64] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#002482]"
              >
                Buy Now
              </button> 
              <button
                type="button" 
                onClick={toggleCartItem}
                className="rounded-md bg-[#002482] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#001b64] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#002482]"
              >
                {inCart ? "Remove from cart" : "Add to cart"}
              </button>
              <button
                type="button"
                aria-pressed={isFavorite}
                onClick={toggleWishlist}
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#dedede] text-2xl transition-colors hover:border-[#002482] ${isFavorite ? "text-[#b42318]" : "text-[#272727]"}`}
              >
                {isFavorite ? "♥" : "♡"}
              </button>
              {(cartStorageError || wishlistStorageError) && (
                <p role="alert" className="w-full text-sm text-[#b42318]">{cartStorageError || wishlistStorageError}</p>
              )}
            </div>
          </section>
        </section>

        <section className="mx-auto mt-12 w-full max-w-378.5 px-4 sm:px-8 lg:mt-20 lg:px-0">
          <div role="tablist" aria-label="Product information" className="flex border-b border-[#d8d8d8]">
            {tabs.map((tab) => (
              <button
                key={tab}
                id={`tab-${tabs.indexOf(tab)}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls="product-tab-panel"
                onClick={() => setActiveTab(tab)}
                className={`min-h-12 flex-1 border-b-2 px-2 text-xs transition-colors sm:text-base ${activeTab === tab ? "border-[#002482] text-[#002482]" : "border-transparent text-[#848484] hover:text-[#272727]"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div id="product-tab-panel" role="tabpanel" aria-labelledby={`tab-${tabs.indexOf(activeTab)}`} className="min-h-64 px-2 py-7 sm:px-4 sm:py-9">
            {activeTab === "Product Details" && <ProductInformation product={product} />}
            {activeTab === "Specification" && <ProductSpecifications product={product} />}
            {activeTab === "Ratings & Reviews" && <ProductReviews product={product} image={heroImage} />}
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1822px] px-4 sm:px-8 lg:px-12">
          <ProductRail title="Similar Products" items={similarProducts} />
          <ProductRail title="Customer Also Like" items={alsoLiked} />
        </div>
      </main>
      <Footer />
    </>
  );
}

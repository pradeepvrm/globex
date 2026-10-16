import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import products from "../data/products.json";

export default function Wishlist() {
  return (
    <div>
      <Navbar />
      <h1 className="mx-12 mt-10 mb-6 text-blue-950 text-2xl font-bold">My Wishlist</h1>
      <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-4 mx-12 mb-12">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      
      <Footer />
    </div>
  );
}
import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";

const CATEGORIES = ["men", "women", "kids"];

const EMPTY_FORM = {
  name: "",
  brand: "",
  category: "women",
  price: "",
  originalPrice: "",
  rating: "",
  image: "",
  imageAlt: "",
  gallery: "",
  description: "",
};

const formatPrice = (amount) => `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

function productToForm(product) {
  return {
    name: product.name ?? "",
    brand: product.brand ?? "",
    category: product.category ?? "women",
    price: product.price ?? "",
    originalPrice: product.originalPrice ?? "",
    rating: product.rating ?? "",
    image: product.image ?? "",
    imageAlt: product.imageAlt ?? "",
    gallery: Array.isArray(product.gallery) ? product.gallery.join("\n") : "",
    description: product.description ?? "",
  };
}

export default function AdminProducts() {
  const { getToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setError("");
        const token = await getToken();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.msg || "Could not load products.");
        }

        const data = await response.json();
        if (!cancelled) setProducts(data.data);
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || "Could not connect to the API.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setForm(productToForm(product));
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");

    const payload = {
      ...form,
      gallery: form.gallery
        .split(/[\n,]+/)
        .map((url) => url.trim())
        .filter(Boolean),
    };

    try {
      const token = await getToken();
      const response = await fetch(
        editingId
          ? `${import.meta.env.VITE_API_URL}/api/admin/products/${editingId}`
          : `${import.meta.env.VITE_API_URL}/api/admin/products`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body.msg || "Could not save the product.");
      }

      setProducts((current) =>
        editingId
          ? current.map((product) => (product.id === editingId ? body.data : product))
          : [...current, body.data],
      );
      closeForm();
    } catch (saveError) {
      setFormError(saveError.message || "Could not save the product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-[#646464]">
          {products.length} {products.length === 1 ? "product" : "products"} in the catalog
        </p>
        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-md bg-[#00071b] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#17213a]"
        >
          Add product
        </button>
      </div>

      {error && (
        <p role="alert" className="mb-5 rounded-xl border border-[#fecdca] bg-white px-5 py-4 text-sm text-[#b42318]">
          {error}
        </p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-[#e8e8e8] bg-white p-5 shadow-[0_0_20px_rgba(0,0,0,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#00071b]">
              {editingId ? `Edit product #${editingId}` : "New product"}
            </h2>
            <button type="button" onClick={closeForm} className="text-xs font-bold text-[#646464] hover:text-[#00071b]">
              Cancel
            </button>
          </div>

          {formError && (
            <p role="alert" className="mb-4 rounded-lg border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">
              {formError}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727] sm:col-span-2">
              Name
              <input required name="name" value={form.name} onChange={handleChange} className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727]">
              Brand
              <input required name="brand" value={form.brand} onChange={handleChange} className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727]">
              Category
              <select name="category" value={form.category} onChange={handleChange} className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal capitalize">
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727]">
              Price
              <input required type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727]">
              Original price
              <input required type="number" min="0" step="0.01" name="originalPrice" value={form.originalPrice} onChange={handleChange} className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727]">
              Rating (0-5)
              <input type="number" min="0" max="5" step="0.1" name="rating" value={form.rating} onChange={handleChange} className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727] sm:col-span-2 lg:col-span-3">
              Main image URL
              <input required name="image" value={form.image} onChange={handleChange} className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727] sm:col-span-2 lg:col-span-3">
              Image alt text
              <input name="imageAlt" value={form.imageAlt} onChange={handleChange} className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727] sm:col-span-2 lg:col-span-3">
              Gallery URLs (one per line)
              <textarea name="gallery" rows="3" value={form.gallery} onChange={handleChange} className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727] sm:col-span-2 lg:col-span-3">
              Description
              <textarea name="description" rows="4" value={form.description} onChange={handleChange} className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal" />
            </label>
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={closeForm} className="rounded-md border border-[#d0d5dd] px-4 py-2.5 text-xs font-bold text-[#272727]">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="rounded-md bg-[#00071b] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">
              {isSaving ? "Saving..." : editingId ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="py-12 text-center text-sm text-[#646464]">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="rounded-xl border border-[#e8e8e8] bg-white px-5 py-12 text-center text-sm text-[#646464]">
          No products yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e8e8e8] bg-white shadow-[0_0_20px_rgba(0,0,0,0.04)]">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="border-b border-[#e8e8e8] bg-[#f8f9fb] text-[10px] font-bold uppercase tracking-wide text-[#848484]">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Original</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8]">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <img src={product.image} alt={product.imageAlt || product.name} className="h-14 w-11 rounded-md bg-[#f0f0f0] object-cover" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#00071b]">{product.name}</p>
                    <p className="text-[10px] text-[#848484]">{product.brand} · #{product.id}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-[#646464]">{product.category}</td>
                  <td className="px-4 py-3 font-bold text-[#00071b]">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-[#646464]">{formatPrice(product.originalPrice)}</td>
                  <td className="px-4 py-3 text-[#646464]">{product.rating ?? "—"}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => openEditForm(product)} className="text-xs font-bold text-blue-950 underline underline-offset-4 hover:text-[#646464]">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

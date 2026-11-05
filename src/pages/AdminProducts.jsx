import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { resolveProductImageUrl } from "../data/api";

const CATEGORIES = ["men", "women", "kids"];

const EMPTY_FORM = {
  name: "",
  brand: "",
  category: "women",
  price: "",
  originalPrice: "",
  quantity: "0",
  rating: "",
  image: "",
  imageAlt: "",
  gallery: [],
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
    quantity: product.quantity ?? 0,
    rating: product.rating ?? "",
    image: product.image ?? "",
    imageAlt: product.imageAlt ?? "",
    gallery: Array.isArray(product.gallery) ? product.gallery : [],
    description: product.description ?? "",
  };
}

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const imageInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setError("");
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
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setGalleryFiles([]);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setForm(productToForm(product));
    setImageFile(null);
    setGalleryFiles([]);
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setGalleryFiles([]);
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");

    const payload = new FormData(event.currentTarget);

    try {
      const response = await fetch(
        editingId
          ? `${import.meta.env.VITE_API_URL}/api/admin/products/${editingId}`
          : `${import.meta.env.VITE_API_URL}/api/admin/products`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
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

  const handleDelete = async (product) => {

    setDeletingId(product.id);
    setDeleteError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/products/${product.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(body.msg || "Could not delete the product.");
      }

      setProducts((current) => current.filter((item) => item.id !== product.id));
    } catch (deleteError) {
      setDeleteError(deleteError.message || "Could not delete the product.");
    } finally {
      setDeletingId(null);
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
      {deleteError && (
        <p role="alert" className="mb-5 rounded-xl border border-[#fecdca] bg-white px-5 py-4 text-sm text-[#b42318]">
          {deleteError}
        </p>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-[#101828]/45 p-3 backdrop-blur-[3px] sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
        <form
          onSubmit={handleSubmit}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-form-title"
          className="my-auto no-scrollbar max-h-[calc(100vh-1.5rem)] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-[0_24px_90px_rgba(13,22,41,0.25)] sm:max-h-[calc(100vh-2.5rem)] sm:p-7"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 id="product-form-title" className="text-lg font-bold text-[#00071b]">
              {editingId ? `Edit product #${editingId}` : "New product"}
            </h2>
            <button type="button" onClick={closeForm} className="text-xs font-bold text-[#646464] hover:text-[#00071b]">
              ✕
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
              Quantity in stock
              <input required type="number" min="0" step="1" name="quantity" value={form.quantity} onChange={handleChange} className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727]">
              Rating (0-5)
              <input type="number" min="0" max="5" step="0.1" name="rating" value={form.rating} onChange={handleChange} className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727] sm:col-span-2 lg:col-span-3">
              Main image
              <input
                required={!form.image && !imageFile}
                type="file"
                name="imageFile"
                accept="image/jpeg,image/png,image/webp,image/gif"
                ref={imageInputRef}
                onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal"
              />
              {imageFile ? (
                <span className="mt-1 flex items-center gap-2 font-normal text-[#646464]">
                  {imageFile.name}
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      if (imageInputRef.current) imageInputRef.current.value = "";
                    }}
                    className="font-semibold text-blue-950 underline"
                  >
                    Remove
                  </button>
                </span>
              ) : form.image ? (
                <img src={resolveProductImageUrl(form.image)} alt="Current main product" className="mt-2 h-24 w-20 rounded-md bg-[#f0f0f0] object-cover" />
              ) : null}
              <input type="hidden" name="image" value={form.image} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727] sm:col-span-2 lg:col-span-3">
              Image alt text
              <input name="imageAlt" value={form.imageAlt} onChange={handleChange} className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal" />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[#272727] sm:col-span-2 lg:col-span-3">
              Gallery images
              <input
                type="file"
                name="galleryFiles"
                multiple
                accept="image/jpeg, image/png, image/webp"
                onChange={(event) => {
                  setGalleryFiles(Array.from(event.target.files || []));
                }}
                className="rounded-md border border-[#d0d5dd] px-3 py-2 text-sm font-normal"
              />
              {form.gallery.map((image, index) => (
                <input key={`${image}-${index}`} type="hidden" name="gallery" value={image} />
              ))}
              {(form.gallery.length > 0 || galleryFiles.length > 0) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.gallery.map((image, index) => (
                    <img key={`${image}-${index}`} src={resolveProductImageUrl(image)} alt={`Gallery image ${index + 1}`} className="h-16 w-12 rounded-md bg-[#f0f0f0] object-cover" />
                  ))}
                  {galleryFiles.map((file, index) => (
                    <span key={`${file.name}-${index}`} className="rounded-md bg-[#f4f6fa] px-2 py-1 font-normal text-[#646464]">{file.name}</span>
                  ))}
                </div>
              )}
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
        </div>
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
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8e8]">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <img src={resolveProductImageUrl(product.image)} alt={product.imageAlt || product.name} className="h-14 w-11 rounded-md bg-[#f0f0f0] object-cover" />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#00071b]">{product.name}</p>
                    <p className="text-[10px] text-[#848484]">{product.brand} · #{product.id}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-[#646464]">{product.category}</td>
                  <td className="px-4 py-3 font-bold text-[#00071b]">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3 text-[#646464]">{formatPrice(product.originalPrice)}</td>
                  <td className="px-4 py-3 text-[#646464]">{product.quantity ?? 0}</td>
                  <td className="px-4 py-3 text-[#646464]">{product.rating ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => openEditForm(product)} className="text-xs font-bold text-blue-950 underline underline-offset-2 hover:text-[#646464]">
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        disabled={deletingId !== null}
                        className="text-xs font-bold text-[#b42318] underline underline-offset-2 hover:text-[#7a271a] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === product.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
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

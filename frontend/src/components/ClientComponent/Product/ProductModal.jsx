import { useEffect, useState } from "react";
import { X, Package } from "lucide-react";

const initialForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  currency: "INR",
  availability: "in_stock",
  stock: "",
  image: "",
  status: "active",
};

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  loading = false,
}) {
  const [form, setForm] = useState(initialForm);

  const isEdit = Boolean(product);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        price:
          product.price !== null && product.price !== undefined
            ? product.price
            : "",
        currency: product.currency || "INR",
        availability: product.availability || "in_stock",
        stock:
          product.stock !== null && product.stock !== undefined
            ? product.stock
            : "",
        image: product.image || "",
        status: product.status || "active",
      });
    } else {
      setForm(initialForm);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      price: form.price === "" ? null : Number(form.price),
      currency: form.currency,
      availability: form.availability,
      stock: form.stock === "" ? null : Number(form.stock),
      image: form.image.trim(),
      status: form.status,
    };

    await onSubmit(payload);
  };

  return (
    <div
      className="
        fixed inset-0 z-100
        flex items-center justify-center
        bg-black/50 p-4 backdrop-blur-sm
      "
    >
      <div
        className="
          flex max-h-[90vh] w-full max-w-2xl
          flex-col overflow-hidden rounded-2xl
          border border-gray-200 bg-white shadow-2xl
          dark:border-white/10 dark:bg-[#171b23]
        "
      >
        {/* Header */}
        <div
          className="
            flex shrink-0 items-center justify-between
            border-b border-gray-200 px-5 py-4
            dark:border-white/10
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl bg-blue-500/10 text-blue-500
              "
            >
              <Package size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {isEdit ? "Edit Product" : "Add Product"}
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isEdit
                  ? "Update product information"
                  : "Add a new product to your catalog"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              rounded-lg p-2 text-gray-500
              transition hover:bg-gray-100 hover:text-gray-900
              dark:text-gray-400 dark:hover:bg-white/10
              dark:hover:text-white
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="space-y-5 p-5">
            {/* Name */}
            <FormField label="Product Name" required>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
                className="input-style"
              />
            </FormField>

            {/* Description */}
            <FormField label="Description">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter product description"
                className="input-style resize-none"
              />
            </FormField>

            {/* Category + Currency */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Category">
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  className="input-style"
                />
              </FormField>

              <FormField label="Currency">
                <select
                  name="currency"
                  value={form.currency}
                  onChange={handleChange}
                  className="input-style"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                </select>
              </FormField>
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Price">
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className="input-style"
                />
              </FormField>

              <FormField label="Stock">
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="0"
                  className="input-style"
                />
              </FormField>
            </div>

            {/* Availability + Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Availability">
                <select
                  name="availability"
                  value={form.availability}
                  onChange={handleChange}
                  className="input-style"
                >
                  <option value="in_stock">In Stock</option>

                  <option value="out_of_stock">Out of Stock</option>

                  <option value="pre_order">Pre Order</option>

                  <option value="unavailable">Unavailable</option>
                </select>
              </FormField>

              <FormField label="Status">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="input-style"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </FormField>
            </div>

            {/* Image */}
            <FormField label="Image URL">
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/product.jpg"
                className="input-style"
              />
            </FormField>

            {/* Image Preview */}
            {form.image && (
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
                <img
                  src={form.image}
                  alt="Product preview"
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="
              flex flex-col-reverse gap-3
              border-t border-gray-200 p-5
              sm:flex-row sm:justify-end
              dark:border-white/10
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                rounded-lg border border-gray-200
                px-4 py-2.5 text-sm font-medium
                text-gray-700 transition
                hover:bg-gray-50
                dark:border-white/10 dark:text-gray-300
                dark:hover:bg-white/5
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                flex items-center justify-center gap-2
                rounded-lg bg-blue-600 px-5 py-2.5
                text-sm font-medium text-white
                transition hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading && (
                <span
                  className="
                    h-4 w-4 animate-spin rounded-full
                    border-2 border-white/30 border-t-white
                  "
                />
              )}

              {loading
                ? "Saving..."
                : isEdit
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
}

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Package } from "lucide-react";

import CustomSelect from "../../common/CustomSelect";
import { productSchema } from "../../../utils/validation";

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
  const isEdit = Boolean(product);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialForm,
    mode: "onChange",
  });

  const image = watch("image");

  /* =========================================================
     EDIT / CREATE FORM RESET
  ========================================================= */

  useEffect(() => {
    if (product) {
      reset({
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
      reset(initialForm);
    }
  }, [product, isOpen, reset]);

  if (!isOpen) return null;

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleFormSubmit = async (data) => {
    const payload = {
      name: data.name.trim(),

      description: data.description?.trim() || "",

      category: data.category?.trim() || "",

      price: data.price === "" ? null : Number(data.price),

      currency: data.currency,

      availability: data.availability,

      stock: data.stock === "" ? null : Number(data.stock),

      image: data.image?.trim() || "",

      status: data.status,
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
        {/* =================================================
            HEADER
        ================================================= */}

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

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="overflow-y-auto"
          noValidate
        >
          <div className="space-y-5 p-5">
            {/* Name */}

            <FormField
              label="Product Name"
              required
              error={errors.name?.message}
            >
              <input
                type="text"
                {...register("name")}
                disabled={loading}
                placeholder="Enter product name"
                className={`input-style ${errors.name ? "input-error" : ""}`}
              />
            </FormField>

            {/* Description */}

            <FormField label="Description" error={errors.description?.message}>
              <textarea
                {...register("description")}
                disabled={loading}
                rows={3}
                placeholder="Enter product description"
                className={`input-style resize-none ${
                  errors.description ? "input-error" : ""
                }`}
              />
            </FormField>

            {/* Category + Currency */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Category" error={errors.category?.message}>
                <input
                  type="text"
                  {...register("category")}
                  disabled={loading}
                  placeholder="e.g. Electronics"
                  className={`input-style ${
                    errors.category ? "input-error" : ""
                  }`}
                />
              </FormField>

              <FormField label="Currency" error={errors.currency?.message}>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      size="sm"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={loading}
                      options={[
                        {
                          value: "INR",
                          label: "INR",
                        },
                        {
                          value: "USD",
                          label: "USD",
                        },
                        {
                          value: "GBP",
                          label: "GBP",
                        },
                        {
                          value: "EUR",
                          label: "EUR",
                        },
                      ]}
                      rounded="rounded-lg"
                      error={errors.currency?.message}
                    />
                  )}
                />
              </FormField>
            </div>

            {/* Price + Stock */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Price" error={errors.price?.message}>
                <input
                  type="number"
                  {...register("price")}
                  disabled={loading}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className={`input-style ${errors.price ? "input-error" : ""}`}
                />
              </FormField>

              <FormField label="Stock" error={errors.stock?.message}>
                <input
                  type="number"
                  {...register("stock")}
                  disabled={loading}
                  min="0"
                  step="1"
                  placeholder="0"
                  className={`input-style ${errors.stock ? "input-error" : ""}`}
                />
              </FormField>
            </div>

            {/* Availability + Status */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Availability"
                error={errors.availability?.message}
              >
                <Controller
                  name="availability"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      size="sm"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={loading}
                      options={[
                        {
                          value: "in_stock",
                          label: "In Stock",
                        },
                        {
                          value: "out_of_stock",
                          label: "Out of Stock",
                        },
                        {
                          value: "pre_order",
                          label: "Pre Order",
                        },
                        {
                          value: "unavailable",
                          label: "Unavailable",
                        },
                      ]}
                      rounded="rounded-lg"
                      error={errors.availability?.message}
                    />
                  )}
                />
              </FormField>

              <FormField label="Status" error={errors.status?.message}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      size="sm"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={loading}
                      options={[
                        {
                          value: "active",
                          label: "Active",
                        },
                        {
                          value: "inactive",
                          label: "Inactive",
                        },
                      ]}
                      rounded="rounded-lg"
                      error={errors.status?.message}
                    />
                  )}
                />
              </FormField>
            </div>

            {/* Image */}

            <FormField label="Image URL" error={errors.image?.message}>
              <input
                type="url"
                {...register("image")}
                disabled={loading}
                placeholder="https://example.com/product.jpg"
                className={`input-style ${errors.image ? "input-error" : ""}`}
              />
            </FormField>

            {/* Image Preview */}
            {image && (
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10">
                <img
                  src={image}
                  alt="Product preview"
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

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

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label
        className="
          mb-1.5 block text-xs font-medium
          text-gray-700 dark:text-gray-300
        "
      >
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  Package,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

import CustomSelect from "../../common/CustomSelect";
import { productSchema } from "../../../utils/validation";
import { getImageUrl } from "../../../utils/imageUrl";

const initialForm = {
  name: "",
  description: "",
  category: "",
  price: "",
  currency: "INR",
  availability: "unavailable",
  stock: "",
  image: null,
  status: "active",
  metadata: [],
};

const metadataOptions = [
  {
    value: "technologies",
    label: "Technologies",
  },
  {
    value: "projectType",
    label: "Project Type",
  },
  {
    value: "features",
    label: "Features",
  },
  {
    value: "framework",
    label: "Framework",
  },
  {
    value: "frontend",
    label: "Frontend",
  },
  {
    value: "backend",
    label: "Backend",
  },
  {
    value: "database",
    label: "Database",
  },
  {
    value: "authentication",
    label: "Authentication",
  },
  {
    value: "deployment",
    label: "Deployment",
  },
  {
    value: "api",
    label: "API",
  },
  {
    value: "integrations",
    label: "Integrations",
  },
  {
    value: "version",
    label: "Version",
  },
  {
    value: "license",
    label: "License",
  },
  {
    value: "platform",
    label: "Platform",
  },
  {
    value: "team",
    label: "Team",
  },
];

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  loading = false,
}) {
  const isEdit = Boolean(product);

  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialForm,
    mode: "onChange",
  });

  const {
    fields: metadataFields,
    append: appendMetadata,
    remove: removeMetadata,
  } = useFieldArray({
    control,
    name: "metadata",
  });

  const image = watch("image");

  /* =========================================================
     EDIT / CREATE RESET
  ========================================================= */

  useEffect(() => {
    if (product) {
      const metadata = product.metadata
        ? Object.entries(product.metadata).map(([key, value]) => ({
            key,
            value: Array.isArray(value)
              ? value.join(", ")
              : String(value ?? ""),
          }))
        : [];

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

        // Existing image URL ko file field me nahi rakhenge
        image: null,

        status: product.status || "active",

        metadata,
      });

      // Existing image ka preview
      setImagePreview(product.image ? getImageUrl(product.image, "") : "");
    } else {
      reset(initialForm);
      setImagePreview("");
    }
  }, [product, isOpen, reset]);

  /* =========================================================
     IMAGE CHANGE
  ========================================================= */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // File validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setValue("image", null, {
        shouldValidate: true,
      });

      return;
    }

    // 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setValue("image", null, {
        shouldValidate: true,
      });

      return;
    }

    setValue("image", file, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    const previewUrl = URL.createObjectURL(file);

    setImagePreview((previousUrl) => {
      if (previousUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previousUrl);
      }

      return previewUrl;
    });
  };

  /* =========================================================
     REMOVE IMAGE
  ========================================================= */

  const handleRemoveImage = () => {
    setValue("image", null, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    setImagePreview((previousUrl) => {
      if (previousUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previousUrl);
      }

      return "";
    });
  };

  /* =========================================================
     CLEANUP BLOB URL
  ========================================================= */

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isOpen) {
    return null;
  }

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleFormSubmit = async (data) => {
    const metadata = {};

    (data.metadata || []).forEach((item) => {
      const key = item?.key?.trim();

      if (!key) {
        return;
      }

      const value = item?.value?.trim() || "";

      if (!value) {
        return;
      }

      /*
        Example:

        technologies:
        "React.js, Node.js, MongoDB"

        becomes:

        technologies: [
          "React.js",
          "Node.js",
          "MongoDB"
        ]
      */

      if (value.includes(",")) {
        metadata[key] = value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      } else {
        metadata[key] = value;
      }
    });

    const payload = {
      name: data.name.trim(),

      description: data.description?.trim() || "",

      category: data.category?.trim() || "",

      price: data.price === "" ? null : Number(data.price),

      currency: data.currency,

      availability: data.availability,

      stock: data.stock === "" ? null : Number(data.stock),

      /*
        File object

        Parent/API layer me:
        FormData.append("image", payload.image)
      */
      image: data.image || null,

      status: data.status,

      metadata,
    };

    await onSubmit(payload);
  };

  return (
    <div
      className="
        fixed inset-0 z-100
        flex items-center justify-center
        bg-black/50 p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          flex max-h-[90vh] w-full max-w-2xl
          flex-col overflow-hidden
          rounded-2xl
          border border-gray-200
          bg-white
          shadow-2xl
          dark:border-white/10
          dark:bg-[#171b23]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex shrink-0
            items-center justify-between
            border-b border-gray-200
            px-5 py-4
            dark:border-white/10
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-blue-500/10
                text-blue-500
              "
            >
              <Package size={20} />
            </div>

            <div>
              <h2
                className="
                  text-base font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                {isEdit ? "Edit Product" : "Add Product"}
              </h2>

              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
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
              rounded-lg p-2
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900
              dark:text-gray-400
              dark:hover:bg-white/10
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
            {/* =================================================
                NAME
            ================================================= */}

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
                className={`
                  input-style
                  ${errors.name ? "input-error" : ""}
                `}
              />
            </FormField>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <FormField label="Description" error={errors.description?.message}>
              <textarea
                {...register("description")}
                disabled={loading}
                rows={3}
                placeholder="Enter product description"
                className={`
                  input-style
                  resize-none
                  ${errors.description ? "input-error" : ""}
                `}
              />
            </FormField>

            {/* =================================================
                CATEGORY + CURRENCY
            ================================================= */}

            <div
              className="
                grid grid-cols-1
                gap-4
                sm:grid-cols-2
              "
            >
              <FormField label="Category" error={errors.category?.message}>
                <input
                  type="text"
                  {...register("category")}
                  disabled={loading}
                  placeholder="e.g. Electronics"
                  className={`
                    input-style
                    ${errors.category ? "input-error" : ""}
                  `}
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

            {/* =================================================
                PRICE + STOCK
            ================================================= */}

            <div
              className="
                grid grid-cols-1
                gap-4
                sm:grid-cols-2
              "
            >
              <FormField label="Price" error={errors.price?.message}>
                <input
                  type="number"
                  {...register("price")}
                  disabled={loading}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className={`
                    input-style
                    ${errors.price ? "input-error" : ""}
                  `}
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
                  className={`
                    input-style
                    ${errors.stock ? "input-error" : ""}
                  `}
                />
              </FormField>
            </div>

            {/* =================================================
                AVAILABILITY + STATUS
            ================================================= */}

            <div
              className="
                grid grid-cols-1
                gap-4
                sm:grid-cols-2
              "
            >
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

            {/* =================================================
                IMAGE UPLOAD
            ================================================= */}

            <FormField label="Product Image" error={errors.image?.message}>
              <div className="space-y-3">
                {/* IMAGE PREVIEW */}

                {imagePreview ? (
                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      dark:border-white/10
                      dark:bg-[#11151d]
                    "
                  >
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="
                        h-48
                        w-full
                        object-contain
                        p-2
                      "
                    />

                    {/* REMOVE */}

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={loading}
                      className="
                        absolute
                        right-3
                        top-3
                        flex h-8 w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-black/60
                        text-white
                        transition
                        hover:bg-red-500
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  /* SELECT IMAGE */

                  <label
                    className="
                      flex
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-dashed
                      border-gray-300
                      bg-gray-50
                      px-4
                      py-8
                      text-center
                      transition
                      hover:border-blue-400
                      hover:bg-blue-50/50
                      dark:border-white/10
                      dark:bg-white/[0.02]
                      dark:hover:border-blue-500/50
                      dark:hover:bg-blue-500/5
                    "
                  >
                    <div
                      className="
                        mb-3
                        flex h-11 w-11
                        items-center justify-center
                        rounded-xl
                        bg-blue-500/10
                        text-blue-500
                      "
                    >
                      <ImageIcon size={21} />
                    </div>

                    <p
                      className="
                        text-sm font-medium
                        text-gray-700
                        dark:text-gray-200
                      "
                    >
                      Select product image
                    </p>

                    <p
                      className="
                        mt-1 text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      JPG, JPEG, PNG or WEBP
                    </p>

                    <p
                      className="
                        mt-1 text-[11px]
                        text-gray-400
                        dark:text-gray-500
                      "
                    >
                      Maximum size: 5MB
                    </p>

                    <input
                      type="file"
                      accept="
                        image/jpeg,
                        image/jpg,
                        image/png,
                        image/webp
                      "
                      disabled={loading}
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}

                {/* CHANGE IMAGE */}

                {imagePreview && (
                  <label
                    className="
                      inline-flex
                      cursor-pointer
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-gray-200
                      px-3 py-2
                      text-xs
                      font-medium
                      text-gray-700
                      transition
                      hover:bg-gray-50
                      dark:border-white/10
                      dark:text-gray-300
                      dark:hover:bg-white/5
                    "
                  >
                    <Upload size={14} />
                    Change Image
                    <input
                      type="file"
                      accept="
                        image/jpeg,
                        image/jpg,
                        image/png,
                        image/webp
                      "
                      disabled={loading}
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </FormField>

            {/* =================================================
                METADATA
            ================================================= */}

            <div
              className="
                rounded-xl
                border border-gray-200
                bg-gray-50/50
                p-4
                dark:border-white/10
                dark:bg-white/[0.02]
              "
            >
              {/* HEADER */}

              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <div>
                  <h3
                    className="
                      text-sm font-semibold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    Metadata
                  </h3>

                  <p
                    className="
                      mt-0.5 text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Add custom information about this product.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    appendMetadata({
                      key: "",
                      value: "",
                    })
                  }
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-blue-600
                    px-3 py-2
                    text-xs
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Plus size={14} />
                  Add Metadata
                </button>
              </div>

              {/* EMPTY */}

              {metadataFields.length === 0 ? (
                <div
                  className="
                    rounded-lg
                    border border-dashed
                    border-gray-300
                    px-4 py-6
                    text-center
                    dark:border-white/10
                  "
                >
                  <p
                    className="
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    No metadata added yet.
                  </p>

                  <p
                    className="
                      mt-1 text-[11px]
                      text-gray-400
                      dark:text-gray-500
                    "
                  >
                    Add fields like technologies, features, projectType, etc.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {metadataFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="
                          flex
                          flex-col
                          gap-3
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          p-3
                          sm:flex-row
                          sm:items-start
                          dark:border-white/10
                          dark:bg-[#11151d]
                        "
                    >
                      {/* KEY */}

                      <div className="flex-1">
                        <label
                          className="
                              mb-1.5 block
                              text-xs
                              font-medium
                              text-gray-700
                              dark:text-gray-300
                            "
                        >
                          Key
                        </label>

                        <Controller
                          name={`metadata.${index}.key`}
                          control={control}
                          render={({ field }) => (
                            <CustomSelect
                              size="sm"
                              name={field.name}
                              value={field.value}
                              onChange={field.onChange}
                              disabled={loading}
                              placeholder="Select metadata"
                              rounded="rounded-lg"
                              error={errors.metadata?.[index]?.key?.message}
                              options={metadataOptions}
                            />
                          )}
                        />
                      </div>

                      {/* VALUE */}

                      <div className="flex-1">
                        <label
                          className="
                              mb-1.5 block
                              text-xs
                              font-medium
                              text-gray-700
                              dark:text-gray-300
                            "
                        >
                          Value
                        </label>

                        <input
                          type="text"
                          {...register(`metadata.${index}.value`)}
                          disabled={loading}
                          placeholder="
                              e.g. React.js, Node.js, MongoDB
                            "
                          className={`
                              input-style
                              ${
                                errors.metadata?.[index]?.value
                                  ? "input-error"
                                  : ""
                              }
                            `}
                        />

                        {errors.metadata?.[index]?.value?.message && (
                          <p
                            className="
                                mt-1
                                text-xs
                                text-red-500
                                dark:text-red-400
                              "
                          >
                            {errors.metadata[index].value.message}
                          </p>
                        )}
                      </div>

                      {/* DELETE */}

                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => removeMetadata(index)}
                        className="
                            mt-0
                            flex h-10 w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-gray-200
                            text-gray-500
                            transition
                            hover:border-red-200
                            hover:bg-red-50
                            hover:text-red-500
                            sm:mt-6
                            dark:border-white/10
                            dark:text-gray-400
                            dark:hover:border-red-500/20
                            dark:hover:bg-red-500/10
                            dark:hover:text-red-400
                          "
                        title="Remove metadata"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              flex flex-col-reverse
              gap-3
              border-t
              border-gray-200
              p-5
              sm:flex-row
              sm:justify-end
              dark:border-white/10
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                rounded-lg
                border border-gray-200
                px-4 py-2.5
                text-sm font-medium
                text-gray-700
                transition
                hover:bg-gray-50
                dark:border-white/10
                dark:text-gray-300
                dark:hover:bg-white/5
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-5 py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading && (
                <span
                  className="
                    h-4 w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white/30
                    border-t-white
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
          mb-1.5
          block
          text-xs
          font-medium
          text-gray-700
          dark:text-gray-300
        "
      >
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {error && (
        <p
          className="
            mt-1.5
            text-xs
            text-red-500
            dark:text-red-400
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}

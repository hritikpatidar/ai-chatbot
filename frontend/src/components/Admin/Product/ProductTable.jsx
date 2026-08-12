import { Edit, MoreHorizontal, Package, Trash2 } from "lucide-react";

export default function ProductTable({
  products = [],
  loading = false,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div
        className="
          flex min-h-75 items-center justify-center
          rounded-xl border border-gray-200 bg-white
          dark:border-white/10 dark:bg-[#171b23]
        "
      >
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <div
            className="
              h-5 w-5 animate-spin rounded-full
              border-2 border-gray-300 border-t-blue-500
              dark:border-gray-600 dark:border-t-blue-400
            "
          />
          Loading products...
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div
        className="
          flex min-h-75 flex-col items-center justify-center
          rounded-xl border border-gray-200 bg-white
          dark:border-white/10 dark:bg-[#171b23]
        "
      >
        <div
          className="
            mb-3 flex h-12 w-12 items-center justify-center
            rounded-xl bg-blue-500/10 text-blue-500
          "
        >
          <Package size={24} />
        </div>

        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          No products found
        </h3>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Add your first product to get started.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden rounded-xl
        border border-gray-200 bg-white
        dark:border-white/10 dark:bg-[#171b23]
      "
    >
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-225">
          <thead>
            <tr
              className="
                border-b border-gray-200 bg-gray-50
                dark:border-white/10 dark:bg-white/3
              "
            >
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Product
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Category
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Price
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Availability
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="
                  border-b border-gray-100 transition
                  last:border-0 hover:bg-gray-50
                  dark:border-white/5 dark:hover:bg-white/2
                "
              >
                {/* Product */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-11 w-11 shrink-0 items-center
                        justify-center overflow-hidden rounded-lg
                        bg-blue-500/10 text-blue-500
                      "
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package size={20} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>

                      <p className="mt-1 max-w-75 truncate text-xs text-gray-500 dark:text-gray-400">
                        {product.description || "No description"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-5 py-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {product.category || "-"}
                  </span>
                </td>

                {/* Price */}
                <td className="px-5 py-4">
                  {product.price !== null && product.price !== undefined ? (
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.currency || "INR"}{" "}
                      {Number(product.price).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Contact us</span>
                  )}
                </td>

                {/* Availability */}
                <td className="px-5 py-4">
                  <AvailabilityBadge availability={product.availability} />
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <StatusBadge status={product.status} />
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="
                        rounded-lg p-2 text-gray-500
                        transition hover:bg-blue-500/10
                        hover:text-blue-500
                        dark:text-gray-400
                      "
                      title="Edit product"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="
                        rounded-lg p-2 text-gray-500
                        transition hover:bg-red-500/10
                        hover:text-red-500
                        dark:text-gray-400
                      "
                      title="Delete product"
                    >
                      <Trash2 size={16} />
                    </button>

                    <button
                      type="button"
                      className="
                        rounded-lg p-2 text-gray-500
                        transition hover:bg-gray-100
                        dark:text-gray-400 dark:hover:bg-white/10
                      "
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 p-3 md:hidden">
        {products.map((product) => (
          <div
            key={product._id}
            className="
              rounded-xl border border-gray-200 p-4
              dark:border-white/10
            "
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex h-11 w-11 shrink-0 items-center
                    justify-center overflow-hidden rounded-lg
                    bg-blue-500/10 text-blue-500
                  "
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package size={20} />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </h3>

                  <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                    {product.category || "No category"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-blue-500/10 hover:text-blue-500"
                >
                  <Edit size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  className="rounded-lg p-2 text-gray-500 hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <p className="mt-3 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
              {product.description || "No description"}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {product.price !== null && product.price !== undefined ? (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-white/10 dark:text-gray-300">
                  {product.currency || "INR"}{" "}
                  {Number(product.price).toLocaleString()}
                </span>
              ) : null}
              <AvailabilityBadge availability={product.availability} />
              <StatusBadge status={product.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AvailabilityBadge({ availability }) {
  const config = {
    in_stock: {
      label: "In Stock",
      className: "bg-green-500/10 text-green-600 dark:text-green-400",
    },

    out_of_stock: {
      label: "Out of Stock",
      className: "bg-red-500/10 text-red-600 dark:text-red-400",
    },

    pre_order: {
      label: "Pre Order",
      className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    },

    unavailable: {
      label: "Unavailable",
      className: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    },
  };

  const item = config[availability] || config.unavailable;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${item.className}`}
    >
      {item.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const active = status === "active";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
        active
          ? "bg-green-500/10 text-green-600 dark:text-green-400"
          : "bg-gray-500/10 text-gray-600 dark:text-gray-400"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

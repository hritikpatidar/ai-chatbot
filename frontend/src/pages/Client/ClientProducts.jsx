import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Package, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import ProductTable from "../../components/Admin/Product/ProductTable";
import ProductModal from "../../components/Admin/Product/ProductModal";
import ConfirmModal from "../../components/Admin/ConfirmModal";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../redux/features/Client/clientSlice";

export default function ClientProducts() {
  const dispatch = useDispatch();
  const {
    products = [],
    loading = false,
    error = "",
    client,
  } = useSelector((state) => state?.ClientReducer?.clientSlice || {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProductDetails, setDeleteProductDetails] = useState(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (client) {
      dispatch(getProducts(client?._id));
    }
  }, [dispatch, client]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) {
      return products;
    }
    const value = search.toLowerCase();
    return products.filter((product) => {
      return (
        product.name?.toLowerCase().includes(value) ||
        product.category?.toLowerCase().includes(value) ||
        product.description?.toLowerCase().includes(value)
      );
    });
  }, [products, search]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (loading) return;

    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSubmit = async (payload) => {
    try {
      if (selectedProduct) {
        await dispatch(
          updateProduct({
            productId: selectedProduct._id,
            data: payload,
          }),
        ).unwrap();
      } else {
        await dispatch(
          createProduct({
            clientId: client?._id,
            data: payload,
          }),
        ).unwrap();
      }

      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Product save error:", error);
    }
  };

  const handleDelete = (product) => {
    setDeleteProductDetails(product);
  };

  const handleConfirmDelete = async () => {
    if (!deleteProductDetails?._id) return;

    try {
      await dispatch(deleteProduct(deleteProductDetails._id)).unwrap();
      setDeleteProductDetails(null);
    } catch (error) {
      console.error("Product delete error:", error);
    }
  };

  const handleRefresh = () => {
    if (client) {
      dispatch(getProducts(client?._id));
    }
  };

  return (
    <div className="min-h-full w-full">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="
            flex flex-col gap-4
            lg:flex-row lg:items-center
            lg:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10 items-center
                  justify-center rounded-xl
                  bg-blue-500/10 text-blue-500
                "
              >
                <Package size={21} />
              </div>

              <div>
                <h1
                  className="
                    text-xl font-semibold
                    text-gray-900 dark:text-white
                  "
                >
                  Products
                </h1>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage your client product catalog
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddProduct}
            disabled={!client}
            className="
              flex items-center justify-center gap-2
              rounded-lg bg-blue-600 px-4 py-2.5
              text-sm font-medium text-white
              transition hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Plus size={17} />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatBox title="Total Products" value={products.length} />

          <StatBox
            title="In Stock"
            value={
              products.filter((item) => item.availability === "in_stock").length
            }
          />

          <StatBox
            title="Pre Order"
            value={
              products.filter((item) => item.availability === "pre_order")
                .length
            }
          />

          <StatBox
            title="Inactive"
            value={products.filter((item) => item.status !== "active").length}
          />
        </div>

        {/* Toolbar */}
        <div
          className="
            mt-6 flex flex-col gap-3
            rounded-xl border border-gray-200
            bg-white p-3
            sm:flex-row sm:items-center
            sm:justify-between
            dark:border-white/10
            dark:bg-[#171b23]
          "
        >
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={16}
              className="
                absolute left-3 top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="
                w-full rounded-lg border
                border-gray-200 bg-gray-50
                py-2.5 pl-9 pr-3 text-sm
                text-gray-900 outline-none
                transition
                focus:border-blue-500
                dark:border-white/10
                dark:bg-[#0f131a]
                dark:text-white
                dark:placeholder:text-gray-500
              "
            />
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="
              flex items-center justify-center gap-2
              rounded-lg border border-gray-200
              px-3 py-2.5 text-xs font-medium
              text-gray-600 transition
              hover:bg-gray-50
              disabled:opacity-50
              dark:border-white/10
              dark:text-gray-300
              dark:hover:bg-white/5
            "
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            className="
              mt-4 rounded-lg border
              border-red-200 bg-red-50
              px-4 py-3 text-sm text-red-600
              dark:border-red-500/20
              dark:bg-red-500/10
              dark:text-red-400
            "
          >
            {typeof error === "string"
              ? error
              : error?.message || "Something went wrong"}
          </div>
        )}

        {/* Product Table */}
        <div className="mt-4">
          <ProductTable
            products={filteredProducts}
            loading={loading}
            onEdit={handleEditProduct}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        product={selectedProduct}
        loading={loading}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteProductDetails)}
        title="Delete Product"
        message={
          <>
            Are you sure you want to delete{" "}
            <strong>{deleteProductDetails?.name}</strong>
            ?
            <br />
            <span className="text-xs">This action cannot be undone.</span>
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
        onCancel={() => setDeleteProductDetails(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

function StatBox({ title, value }) {
  return (
    <div
      className="
        rounded-xl border border-gray-200
        bg-white p-4
        dark:border-white/10
        dark:bg-[#171b23]
      "
    >
      <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>

      <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

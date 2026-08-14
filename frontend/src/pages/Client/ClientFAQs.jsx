import { useEffect, useMemo, useState } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  createFAQ,
  deleteFAQ,
  getFAQs,
  updateFAQ,
} from "../../redux/features/Client/clientSlice";

import FAQTable from "../../components/ClientComponent/FAQ/FAQTable";
import FAQModal from "../../components/ClientComponent/FAQ/FAQModal";
import ConfirmModal from "../../components/ClientComponent/ConfirmModal";

export default function ClientFAQs() {
  const dispatch = useDispatch();

  const {
    client,
    faqs = [],
    faqLoading = false,
    faqError = null,
  } = useSelector((state) => state?.ClientReducer?.clientSlice || {});

  const [search, setSearch] = useState("");

  // IMPORTANT: default false
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [deleteFAQDetails, setDeleteFAQDetails] = useState(null);

  // ============================================
  // Fetch FAQs
  // ============================================

  const fetchFAQs = () => {
    if (!client?.businessId) return;

    dispatch(getFAQs(client.businessId));
  };

  useEffect(() => {
    fetchFAQs();
  }, [client?.businessId]);

  // ============================================
  // Search
  // ============================================

  const filteredFAQs = useMemo(() => {
    if (!search.trim()) {
      return faqs;
    }

    const searchText = search.toLowerCase();

    return faqs.filter((faq) => {
      return (
        faq?.question?.toLowerCase().includes(searchText) ||
        faq?.answer?.toLowerCase().includes(searchText) ||
        faq?.category?.toLowerCase().includes(searchText) ||
        faq?.keywords?.some((keyword) =>
          keyword?.toLowerCase().includes(searchText),
        )
      );
    });
  }, [faqs, search]);

  // ============================================
  // ADD FAQ
  // ============================================

  const handleAddFAQ = () => {
    setSelectedFAQ(null);
    setIsModalOpen(true);
  };

  // ============================================
  // EDIT FAQ
  // ============================================

  const handleEditFAQ = (faq) => {
    setSelectedFAQ(faq);
    setIsModalOpen(true);
  };

  // ============================================
  // CLOSE MODAL
  // ============================================

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFAQ(null);
  };

  // ============================================
  // CREATE / UPDATE
  // ============================================

  const handleSubmitFAQ = async (formData) => {
    if (!client?.businessId) return;

    try {
      if (selectedFAQ?._id) {
        await dispatch(
          updateFAQ({
            faqId: selectedFAQ._id,
            payload: formData,
          }),
        ).unwrap();
      } else {
        await dispatch(
          createFAQ({
            clientId: client.businessId,
            payload: formData,
          }),
        ).unwrap();
      }

      handleCloseModal();
    } catch (error) {
      console.error("FAQ save failed:", error);
    }
  };

  // ============================================
  // DELETE
  // ============================================

  const handleDeleteFAQ = async (faq) => {
    setDeleteFAQDetails(faq);
  };

  const handleConfirmDelete = async () => {
    if (!deleteFAQDetails?._id) return;

    try {
      await dispatch(deleteFAQ(deleteFAQDetails._id)).unwrap();
      setDeleteFAQDetails(null);
    } catch (error) {
      console.error("FAQ delete error:", error);
    }
  };

  // ============================================
  // Stats
  // ============================================

  const totalFAQs = faqs.length;

  const activeFAQs = faqs.filter((faq) => faq?.status === "active").length;

  const categoryCount = new Set(
    faqs.map((faq) => faq?.category).filter(Boolean),
  ).size;

  return (
    <div className="min-h-full w-full bg-transparent px-4 py-5 text-gray-900 transition-colors duration-300 sm:px-6 sm:py-6 lg:px-8 dark:text-white">
      <div className="mx-auto w-full max-w-7xl">
        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              FAQs
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage frequently asked questions for your client.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* REFRESH */}
            <button
              type="button"
              onClick={fetchFAQs}
              disabled={faqLoading || !client?.businessId}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-gray-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:border-blue-500
                hover:text-blue-600
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-white/10
                dark:bg-[#171b23]
                dark:text-gray-200
              "
            >
              <RefreshCw
                size={16}
                className={faqLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            {/* ADD FAQ */}
            <button
              type="button"
              onClick={handleAddFAQ}
              disabled={!client?.businessId}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Plus size={17} />
              Add FAQ
            </button>
          </div>
        </div>

        {/* NO CLIENT */}
        {!client?.businessId && (
          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700 dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-400">
            Please select a client before managing FAQs.
          </div>
        )}

        {/* ERROR */}
        {faqError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {typeof faqError === "string"
              ? faqError
              : faqError?.message || "Something went wrong."}
          </div>
        )}

        {/* STATS */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#171b23]">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total FAQs
            </p>

            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {totalFAQs}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#171b23]">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active FAQs
            </p>

            <p className="mt-2 text-2xl font-semibold text-green-600 dark:text-green-400">
              {activeFAQs}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#171b23]">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Categories
            </p>

            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {categoryCount}
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search FAQs..."
              className="
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                py-2.5
                pl-10
                pr-4
                text-sm
                text-gray-900
                outline-none
                focus:border-blue-500
                dark:border-white/10
                dark:bg-[#171b23]
                dark:text-white
              "
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing {filteredFAQs.length} of {faqs.length} FAQs
          </p>
        </div>

        {/* TABLE */}
        <div className="mt-4">
          <FAQTable
            faqs={filteredFAQs}
            loading={faqLoading}
            onEdit={handleEditFAQ}
            onDelete={handleDeleteFAQ}
          />
        </div>
      </div>

      {/* MODAL */}
      <FAQModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        faq={selectedFAQ}
        onSubmit={handleSubmitFAQ}
        loading={faqLoading}
      />

      <ConfirmModal
        isOpen={Boolean(deleteFAQDetails)}
        title="Delete FAQ"
        message={
          <>
            Are you sure you want to delete{" "}
            <strong>{deleteFAQDetails?.name}</strong>
            ?
            <br />
            <span className="text-xs">This action cannot be undone.</span>
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={faqLoading}
        onCancel={() => setDeleteFAQDetails(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

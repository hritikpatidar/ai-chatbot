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

export default function ClientFAQs() {
  const dispatch = useDispatch();
  const { client, faqs, loading, error } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);

  const fetchFAQs = () => {
    if (!client) return;

    dispatch(getFAQs(client?._id));
  };

  useEffect(() => {
    fetchFAQs();
  }, [client]);

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

  const handleAddFAQ = () => {
    setSelectedFAQ(null);
    setIsModalOpen(true);
  };

  const handleEditFAQ = (faq) => {
    setSelectedFAQ(faq);
    setIsModalOpen(true);
  };

  const handleSubmitFAQ = async (formData) => {
    if (!client) {
      return;
    }

    try {
      if (selectedFAQ?._id) {
        await dispatch(
          updateFAQ({
            faqId: selectedFAQ._id,
            data: formData,
          }),
        ).unwrap();
      } else {
        await dispatch(
          createFAQ({
            client: client?._id,
            data: formData,
          }),
        ).unwrap();
      }

      setIsModalOpen(false);
      setSelectedFAQ(null);
      dispatch(getFAQs(client?._id));
    } catch (error) {
      console.error("FAQ save failed:", error);
    }
  };

  const handleDeleteFAQ = async (faq) => {
    if (!faq?._id) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete "${faq.question}"?`,
    );

    if (!confirmed) return;
    try {
      await dispatch(deleteFAQ(faq._id)).unwrap();
      dispatch(getAdminFAQs(client?._id));
    } catch (error) {
      console.error("FAQ delete failed:", error);
    }
  };

  return (
    <div className="min-h-full w-full bg-transparent px-4 py-5 sm:px-6 lg:px-8 text-gray-900 transition-colors duration-300 sm:py-6 dark:text-white">
      <div className="mx-auto w-full max-w-7xl">
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
            <button
              type="button"
              onClick={fetchFAQs}
              disabled={loading}
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
                dark:hover:border-blue-500
                dark:hover:text-blue-400
              "
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleAddFAQ}
              disabled={!client?._id}
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
                dark:bg-blue-600
                dark:hover:bg-blue-700
              "
            >
              <Plus size={17} />
              Add FAQ
            </button>
          </div>
        </div>

        {!client && (
          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700 dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-400">
            Please select a client before managing FAQs.
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {typeof error === "string"
              ? error
              : error?.message || "Something went wrong."}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-4
              dark:border-white/10
              dark:bg-[#171b23]
            "
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total FAQs
            </p>

            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {faqs.length}
            </p>
          </div>

          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-4
              dark:border-white/10
              dark:bg-[#171b23]
            "
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active FAQs
            </p>

            <p className="mt-2 text-2xl font-semibold text-green-600 dark:text-green-400">
              {faqs.filter((faq) => faq?.status === "active").length}
            </p>
          </div>

          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-4
              dark:border-white/10
              dark:bg-[#171b23]
            "
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Categories
            </p>

            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {new Set(faqs.map((faq) => faq?.category).filter(Boolean)).size}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                dark:text-gray-500
              "
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
                transition
                placeholder:text-gray-400
                focus:border-blue-500
                dark:border-white/10
                dark:bg-[#171b23]
                dark:text-white
                dark:placeholder:text-gray-500
              "
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing {filteredFAQs.length} of {faqs.length} FAQs
          </p>
        </div>

        <div className="mt-4">
          <FAQTable
            faqs={filteredFAQs}
            loading={loading}
            onEdit={handleEditFAQ}
            onDelete={handleDeleteFAQ}
          />
        </div>
      </div>

      <FAQModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFAQ(null);
        }}
        faq={selectedFAQ}
        onSubmit={handleSubmitFAQ}
        loading={loading}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { Plus, Search, MessageCircleQuestion, RefreshCw } from "lucide-react";

import FAQTable from "../../components/ClientComponent/FAQ/FAQTable";
import FAQModal from "../../components/ClientComponent/FAQ/FAQModal";
import ConfirmModal from "../../components/ClientComponent/ConfirmModal";
import Pagination from "../../components/common/Pagination";

import useFAQs from "../../hooks/Client/useFAQs";
import { useSelector } from "react-redux";

export default function ClientFAQs() {
  const [page, setPage] = useState(1);

  const [limit] = useState(5);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedFAQ, setSelectedFAQ] = useState(null);

  const [deleteFAQDetails, setDeleteFAQDetails] = useState(null);

  const { client } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );
  const {
    faqs,
    pagination,

    isLoading,
    isFetching,
    error,

    refetch,

    createFAQ,
    updateFAQ,
    deleteFAQ,

    createLoading,
    updateLoading,
    deleteLoading,
  } = useFAQs({
    clientId: client?.businessId,
    page,
    limit,
    search,
  });

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (e) => {
    setSearch(e.target.value);

    // Search change hone par first page
    setPage(1);
  };

  /* =========================================================
     ADD
  ========================================================= */

  const handleAddFAQ = () => {
    setSelectedFAQ(null);
    setIsModalOpen(true);
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEditFAQ = (faq) => {
    setSelectedFAQ(faq);
    setIsModalOpen(true);
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const handleCloseModal = () => {
    if (createLoading || updateLoading) {
      return;
    }

    setIsModalOpen(false);
    setSelectedFAQ(null);
  };

  /* =========================================================
     CREATE / UPDATE
  ========================================================= */

  const handleSubmit = async (payload) => {
    try {
      if (selectedFAQ) {
        // UPDATE
        await updateFAQ({
          faqId: selectedFAQ._id,
          payload,
        });
      } else {
        // CREATE
        await createFAQ({
          clientId: client?.businessId,
          payload,
        });
      }

      setIsModalOpen(false);
      setSelectedFAQ(null);
    } catch (error) {
      console.error("FAQ save error:", error);
    }
  };

  /* =========================================================
     DELETE CLICK
  ========================================================= */

  const handleDelete = (faq) => {
    setDeleteFAQDetails(faq);
  };

  /* =========================================================
     DELETE CONFIRM
  ========================================================= */

  const handleConfirmDelete = async () => {
    if (!deleteFAQDetails?._id) {
      return;
    }

    try {
      await deleteFAQ(deleteFAQDetails._id);

      setDeleteFAQDetails(null);

      /*
        Agar last item delete hua aur current page
        empty ho gaya to previous page par jao.
      */

      if (faqs.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error("FAQ delete error:", error);
    }
  };

  /* =========================================================
     PREVIOUS
  ========================================================= */

  const handlePreviousPage = () => {
    if (page > 1 && !isFetching) {
      setPage((prev) => prev - 1);
    }
  };

  /* =========================================================
     NEXT
  ========================================================= */

  const handleNextPage = () => {
    if (page < pagination.totalPages && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  /* =========================================================
     REFRESH
  ========================================================= */

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-full w-full">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
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
                <MessageCircleQuestion size={21} />
              </div>

              <div>
                <h1
                  className="
                    text-xl font-semibold
                    text-gray-900
                    dark:text-white
                  "
                >
                  FAQs
                </h1>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage frequently asked questions
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddFAQ}
            disabled={!client}
            className="
              flex items-center justify-center gap-2
              rounded-lg bg-blue-600
              px-4 py-2.5
              text-sm font-medium text-white
              transition hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Plus size={17} />
            Add FAQ
          </button>
        </div>

        {/* =================================================
            STATS
        ================================================= */}

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatBox title="Total FAQs" value={pagination.total} />

          <StatBox title="Current Page" value={pagination.page} />

          <StatBox title="Total Pages" value={pagination.totalPages} />

          <StatBox title="Showing" value={faqs.length} />
        </div>

        {/* =================================================
            TOOLBAR
        ================================================= */}

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
              onChange={handleSearch}
              placeholder="Search FAQs..."
              className="
                w-full rounded-lg border
                border-gray-200 bg-gray-50
                py-2.5 pl-9 pr-3 text-sm
                text-gray-900 outline-none
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
            disabled={isFetching}
            className="
              flex items-center justify-center gap-2
              rounded-lg border border-gray-200
              px-3 py-2.5
              text-xs font-medium
              text-gray-600
              hover:bg-gray-50
              disabled:opacity-50
              dark:border-white/10
              dark:text-gray-300
              dark:hover:bg-white/5
            "
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              mt-4 rounded-lg border
              border-red-200 bg-red-50
              px-4 py-3 text-sm
              text-red-600
              dark:border-red-500/20
              dark:bg-red-500/10
              dark:text-red-400
            "
          >
            {error?.message || "Something went wrong"}
          </div>
        )}

        {/* =================================================
            TABLE
        ================================================= */}

        <div className="mt-4">
          <FAQTable
            faqs={faqs}
            loading={isLoading}
            onEdit={handleEditFAQ}
            onDelete={handleDelete}
          />
        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          currentCount={faqs.length}
          isFetching={isFetching}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
        />
      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      <FAQModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        faq={selectedFAQ}
        loading={createLoading || updateLoading}
      />

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      <ConfirmModal
        isOpen={Boolean(deleteFAQDetails)}
        title="Delete FAQ"
        message={
          <>
            Are you sure you want to delete{" "}
            <strong>{deleteFAQDetails?.question}</strong>
            ?
            <br />
            <span className="text-xs">This action cannot be undone.</span>
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        onCancel={() => setDeleteFAQDetails(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

/* =========================================================
   STAT BOX
========================================================= */

function StatBox({ title, value }) {
  return (
    <div
      className="
        rounded-xl border
        border-gray-200
        bg-white p-4
        dark:border-white/10
        dark:bg-[#171b23]
      "
    >
      <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>

      <p
        className="
          mt-2 text-xl font-semibold
          text-gray-900
          dark:text-white
        "
      >
        {value}
      </p>
    </div>
  );
}

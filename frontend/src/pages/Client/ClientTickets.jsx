import { useEffect, useState } from "react";

import { Plus, RefreshCw, Search } from "lucide-react";

import TicketTable from "../../components/ClientComponent/Ticket/TicketTable";
import TicketModal from "../../components/ClientComponent/Ticket/TicketModal";
import ConfirmModal from "../../components/ClientComponent/ConfirmModal";
import Pagination from "../../components/common/Pagination";

import useClientTickets from "../../hooks/Client/useClientTickets";
import CustomSelect from "../../components/common/CustomSelect";

export default function ClientTickets() {
  /* =========================================================
     PAGINATION
  ========================================================= */

  const [page, setPage] = useState(1);

  const [limit] = useState(10);

  /* =========================================================
     FILTERS
  ========================================================= */

  const [status, setStatus] = useState("");

  const [priority, setPriority] = useState("");

  const [search, setSearch] = useState("");

  /* =========================================================
     MODALS
  ========================================================= */

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState(null);

  const [deleteTicketDetails, setDeleteTicketDetails] = useState(null);

  /* =========================================================
     REACT QUERY
  ========================================================= */

  const {
    tickets,
    pagination,

    isLoading,
    isFetching,
    error,

    refetch,

    updateTicket,
    updateLoading,

    deleteTicket,
    deleteLoading,

    mutationLoading,
  } = useClientTickets({
    page,
    limit,
    status,
    priority,
  });

  /* =========================================================
     RESET PAGE WHEN FILTER CHANGES
  ========================================================= */

  useEffect(() => {
    setPage(1);
  }, [status, priority]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredTickets = tickets.filter((ticket) => {
    if (!search.trim()) {
      return true;
    }

    const value = search.toLowerCase().trim();

    return (
      ticket.subject?.toLowerCase().includes(value) ||
      ticket.description?.toLowerCase().includes(value) ||
      ticket.category?.toLowerCase().includes(value) ||
      ticket._id?.toLowerCase().includes(value)
    );
  });

  /* =========================================================
     ADD TICKET
  ========================================================= */

  const handleAddTicket = () => {
    setSelectedTicket(null);
    setIsModalOpen(true);
  };

  /* =========================================================
     EDIT TICKET
  ========================================================= */

  const handleEditTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const handleCloseModal = () => {
    if (updateLoading) {
      return;
    }

    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  /* =========================================================
     UPDATE TICKET
  ========================================================= */

  const handleSubmit = async (payload) => {
    if (!selectedTicket?._id) {
      return;
    }

    try {
      await updateTicket({
        ticketId: selectedTicket._id,
        payload,
      });

      setIsModalOpen(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error("Ticket update error:", error);
    }
  };

  /* =========================================================
     DELETE CLICK
  ========================================================= */

  const handleDeleteTicket = (ticket) => {
    setDeleteTicketDetails(ticket);
  };

  /* =========================================================
     CONFIRM DELETE
  ========================================================= */

  const handleConfirmDelete = async () => {
    if (!deleteTicketDetails?._id) {
      return;
    }

    try {
      await deleteTicket(deleteTicketDetails._id);

      setDeleteTicketDetails(null);

      /*
       * Agar current page ka last ticket delete ho gaya
       * aur page empty hone wala hai to previous page par
       * move karenge.
       */

      if (tickets.length === 1 && page > 1) {
        setPage((previousPage) => previousPage - 1);
      }
    } catch (error) {
      console.error("Ticket delete error:", error);
    }
  };

  /* =========================================================
     PREVIOUS PAGE
  ========================================================= */

  const handlePreviousPage = () => {
    if (page <= 1 || isFetching) {
      return;
    }

    setPage((previousPage) => previousPage - 1);
  };

  /* =========================================================
     NEXT PAGE
  ========================================================= */

  const handleNextPage = () => {
    if (page >= pagination.totalPages || isFetching) {
      return;
    }

    setPage((previousPage) => previousPage + 1);
  };

  /* =========================================================
     REFRESH
  ========================================================= */

  const handleRefresh = async () => {
    await refetch();
  };

  /* =========================================================
     STATUS FILTER
  ========================================================= */

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  /* =========================================================
     PRIORITY FILTER
  ========================================================= */

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  /* =========================================================
     ERROR
  ========================================================= */

  const errorMessage =
    error?.message || "Something went wrong while fetching tickets.";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-full w-full">
      <div
        className="
            flex
            flex-col
            gap-4
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
      >
        <div>
          <h1
            className="
                text-xl
                font-semibold
                text-gray-900
                dark:text-white
              "
          >
            Support Tickets
          </h1>

          <p
            className="
                mt-1
                text-xs
                text-gray-500
                dark:text-gray-400
              "
          >
            Manage your support tickets
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddTicket}
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
            "
        >
          <Plus size={17} />
          Create Ticket
        </button>
      </div>

      <div
        className="
            mt-6
            flex flex-col gap-3
            rounded-xl
            border border-gray-200
            bg-white p-3
            sm:flex-row
            sm:items-center
            sm:justify-between
            dark:border-white/10
            dark:bg-[#171b23]
          "
      >
        {/* Search */}
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
            placeholder="Search tickets..."
            className="
                w-full
                rounded-lg
                border border-gray-200
                bg-gray-50
                py-2.5
                pl-9
                pr-3
                text-sm
                text-gray-900
                outline-none
                transition
                focus:border-blue-500
                dark:border-white/10
                dark:bg-[#0f131a]
                dark:text-white
                dark:placeholder:text-gray-500
              "
          />
        </div>

        {/* Filters + Refresh */}
        <div
          className="
              flex
              w-full
              flex-col
              gap-2
              sm:w-auto
              sm:flex-row
              sm:items-center
            "
        >
          <CustomSelect
            size="sm"
            rounded="rounded-lg"
            value={status}
            onChange={handleStatusChange}
            placeholder="All Status"
            options={[
              { value: "", label: "All Status" },
              { value: "open", label: "Open" },
              { value: "in_progress", label: "In Progress" },
              { value: "resolved", label: "Resolved" },
              { value: "closed", label: "Closed" },
            ]}
            className="
                w-full
                sm:w-auto
                dark:border-white/10
                dark:bg-[#0f131a]
                dark:text-gray-300
              "
          />

          {/* Priority */}
          {/* <select
              value={priority}
              onChange={handlePriorityChange}
              className="
                w-full
                rounded-lg
                border border-gray-200
                bg-gray-50
                px-3
                py-2.5
                text-sm
                text-gray-700
                outline-none
                transition
                focus:border-blue-500
                sm:w-auto
                dark:border-white/10
                dark:bg-[#0f131a]
                dark:text-gray-300
              "
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select> */}
          <CustomSelect
            size="sm"
            rounded="rounded-lg"
            value={priority}
            onChange={handlePriorityChange}
            placeholder="All Priority"
            options={[
              { value: "", label: "All Priority" },
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "urgent", label: "Urgent" },
            ]}
            className="
                w-full
                sm:w-auto
                dark:border-white/10
                dark:bg-[#0f131a]
                dark:text-gray-300
              "
          />

          {/* Refresh */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                border border-gray-200
                px-3
                py-2.5
                text-xs
                font-medium
                text-gray-600
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-auto
                dark:border-white/10
                dark:text-gray-300
                dark:hover:bg-white/5
              "
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div
          className="
              mt-4
              rounded-lg
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
              dark:border-red-500/20
              dark:bg-red-500/10
              dark:text-red-400
            "
        >
          {errorMessage}
        </div>
      )}

      {/* ===================================================
            TABLE
        =================================================== */}

      <div className="mt-4">
        <TicketTable
          tickets={filteredTickets}
          loading={isLoading && !tickets.length}
          onEdit={handleEditTicket}
          onDelete={handleDeleteTicket}
        />
      </div>

      {/* ===================================================
            PAGINATION
        =================================================== */}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        currentCount={filteredTickets.length}
        isFetching={isFetching}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
      />

      {/* =====================================================
          EDIT TICKET MODAL
      ===================================================== */}

      <TicketModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        ticket={selectedTicket}
        loading={updateLoading}
      />

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      <ConfirmModal
        isOpen={Boolean(deleteTicketDetails)}
        title="Delete Ticket"
        message={
          <>
            Are you sure you want to delete{" "}
            <strong>{deleteTicketDetails?.subject || "this ticket"}</strong>
            ?
            <br />
            <span className="text-xs">This action cannot be undone.</span>
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteTicketDetails(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

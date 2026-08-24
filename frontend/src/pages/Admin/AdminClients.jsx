import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  Plus,
  X,
} from "lucide-react";

import AdminClientTable from "../../components/AdminComponent/AdminClientTable";
import AdminConfirmModal from "../../components/AdminComponent/AdminConfirmModal";
import AdminAddClientModal from "../../components/AdminComponent/AdminAddClientModal";
import Pagination from "../../components/common/Pagination";

import CustomSelect from "../../components/common/CustomSelect";
import { useNavigate } from "react-router-dom";
import {
  useAdminClients,
  useDeleteAdminClient,
} from "../../hooks/Admin/useAdminClients";

export default function AdminClient() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [selectedClient, setSelectedClient] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  const { clients, pagination, isLoading, isFetching, error, refetch } =
    useAdminClients({
      page,
      limit,
      search: searchValue,
      status: statusFilter === "all" ? "" : statusFilter,
    });

  const { mutateAsync: deleteClient, isPending: deleteLoading } =
    useDeleteAdminClient();

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedSearch = search.trim();

      setPage(1);
      setSearchValue(trimmedSearch);
    }, 2000);

    return () => clearTimeout(timer);
  }, [search]);

  const totalClients = pagination?.total || 0;

  const activeClients = clients.filter(
    (client) => client?.status === "active",
  ).length;

  const inactiveClients = clients.filter(
    (client) => client?.status === "inactive",
  ).length;

  const handleRefresh = () => {
    refetch();
  };

  const handlePrevious = () => {
    if (page <= 1 || isFetching) return;

    setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page >= (pagination?.totalPages || 0) || isFetching) {
      return;
    }

    setPage((prev) => prev + 1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchValue("");
    setPage(1);
  };

  const handleView = (client) => {
    console.log("View client:", client);
    navigate(`/admin/clients/${client._id}`);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setIsAddClientOpen(true);
  };

  const handleDelete = (client) => {
    setSelectedClient(client);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedClient?._id) return;

    try {
      await deleteClient(selectedClient._id);

      setIsConfirmOpen(false);
      setSelectedClient(null);

      if (clients.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await refetch();
      }
    } catch (error) {
      console.error("Delete client failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Clients
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and monitor all registered clients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#11151d] dark:text-gray-300 dark:hover:bg-white/5"
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedClient(null);
              setIsAddClientOpen(true);
            }}
            className="flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={15} />
            Add Client
          </button>
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Clients"
          value={totalClients}
          icon={Users}
          description="All registered clients"
        />

        <StatCard
          title="Active Clients"
          value={activeClients}
          icon={UserCheck}
          description="Currently active accounts"
        />

        <StatCard
          title="Inactive Clients"
          value={inactiveClients}
          icon={UserX}
          description="Inactive accounts"
        />
      </div>

      {/* FILTERS */}

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row dark:border-white/10 dark:bg-[#11151d]">
        <div className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 dark:border-white/10 dark:bg-white/3">
          <Search size={16} className="shrink-0 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search clients..."
            className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
          />

          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              disabled={isFetching}
              aria-label="Clear search"
              title="Clear search"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <CustomSelect
          size="sm"
          rounded="rounded-lg"
          value={statusFilter}
          onChange={handleStatusChange}
          placeholder="All Status"
          options={[
            {
              value: "all",
              label: "All Status",
            },
            {
              value: "active",
              label: "Active",
            },
            {
              value: "inactive",
              label: "Inactive",
            },
          ]}
          className="w-full sm:w-auto dark:border-white/10 dark:bg-[#0f131a] dark:text-gray-300"
        />
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error.message || "Failed to load clients."}
        </div>
      )}

      {/* TABLE */}

      <AdminClientTable
        clients={clients}
        pagination={pagination}
        loading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* PAGINATION */}

      <Pagination
        page={pagination?.page || page}
        totalPages={pagination?.totalPages || 0}
        total={pagination?.total || 0}
        currentCount={clients.length}
        isFetching={isFetching}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      {/* ADD CLIENT */}

      <AdminAddClientModal
        isOpen={isAddClientOpen}
        client={selectedClient}
        onClose={() => {
          setIsAddClientOpen(false);
          setSelectedClient(null);
        }}
        isEdit={Boolean(selectedClient)}
        onSuccess={() => {
          setIsAddClientOpen(false);
          setSelectedClient(null);
          setPage(1);
          refetch();
        }}
      />

      {/* DELETE MODAL */}

      <AdminConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          if (!deleteLoading) {
            setIsConfirmOpen(false);
            setSelectedClient(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Delete Client?"
        message={`Are you sure you want to delete ${
          selectedClient?.fullName || "this client"
        }? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}

const StatCard = ({ title, value, icon: Icon, description }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#11151d]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </h2>

          <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
};

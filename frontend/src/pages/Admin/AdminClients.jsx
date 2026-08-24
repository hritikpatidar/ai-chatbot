import React, { useMemo, useState } from "react";
import { Users, UserCheck, UserX, Search, RefreshCw, Plus } from "lucide-react";

import AdminClientTable from "../../components/AdminComponent/AdminClientTable";
import AdminConfirmModal from "../../components/AdminComponent/AdminConfirmModal";
import AdminAddClientModal from "../../components/AdminComponent/AdminAddClientModal";

export default function AdminClient() {
  const [clients, setClients] = useState([
    {
      _id: "1",
      fullName: "Fresh Basket",
      email: "admin@freshbasket.com",
      businessName: "Fresh Basket Grocery",
      accountStatus: "active",
      createdAt: "2026-08-10T10:00:00.000Z",
      lastLogin: "2026-08-22T08:30:00.000Z",
      profileImage: "",
    },
    {
      _id: "2",
      fullName: "Tech Store",
      email: "admin@techstore.com",
      businessName: "Tech Store",
      accountStatus: "inactive",
      createdAt: "2026-08-05T10:00:00.000Z",
      lastLogin: "2026-08-18T12:30:00.000Z",
      profileImage: "",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedClient, setSelectedClient] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [addClientLoading, setAddClientLoading] = useState(false);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        client?.fullName?.toLowerCase().includes(searchText) ||
        client?.email?.toLowerCase().includes(searchText) ||
        client?.businessName?.toLowerCase().includes(searchText);

      const isActive = client?.accountStatus === "active";

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);

      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const totalClients = clients.length;

  const activeClients = clients.filter(
    (client) => client?.accountStatus === "active",
  ).length;

  const inactiveClients = totalClients - activeClients;

  const handleView = (client) => {
    console.log("View client:", client);

    // Later:
    // navigate(`/admin/clients/${client._id}`);
  };

  const handleEdit = (client) => {
    console.log("Edit client:", client);
  };

  const handleDelete = (client) => {
    setSelectedClient(client);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedClient) return;

    try {
      setDeleteLoading(true);

      // API call yaha lagegi
      // await deleteClient(selectedClient._id);

      setClients((prev) =>
        prev.filter((client) => client._id !== selectedClient._id),
      );

      setIsConfirmOpen(false);
      setSelectedClient(null);
    } catch (error) {
      console.error("Delete client failed:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="
          flex
          flex-col
          justify-between
          gap-4
          sm:flex-row
          sm:items-center
        "
      >
        <div>
          <h1
            className="
              text-xl
              font-bold
              text-gray-900
              dark:text-white
            "
          >
            Clients
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Manage and monitor all registered clients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="
              flex
              h-10
              items-center
              gap-2
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3
              text-xs
              font-medium
              text-gray-600
              transition
              hover:bg-gray-50
              dark:border-white/10
              dark:bg-[#11151d]
              dark:text-gray-300
              dark:hover:bg-white/5
            "
          >
            <RefreshCw size={15} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setIsAddClientOpen(true)}
            className="
    flex
    h-10
    items-center
    gap-2
    rounded-lg
    bg-blue-600
    px-3.5
    text-xs
    font-semibold
    text-white
    transition
    hover:bg-blue-700
  "
          >
            <Plus size={15} />
            Add Client
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
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

      {/* Filters */}
      <div
        className="
          flex
          flex-col
          gap-3
          rounded-xl
          border
          border-gray-200
          bg-white
          p-4
          sm:flex-row
          dark:border-white/10
          dark:bg-[#11151d]
        "
      >
        {/* Search */}
        <div
          className="
            flex
            h-10
            flex-1
            items-center
            gap-2
            rounded-lg
            border
            border-gray-200
            bg-gray-50
            px-3
            dark:border-white/10
            dark:bg-white/3
          "
        >
          <Search size={16} className="text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search clients..."
            className="
              w-full
              bg-transparent
              text-sm
              text-gray-900
              outline-none
              placeholder:text-gray-400
              dark:text-white
            "
          />
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="
            h-10
            rounded-lg
            border
            border-gray-200
            bg-gray-50
            px-3
            text-xs
            text-gray-700
            outline-none
            dark:border-white/10
            dark:bg-[#171b23]
            dark:text-gray-300
          "
        >
          <option value="all">All Status</option>

          <option value="active">Active</option>

          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <AdminClientTable
        clients={filteredClients}
        loading={false}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AdminAddClientModal
        isOpen={isAddClientOpen}
        onClose={() => {
            setIsAddClientOpen(false);
        }}
      />

      {/* Delete Modal */}
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
    <div
      className="
        rounded-xl
        border
        border-gray-200
        bg-white
        p-5
        dark:border-white/10
        dark:bg-[#11151d]
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="
              text-xs
              font-medium
              text-gray-500
              dark:text-gray-400
            "
          >
            {title}
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-bold
              text-gray-900
              dark:text-white
            "
          >
            {value}
          </h2>

          <p
            className="
              mt-1
              text-[11px]
              text-gray-400
              dark:text-gray-500
            "
          >
            {description}
          </p>
        </div>

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            bg-blue-50
            text-blue-600
            dark:bg-blue-500/10
            dark:text-blue-400
          "
        >
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
};

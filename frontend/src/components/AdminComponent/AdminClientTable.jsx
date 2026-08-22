import React from "react";
import { MoreVertical, Eye, Pencil, Trash2, Users, Edit2 } from "lucide-react";

import AdminClientStatus from "./AdminClientStatus";
import ActionButton from "../common/ActionButton";

export default function AdminClientTable({
  clients = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div
        className="
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          dark:border-white/10
          dark:bg-[#11151d]
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-190">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                {[
                  "Client",
                  "Business",
                  "Status",
                  "Created",
                  "Last Active",
                  "Actions",
                ].map((item) => (
                  <th
                    key={item}
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wider
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5].map((item) => (
                <tr
                  key={item}
                  className="border-b border-gray-100 dark:border-white/5"
                >
                  {[1, 2, 3, 4, 5, 6].map((column) => (
                    <td key={column} className="px-5 py-4">
                      <div
                        className="
                          h-4
                          w-full
                          max-w-32
                          animate-pulse
                          rounded
                          bg-gray-200
                          dark:bg-white/10
                        "
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        dark:border-white/10
        dark:bg-[#11151d]
      "
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-white/10">
        <div>
          <h3
            className="
              text-sm
              font-semibold
              text-gray-900
              dark:text-white
            "
          >
            Clients
          </h3>

          <p
            className="
              mt-0.5
              text-xs
              text-gray-500
              dark:text-gray-400
            "
          >
            Manage all registered clients
          </p>
        </div>

        <div
          className="
            flex
            items-center
            gap-1.5
            text-xs
            text-gray-500
            dark:text-gray-400
          "
        >
          <Users size={14} />
          {clients.length} Clients
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="py-12 text-center">
          <Users size={30} className="mx-auto text-gray-400" />

          <p
            className="
              mt-3
              text-sm
              font-medium
              text-gray-700
              dark:text-gray-300
            "
          >
            No clients found
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-190">
            <thead>
              <tr
                className="
                  border-b
                  border-gray-200
                  bg-gray-50/70
                  dark:border-white/10
                  dark:bg-white/2
                "
              >
                <th
                  className="
                    px-5
                    py-3.5
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Client
                </th>

                <th
                  className="
                    px-5
                    py-3.5
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Business
                </th>

                <th
                  className="
                    px-5
                    py-3.5
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Status
                </th>

                <th
                  className="
                    px-5
                    py-3.5
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Created
                </th>

                <th
                  className="
                    px-5
                    py-3.5
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Last Active
                </th>

                <th
                  className="
                    px-5
                    py-3.5
                    text-right
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => {
                const clientName =
                  client?.fullName || client?.name || "Unnamed Client";

                const businessName =
                  client?.businessName ||
                  client?.companyName ||
                  client?.businessId ||
                  "-";

                const email = client?.email || "-";

                const profileImage = client?.profileImage || "";

                const isActive =
                  client?.accountStatus === "active" ||
                  client?.status === "active" ||
                  client?.isActive === true;

                const createdDate = client?.createdAt
                  ? new Date(client.createdAt).toLocaleDateString()
                  : "-";

                const lastActive = client?.lastActiveAt
                  ? new Date(client.lastActiveAt).toLocaleString()
                  : client?.lastLogin
                    ? new Date(client.lastLogin).toLocaleString()
                    : "Never";

                return (
                  <tr
                    key={client?._id}
                    className="
                      border-b
                      border-gray-100
                      transition
                      last:border-0
                      hover:bg-gray-50
                      dark:border-white/5
                      dark:hover:bg-white/2
                    "
                  >
                    {/* Client */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={clientName}
                            className="
                              h-10
                              w-10
                              shrink-0
                              rounded-lg
                              object-cover
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-blue-100
                              text-sm
                              font-semibold
                              text-blue-600
                              dark:bg-blue-500/10
                              dark:text-blue-400
                            "
                          >
                            {clientName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p
                            className="
                              max-w-45
                              truncate
                              text-sm
                              font-semibold
                              text-gray-900
                              dark:text-white
                            "
                          >
                            {clientName}
                          </p>

                          <p
                            className="
                              max-w-50
                              truncate
                              text-xs
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            {email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Business */}
                    <td className="px-5 py-4">
                      <p
                        className="
                          max-w-40
                          truncate
                          text-sm
                          text-gray-700
                          dark:text-gray-300
                        "
                      >
                        {businessName}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <AdminClientStatus status={isActive} />
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4">
                      <span
                        className="
                          text-xs
                          text-gray-600
                          dark:text-gray-400
                        "
                      >
                        {createdDate}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td className="px-5 py-4">
                      <span
                        className="
                          text-xs
                          text-gray-600
                          dark:text-gray-400
                        "
                      >
                        {lastActive}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end">
                        <div className="flex shrink-0 gap-1">
                          <ActionButton
                            icon={<Eye size={14} />}
                            title="Edit"
                            onClick={() => onEdit?.(client)}
                          />
                          <ActionButton
                            icon={<Edit2 size={14} />}
                            title="Edit"
                            onClick={() => onEdit?.(client)}
                          />

                          <ActionButton
                            danger
                            icon={<Trash2 size={14} />}
                            title="Delete"
                            onClick={() => onDelete?.(client)}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

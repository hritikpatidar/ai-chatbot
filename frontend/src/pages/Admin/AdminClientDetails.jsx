import React from "react";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  Building2,
  User,
  ShieldCheck,
  MessageSquare,
  Package,
  Ticket,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import AdminClientStatus from "../../components/AdminComponent/AdminClientStatus";


export default function AdminClientDetails({ client: clientProp }) {
  const navigate = useNavigate();

  // API se client aane par prop use kar sakte ho.
  // Abhi demo data.
  const client = clientProp || {
    _id: "1",
    fullName: "Fresh Basket",
    email: "admin@freshbasket.com",
    businessName: "Fresh Basket Grocery",
    accountStatus: "active",
    createdAt: "2026-08-10T10:00:00.000Z",
    lastLogin: "2026-08-22T08:30:00.000Z",
    profileImage: "",
    phone: "+91 9876543210",
    plan: "Professional",
  };

  const createdAt = client?.createdAt
    ? new Date(client.createdAt).toLocaleDateString()
    : "-";

  const lastLogin = client?.lastLogin
    ? new Date(client.lastLogin).toLocaleString()
    : "Never";

  const initials =
    client?.fullName
      ?.split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CL";

  return (
    <div className="space-y-6">
      {/* Top */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/clients")}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            border
            border-gray-200
            text-gray-600
            transition
            hover:bg-gray-100
            dark:border-white/10
            dark:text-gray-300
            dark:hover:bg-white/5
          "
        >
          <ArrowLeft size={17} />
        </button>

        <div>
          <h1
            className="
              text-xl
              font-bold
              text-gray-900
              dark:text-white
            "
          >
            Client Details
          </h1>

          <p
            className="
              mt-1
              text-xs
              text-gray-500
              dark:text-gray-400
            "
          >
            View complete client information
          </p>
        </div>
      </div>

      {/* Profile Card */}
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
        <div
          className="
            h-24
            bg-linear-to-r
            from-blue-600
            to-indigo-600
          "
        />

        <div className="px-5 pb-5">
          <div className="-mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-3">
              {client?.profileImage ? (
                <img
                  src={client.profileImage}
                  alt={client.fullName}
                  className="
                    h-16
                    w-16
                    rounded-xl
                    border-4
                    border-white
                    object-cover
                    dark:border-[#11151d]
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-xl
                    border-4
                    border-white
                    bg-blue-100
                    text-lg
                    font-bold
                    text-blue-600
                    dark:border-[#11151d]
                    dark:bg-blue-500/10
                    dark:text-blue-400
                  "
                >
                  {initials}
                </div>
              )}

              <div className="pb-1">
                <h2
                  className="
                    text-lg
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  {client?.fullName}
                </h2>

                <p
                  className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  {client?.email}
                </p>
              </div>
            </div>

            <AdminClientStatus status={client?.accountStatus === "active"} />
          </div>
        </div>
      </div>

      {/* Information */}
      <div
        className="
          grid
          grid-cols-1
          gap-5
          lg:grid-cols-2
        "
      >
        <InfoCard title="Client Information">
          <InfoRow icon={User} label="Full Name" value={client?.fullName} />

          <InfoRow icon={Mail} label="Email" value={client?.email} />

          <InfoRow
            icon={Building2}
            label="Business"
            value={client?.businessName || "-"}
          />

          <InfoRow
            icon={ShieldCheck}
            label="Account Status"
            value={
              <AdminClientStatus status={client?.accountStatus === "active"} />
            }
          />
        </InfoCard>

        <InfoCard title="Account Activity">
          <InfoRow icon={Calendar} label="Created At" value={createdAt} />

          <InfoRow icon={Clock} label="Last Login" value={lastLogin} />

          <InfoRow
            icon={ShieldCheck}
            label="Plan"
            value={client?.plan || "Free"}
          />

          <InfoRow icon={Clock} label="Client ID" value={client?._id || "-"} />
        </InfoCard>
      </div>

      {/* Quick Stats */}
      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-3
        "
      >
        <QuickCard icon={MessageSquare} title="Conversations" value="0" />

        <QuickCard icon={Package} title="Products" value="0" />

        <QuickCard icon={Ticket} title="Tickets" value="0" />
      </div>
    </div>
  );
}

const InfoCard = ({ title, children }) => {
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
      <h3
        className="
          mb-4
          text-sm
          font-semibold
          text-gray-900
          dark:text-white
        "
      >
        {title}
      </h3>

      <div className="space-y-1">{children}</div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        border-b
        border-gray-100
        py-3
        last:border-0
        dark:border-white/5
      "
    >
      <div className="flex items-center gap-2.5">
        <Icon size={15} className="text-gray-400" />

        <span
          className="
            text-xs
            text-gray-500
            dark:text-gray-400
          "
        >
          {label}
        </span>
      </div>

      <div
        className="
          max-w-[55%]
          truncate
          text-right
          text-xs
          font-medium
          text-gray-700
          dark:text-gray-300
        "
      >
        {value}
      </div>
    </div>
  );
};

const QuickCard = ({ icon: Icon, title, value }) => {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-xl
        border
        border-gray-200
        bg-white
        p-5
        dark:border-white/10
        dark:bg-[#11151d]
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-blue-50
          text-blue-600
          dark:bg-blue-500/10
          dark:text-blue-400
        "
      >
        <Icon size={18} />
      </div>

      <div>
        <p
          className="
            text-xs
            text-gray-500
            dark:text-gray-400
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-lg
            font-bold
            text-gray-900
            dark:text-white
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
};

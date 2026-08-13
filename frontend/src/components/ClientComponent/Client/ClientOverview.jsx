import {
  Building2,
  Bot,
  HelpCircle,
  Package,
  Activity,
  KeyRound,
} from "lucide-react";

import { useSelector } from "react-redux";

export default function ClientOverview() {
  const { client, loading } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );

  const stats = [
    {
      title: "Products",
      value: client?.productCount ?? "—",
      icon: Package,
    },
    {
      title: "FAQs",
      value: client?.faqCount ?? "—",
      icon: HelpCircle,
    },
    {
      title: "Chatbot",
      value: client?.chatbot?.name || "AI Assistant",
      icon: Bot,
    },
    {
      title: "Status",
      value: client?.status || "active",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Business Header */}
      <div
        className="
          rounded-2xl border border-gray-200
          bg-white p-5 shadow-sm
          dark:border-white/10 dark:bg-[#171b23]
          sm:p-6
        "
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="
                flex h-14 w-14 shrink-0
                items-center justify-center
                rounded-2xl bg-blue-500/10
                text-blue-600 dark:text-blue-400
              "
            >
              <Building2 size={26} />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {client?.businessName || "Business Name"}
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {client?.businessType || "Business Type"}
              </p>

              {client?.businessDescription && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                  {client.businessDescription}
                </p>
              )}
            </div>
          </div>

          <span
            className={`
              inline-flex w-fit items-center rounded-full px-3 py-1
              text-xs font-medium
              ${
                client?.status === "active"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }
            `}
          >
            {client?.status || "active"}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                rounded-2xl
                border border-gray-200
                bg-white
                p-5
                shadow-sm
                dark:border-white/10
                dark:bg-[#171b23]
              "
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {item.title}
                  </p>

                  <h3
                    className="
                      mt-2
                      truncate
                      text-lg
                      font-semibold
                      capitalize
                      text-gray-900
                      dark:text-white
                    "
                    title={item.value}
                  >
                    {item.value}
                  </h3>
                </div>

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-400
                  "
                >
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Business Details */}
      <div
        className="
          rounded-2xl border border-gray-200
          bg-white p-5 shadow-sm
          dark:border-white/10 dark:bg-[#171b23]
          sm:p-6
        "
      >
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Business Information
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <InfoItem label="Business Name" value={client?.businessName} />

          <InfoItem label="Business Type" value={client?.businessType} />

          <InfoItem
            label="Client Key"
            value={client?.clientKey}
            icon={<KeyRound size={14} />}
          />

          <InfoItem label="Slug" value={client?.slug} />

          <InfoItem label="Chatbot Name" value={client?.chatbot?.name} />

          <InfoItem label="Language" value={client?.chatbot?.language} />

          <InfoItem label="Tone" value={client?.chatbot?.tone} />

          <InfoItem label="Status" value={client?.status} />
        </div>
      </div>

      {/* Welcome Message */}
      <div
        className="
          rounded-2xl border border-gray-200
          bg-white p-5 shadow-sm
          dark:border-white/10 dark:bg-[#171b23]
        "
      >
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-blue-500" />

          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Welcome Message
          </h2>
        </div>

        <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-700 dark:bg-white/5 dark:text-gray-300">
          {client?.chatbot?.welcomeMessage ||
            "Hi 👋 Welcome! How can I help you today?"}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <div className="mt-1 flex items-center gap-1.5">
        {icon}

        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

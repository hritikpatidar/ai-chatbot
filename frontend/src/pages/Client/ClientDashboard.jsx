import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Building2,
  Package,
  HelpCircle,
  Bot,
  ArrowRight,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import PageLoader from "../../components/common/PageLoader";
import { getClientById } from "../../redux/features/Client/clientSlice";
import StatCard from "../../components/ClientComponent/StatCard";
import ClientOverview from "../../components/ClientComponent/Client/ClientOverview";

export default function ClientDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { client, loading } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );
  const { profileDetails, refreshToken } = useSelector(
    (store) => store.authReducer.AuthSlice,
  );

  useEffect(() => {
    dispatch(getClientById(profileDetails?.clientId));
  }, [dispatch]);

  if (loading && !client) {
    return <PageLoader />;
  }

  const chatbot = client?.chatbot || {};

  return (
    <div className="min-h-full w-full bg-transparent text-gray-900 dark:text-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your client, products, FAQs and chatbot configuration.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/client/client-settings")}
            className="
              inline-flex items-center justify-center gap-2
              rounded-lg
              border border-gray-200
              bg-white
              px-4 py-2
              text-sm font-medium
              text-gray-700
              transition
              hover:border-blue-500
              hover:text-blue-600
              dark:border-white/10
              dark:bg-[#171b23]
              dark:text-gray-200
              dark:hover:border-blue-500
              dark:hover:text-blue-400
            "
          >
            <Settings size={16} />
            Settings
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Client"
            value={client?.businessName || "Not configured"}
            icon={Building2}
            description={client?.status || "inactive"}
          />

          <StatCard
            title="Products"
            value="Manage"
            icon={Package}
            description="Product catalogue"
            onClick={() => navigate("/client/products")}
          />

          <StatCard
            title="FAQs"
            value="Manage"
            icon={HelpCircle}
            description="Frequently asked questions"
            onClick={() => navigate("/client/faqs")}
          />

          <StatCard
            title="Chatbot"
            value={chatbot?.name || "AI Assistant"}
            icon={Bot}
            description={chatbot?.language || "English"}
          />
        </div>

        {/* Main Content */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Client Overview */}
          <div className="xl:col-span-2">
            <ClientOverview />
          </div>

          {/* Quick Actions */}
          <div
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
            <h2 className="text-base font-semibold">Quick Actions</h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Manage your chatbot data quickly.
            </p>

            <div className="mt-5 space-y-3">
              <QuickAction
                title="Manage Products"
                description="Add or update products"
                icon={Package}
                onClick={() => navigate("/client/products")}
              />

              <QuickAction
                title="Manage FAQs"
                description="Add or update FAQs"
                icon={HelpCircle}
                onClick={() => navigate("/client/faqs")}
              />

              <QuickAction
                title="Chatbot Settings"
                description="Configure your AI chatbot"
                icon={Bot}
                onClick={() => navigate("/client/chatbot-settings")}
              />

              <QuickAction
                title="Client Settings"
                description="Update business information"
                icon={Building2}
                onClick={() => navigate("/client/client-settings")}
              />
            </div>
          </div>
        </div>

        {/* Chatbot Information */}
        <div
          className="
            mt-6
            rounded-2xl
            border border-gray-200
            bg-white
            p-5
            shadow-sm
            dark:border-white/10
            dark:bg-[#171b23]
          "
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-blue-500" />

                <h2 className="text-base font-semibold">
                  Chatbot Configuration
                </h2>
              </div>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Current chatbot configuration for your client.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/client/chatbot-settings")}
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-blue-600
                hover:text-blue-700
                dark:text-blue-400
                dark:hover:text-blue-300
              "
            >
              Edit
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem
              label="Bot Name"
              value={chatbot?.name || "AI Assistant"}
            />
            <InfoItem label="Language" value={chatbot?.language || "English"} />
            <InfoItem label="Tone" value={chatbot?.tone || "Friendly"} />
            <InfoItem label="Status" value={client?.status || "inactive"} />
          </div>

          {chatbot?.welcomeMessage && (
            <div
              className="
                mt-4
                rounded-xl
                bg-gray-50
                p-4
                dark:bg-[#0f131b]
              "
            >
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Welcome Message
              </p>

              <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                {chatbot.welcomeMessage}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ title, description, icon: Icon, onClick }) {
  return (
    <motion.button
      type="button"
      whileHover={{ x: 3 }}
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        border
        border-gray-200
        bg-gray-50
        p-3
        text-left
        transition
        hover:border-blue-500
        hover:bg-blue-50
        dark:border-white/10
        dark:bg-[#0f131b]
        dark:hover:border-blue-500
        dark:hover:bg-blue-500/5
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-blue-500/10
          text-blue-600
          dark:text-blue-400
        "
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      <ArrowRight size={15} className="shrink-0 text-gray-400" />
    </motion.button>
  );
}

function InfoItem({ label, value }) {
  return (
    <div
      className="
        rounded-xl
        border
        border-gray-200
        bg-gray-50
        p-4
        dark:border-white/10
        dark:bg-[#0f131b]
      "
    >
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>

      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
}

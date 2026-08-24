import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Bot,
  User,
  ShieldCheck,
  Calendar,
  Clock,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import profile from "../../assets/profile1.jpg"

import { useAdminClientDetails } from "../../hooks/Admin/useAdminClients";
import { getImageUrl } from "../../utils/imageUrl";

export default function AdminClientView() {
  const navigate = useNavigate();
  const { clientId } = useParams();

  const {
    client,
    user = {},
    isLoading,
    isFetching,
    error,
    refetch,
  } = useAdminClientDetails(clientId);

  const [copied, setCopied] = React.useState("");

  const handleCopy = async (value, key) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);

      setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  if (isLoading) {
    return <ClientDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          <ArrowLeft size={17} />
          Back to Clients
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error?.message || "Failed to load client details."}
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          <ArrowLeft size={17} />
          Back to Clients
        </button>

        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-[#11151d] dark:text-gray-400">
          Client details not found.
        </div>
      </div>
    );
  }

  const {
    businessName,
    businessType,
    businessDescription,
    address = {},
    contact = {},
    clientKey,
    slug,
    chatbot = {},
    status,
    createdAt,
    updatedAt,
  } = client;

  const predefinedQuestions = [...(chatbot.predefinedQuestions || [])]
    .filter((item) => item?.enabled)
    .sort((a, b) => (a?.sortOrder || 0) - (b?.sortOrder || 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            <ArrowLeft size={17} />
            Back to Clients
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              {user?.profileImage ? (
                <img
                  src={getImageUrl(user?.profileImage, profile)}
                  alt={businessName || "Client"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 size={21} />
              )}
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {businessName || "Client Details"}
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Client account and chatbot configuration
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#11151d] dark:text-gray-300 dark:hover:bg-white/5"
        >
          <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoStat
          icon={Building2}
          title="Business Type"
          value={businessType || "—"}
        />

        <InfoStat
          icon={ShieldCheck}
          title="Status"
          value={status || "—"}
          status={status}
        />

        <InfoStat
          icon={Bot}
          title="Chatbot"
          value={chatbot.name || "Not configured"}
        />
      </div>

      <SectionCard
        icon={Building2}
        title="Business Information"
        description="Basic information about the client business."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <DetailItem label="Business Name" value={businessName} />

          <DetailItem label="Business Type" value={businessType} />

          <DetailItem label="Client Key" value={clientKey} copyable />

          <DetailItem label="Slug" value={slug} copyable />

          <div className="md:col-span-2">
            <DetailItem
              label="Business Description"
              value={businessDescription}
              multiline
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={Phone}
        title="Contact Information"
        description="Public contact information available for the client."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <ContactItem
            icon={Phone}
            label="Phone"
            value={contact.phone}
            copyable
            copyKey="phone"
            copied={copied}
            onCopy={handleCopy}
          />

          <ContactItem
            icon={Phone}
            label="Alternate Phone"
            value={contact.alternatePhone}
            copyable
            copyKey="alternatePhone"
            copied={copied}
            onCopy={handleCopy}
          />

          <ContactItem
            icon={Mail}
            label="Email"
            value={contact.email}
            copyable
            copyKey="email"
            copied={copied}
            onCopy={handleCopy}
          />

          <ContactItem
            icon={MessageCircle}
            label="WhatsApp"
            value={contact.whatsapp}
            copyable
            copyKey="whatsapp"
            copied={copied}
            onCopy={handleCopy}
          />

          <div className="md:col-span-2">
            <ContactItem
              icon={Globe}
              label="Website"
              value={contact.website}
              link={contact.website}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={MapPin}
        title="Address"
        description="Business location and address information."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <DetailItem label="Address Line 1" value={address.addressLine1} />

          <DetailItem label="Address Line 2" value={address.addressLine2} />

          <DetailItem label="City" value={address.city} />

          <DetailItem label="State" value={address.state} />

          <DetailItem label="Country" value={address.country} />

          <DetailItem label="Postal Code" value={address.postalCode} />

          {address.googleMapsUrl && (
            <div className="md:col-span-2">
              <a
                href={address.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <MapPin size={16} />
                View location on Google Maps
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard
        icon={Bot}
        title="Chatbot Configuration"
        description="Chatbot settings configured for this client."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <DetailItem label="Chatbot Name" value={chatbot.name} />

          <DetailItem label="Language" value={formatValue(chatbot.language)} />

          <DetailItem label="Tone" value={formatValue(chatbot.tone)} />

          <div className="md:col-span-2">
            <DetailItem
              label="Welcome Message"
              value={chatbot.welcomeMessage}
              multiline
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        icon={MessageCircle}
        title="Predefined Questions"
        description="Questions displayed to users in the chatbot."
      >
        {predefinedQuestions.length > 0 ? (
          <div className="space-y-3">
            {predefinedQuestions.map((item, index) => (
              <div
                key={item._id || `${item.question}-${index}`}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-[#171b23]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  {index + 1}
                </div>

                <p className="pt-1 text-sm text-gray-700 dark:text-gray-200">
                  {item.question}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No predefined questions configured." />
        )}
      </SectionCard>

      <SectionCard
        icon={Bot}
        title="AI Instructions"
        description="Instructions used by the client's AI chatbot."
      >
        {chatbot.aiInstructions ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-[#171b23]">
            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-300">
              {chatbot.aiInstructions}
            </p>
          </div>
        ) : (
          <EmptyState message="No AI instructions configured." />
        )}
      </SectionCard>

      <SectionCard
        icon={User}
        title="Account Information"
        description="User account associated with this client."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <DetailItem label="Full Name" value={user.fullName} />

          <DetailItem label="Email" value={user.email} />

          <DetailItem label="Role" value={formatValue(user.role)} />

          <DetailItem label="User ID" value={user._id} copyable />

          <DetailItem label="Last Login" value={formatDate(user.lastLogin)} />

          <DetailItem
            label="Account Created"
            value={formatDate(user.createdAt)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={Calendar}
        title="Client Timeline"
        description="Important client account dates."
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <DetailItem label="Created At" value={formatDate(createdAt)} />

          <DetailItem label="Last Updated" value={formatDate(updatedAt)} />
        </div>
      </SectionCard>
    </div>
  );
}

const SectionCard = ({ icon: Icon, title, description, children }) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#11151d] sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <Icon size={18} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
};

const DetailItem = ({ label, value, multiline = false, copyable = false }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <div
        className={`group relative rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-white/10 dark:bg-[#171b23] ${
          multiline ? "min-h-22.5" : ""
        }`}
      >
        <p
          className={`wrap-break-word text-sm text-gray-800 dark:text-gray-200 ${
            multiline ? "whitespace-pre-wrap leading-6" : ""
          }`}
        >
          {value || "—"}
        </p>

        {copyable && value && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded-md p-1.5 text-gray-400 opacity-0 transition hover:bg-gray-200 hover:text-gray-700 group-hover:opacity-100 dark:hover:bg-white/10 dark:hover:text-white"
            title="Copy"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

const ContactItem = ({
  icon: Icon,
  label,
  value,
  link,
  copyable,
  copyKey,
  copied,
  onCopy,
}) => {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <div className="flex min-h-10.5 items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-white/10 dark:bg-[#171b23]">
        <Icon size={16} className="shrink-0 text-gray-400" />

        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="min-w-0 flex-1 truncate text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            {value || "—"}
          </a>
        ) : (
          <span className="min-w-0 flex-1 break-all text-sm text-gray-800 dark:text-gray-200">
            {value || "—"}
          </span>
        )}

        {copyable && value && (
          <button
            type="button"
            onClick={() => onCopy(value, copyKey)}
            className="shrink-0 rounded-md p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
            title="Copy"
          >
            {copied === copyKey ? <Check size={14} /> : <Copy size={14} />}
          </button>
        )}

        {link && value && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

const InfoStat = ({ icon: Icon, title, value, status }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#11151d]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>

          {status ? (
            <span
              className={`mt-1 inline-flex rounded-full px-2 py-1 text-[11px] font-medium ${
                status === "active"
                  ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              }`}
            >
              {formatValue(value)}
            </span>
          ) : (
            <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-white">
              {value || "—"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-[#171b23] dark:text-gray-400">
      {message}
    </div>
  );
};

const ClientDetailsSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded bg-gray-200 dark:bg-white/10" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 rounded-xl bg-gray-200 dark:bg-white/10"
          />
        ))}
      </div>

      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-48 rounded-xl bg-gray-200 dark:bg-white/10"
        />
      ))}
    </div>
  );
};

const formatValue = (value) => {
  if (!value) return "—";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

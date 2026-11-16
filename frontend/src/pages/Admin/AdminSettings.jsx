import { useEffect, useState } from "react";
import {
  Settings,
  Bot,
  ShieldCheck,
  Bell,
  Gauge,
  Globe,
  Save,
  RefreshCw,
  CreditCard,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import CustomSelect from "../../components/common/CustomSelect";
import {
  useAdminSettings,
  useUpdateAdminSettings,
} from "../../hooks/Admin/useAdminSettings";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSettingSchema } from "../../utils/validation";
import { useForm } from "react-hook-form";

// Default settings
const initialSettings = {
  platformName: "",
  supportEmail: "",
  defaultLanguage: "",
  timezone: "",

  aiModel: "",
  temperature: "",
  maxOutputTokens: "",
  enableChatHistory: true,
  enableStreaming: true,
  enableFallback: true,

  monthlyUsageAlert: true,
  usageAlertLimit: "",

  emailNotifications: true,
  newClientNotification: true,
  subscriptionNotification: true,
  paymentNotification: true,

  maxLoginAttempts: "",
  sessionTimeout: "",
  twoFactorAuth: false,
  maintenanceMode: false,
};

// Navigation
const navigation = [
  { id: "general", label: "General", icon: Settings },
  { id: "ai", label: "AI Configuration", icon: Bot },
  { id: "usage", label: "Usage & Limits", icon: Gauge },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
];

// Convert API response into frontend form state
const toFormSettings = (data = {}) => ({
  ...initialSettings,
  ...data,

  temperature: String(data.temperature ?? initialSettings.temperature),
  maxOutputTokens: String(
    data.maxOutputTokens ?? initialSettings.maxOutputTokens,
  ),
  usageAlertLimit: String(
    data.usageAlertLimit ?? initialSettings.usageAlertLimit,
  ),
  maxLoginAttempts: String(
    data.maxLoginAttempts ?? initialSettings.maxLoginAttempts,
  ),
  sessionTimeout: String(data.sessionTimeout ?? initialSettings.sessionTimeout),
});

// Convert frontend state into API payload
const toApiPayload = (settings) => ({
  ...settings,

  temperature: Number(settings.temperature),
  maxOutputTokens: Number(settings.maxOutputTokens),
  usageAlertLimit: Number(settings.usageAlertLimit),
  maxLoginAttempts: Number(settings.maxLoginAttempts),
  sessionTimeout: Number(settings.sessionTimeout),
});

// API error message
const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [success, setSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // GET API
  const { data, isPending, isError, error, refetch, isFetching } =
    useAdminSettings();

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminSettingSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: initialSettings,
  });

  // Keep the existing UI controlled by React Hook Form values.
  const settings = watch();

  // PATCH API
  const updateMutation = useUpdateAdminSettings();

  const saving = updateMutation.isPending;

  // Set API data into form
  useEffect(() => {
    const settingsData = data?.data?.data;

    if (settingsData) {
      reset(toFormSettings(settingsData));
    }
  }, [data]);

  // Update individual setting
  const updateSetting = (key, value) => {
    setValue(key, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    setSuccess(false);
    setSaveError("");
  };

  // Validate on click and call API only when the complete form is valid.
  const handleSave = handleSubmit((formValues) => {
    setSuccess(false);
    setSaveError("");

    const payload = toApiPayload(formValues);
    const { _id, adminId, createdAt, updatedAt, ...rest } = payload;

    updateMutation.mutate(rest, {
      onSuccess: (updatedSettings) => {
        const savedData = updatedSettings?.data?.data;

        if (savedData) {
          reset(toFormSettings(savedData));
        }

        setSuccess(true);
      },

      onError: (error) => {
        setSaveError(getErrorMessage(error));
      },
    });
  });

  // Reset to last saved settings
  const handleReset = () => {
    const settingsData = data?.data?.data;
    reset(settingsData ? toFormSettings(settingsData) : initialSettings);

    setSuccess(false);
    setSaveError("");
  };

  // Initial Loading
  if (isPending) {
    return (
      <div className="min-h-full space-y-6 bg-gray-50 pb-8 dark:bg-[#0d1117]">
        <div>
          <div className="h-7 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="h-64 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-80 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  // GET API Error
  if (isError) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-[#161b22]">
        <AlertCircle size={35} className="text-red-500" />

        <h2 className="mt-3 text-base font-semibold text-gray-900 dark:text-white">
          Failed to load settings
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {getErrorMessage(error)}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6 bg-gray-50 pb-8 dark:bg-[#0d1117]">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />

            <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              Admin Settings
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your AI chatbot platform configuration and preferences.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60 dark:border-gray-700 dark:bg-[#161b22] dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RefreshCw size={16} />
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
          <CheckCircle2 size={18} />
          Settings updated successfully.
        </div>
      )}

      {/* Save Error */}
      {saveError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          <AlertCircle size={18} />
          {saveError}
        </div>
      )}

      {/* Settings Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-[#161b22]">
          <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Preferences
          </p>

          <div className="flex gap-2 overflow-x-auto lg:flex-col">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition lg:w-full ${
                    active
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 hidden rounded-xl bg-gray-50 p-4 dark:bg-[#0d1117] lg:block">
            <div className="mb-2 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sparkles size={17} />
              <span className="text-sm font-semibold">AI Platform</span>
            </div>

            <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
              Manage your platform, AI models, client usage and security from
              one place.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 space-y-5">
          {/* GENERAL SETTINGS */}
          {activeTab === "general" && (
            <>
              <Section
                title="General Settings"
                description="Configure your platform's basic information."
                icon={Globe}
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputField
                    label="Platform Name"
                    value={settings.platformName}
                    onChange={(v) => updateSetting("platformName", v)}
                    placeholder="Enter platform name"
                    error={errors.platformName?.message}
                  />

                  <InputField
                    label="Support Email"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(v) => updateSetting("supportEmail", v)}
                    placeholder="support@example.com"
                    error={errors.supportEmail?.message}
                  />
                </div>
              </Section>

              <Section
                title="Platform Status"
                description="Control the availability of your SaaS platform."
                icon={Globe}
              >
                <SettingToggle
                  title="Maintenance Mode"
                  description="Temporarily restrict client access while maintenance is in progress."
                  checked={settings.maintenanceMode}
                  onChange={(v) => updateSetting("maintenanceMode", v)}
                />
              </Section>
            </>
          )}

          {/* AI CONFIGURATION */}
          {activeTab === "ai" && (
            <>
              <Section
                title="AI Configuration"
                description="Set default AI behavior for newly created client chatbots."
                icon={Bot}
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <SelectField
                    label="Default AI Model"
                    value={settings.aiModel}
                    onChange={(v) => updateSetting("aiModel", v)}
                    isDisabled={true}
                    error={errors.aiModel?.message}
                    options={[
                      {
                        value: "gemini-2.5-flash",
                        label: "Gemini 2.5 Flash",
                      },
                      {
                        value: "gemini-2.5-pro",
                        label: "Gemini 2.5 Pro",
                      },
                    ]}
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <SettingToggle
                    title="Chat History"
                    description="Allow chatbots to use previous conversation context."
                    checked={settings.enableChatHistory}
                    onChange={(v) => updateSetting("enableChatHistory", v)}
                    disabled={true}
                  />

                  <SettingToggle
                    title="Streaming Responses"
                    description="Display AI responses as they are generated."
                    checked={settings.enableStreaming}
                    onChange={(v) => updateSetting("enableStreaming", v)}
                    disabled={true}
                  />

                  <SettingToggle
                    title="Fallback Responses"
                    description="Enable a fallback response when AI generation fails."
                    checked={settings.enableFallback}
                    onChange={(v) => updateSetting("enableFallback", v)}
                    disabled={true}
                  />
                </div>
              </Section>

              <InfoCard
                icon={Sparkles}
                title="AI Configuration Note"
                description="These values should act as platform defaults. Client-specific chatbot settings and subscription plan limits should take priority wherever configured."
              />
            </>
          )}

          {/* USAGE & LIMITS */}
          {activeTab === "usage" && (
            <>
              <Section
                title="Usage & Limits"
                description="Configure platform-wide usage alert preferences."
                icon={Gauge}
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputField
                    label="Usage Alert Threshold (%)"
                    type="number"
                    value={settings.usageAlertLimit}
                    onChange={(v) => updateSetting("usageAlertLimit", v)}
                    placeholder="80"
                    error={errors.usageAlertLimit?.message}
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <SettingToggle
                    title="Monthly Usage Alerts"
                    description="Get notified when platform usage reaches the configured threshold."
                    checked={settings.monthlyUsageAlert}
                    onChange={(v) => updateSetting("monthlyUsageAlert", v)}
                  />
                </div>
              </Section>

              <InfoCard
                icon={CreditCard}
                title="Plan-based Limits"
                description="Client message limits, token limits, FAQ limits and chatbot configuration restrictions should be controlled through Subscription Plans, not by overriding individual client settings here."
              />
            </>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <Section
              title="Notification Preferences"
              description="Choose which platform events should trigger admin notifications."
              icon={Bell}
            >
              <SettingToggle
                title="Email Notifications"
                description="Enable email notifications for important platform events."
                checked={settings.emailNotifications}
                onChange={(v) => updateSetting("emailNotifications", v)}
              />

              <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

              <SettingToggle
                title="New Client Registration"
                description="Get notified whenever a new client is created."
                checked={settings.newClientNotification}
                onChange={(v) => updateSetting("newClientNotification", v)}
              />

              <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

              <SettingToggle
                title="Subscription Events"
                description="Receive notifications for subscription creation, upgrade, downgrade and cancellation."
                checked={settings.subscriptionNotification}
                onChange={(v) => updateSetting("subscriptionNotification", v)}
              />

              <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

              <SettingToggle
                title="Payment Notifications"
                description="Receive notifications for successful and failed payments."
                checked={settings.paymentNotification}
                onChange={(v) => updateSetting("paymentNotification", v)}
              />
            </Section>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <>
              <Section
                title="Security Settings"
                description="Manage platform access and session security."
                icon={ShieldCheck}
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputField
                    label="Maximum Login Attempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(v) => updateSetting("maxLoginAttempts", v)}
                    placeholder="5"
                    error={errors.maxLoginAttempts?.message}
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <SettingToggle
                    title="Two-Factor Authentication"
                    description="Require an additional verification step for admin login."
                    checked={settings.twoFactorAuth}
                    onChange={(v) => updateSetting("twoFactorAuth", v)}
                  />
                </div>
              </Section>

              <InfoCard
                icon={Lock}
                title="Security Recommendation"
                description="Use strong passwords, secure HTTP-only cookies, server-side session validation and rate limiting for admin APIs."
              />
            </>
          )}

          {/* Bottom Save */}
          <div className="flex flex-col-reverse justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#161b22] sm:flex-row sm:items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Make sure to save your changes before leaving this page.
            </p>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}

              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

/* Reusable Components */

function Section({ title, description, icon: Icon, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#161b22] sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <Icon size={20} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:ring-2 dark:bg-white/3 dark:text-white ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500"
            : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/10 dark:border-gray-700"
        }`}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  isIcon = false,
  isDisabled = false,
  onChange,
  options,
  error,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <CustomSelect
        size="md"
        name="filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
        placeholder="Select status"
        required
        icon={isIcon}
        disabled={isDisabled}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400 sm:text-sm">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          checked ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function InfoCard({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/5">
      <div className="mt-0.5 text-indigo-600 dark:text-indigo-400">
        <Icon size={19} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-indigo-800/80 dark:text-indigo-200/70 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

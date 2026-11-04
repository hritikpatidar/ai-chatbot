import { useState } from "react";
import {
  Settings,
  Bot,
  ShieldCheck,
  Bell,
  Gauge,
  Globe,
  Save,
  RefreshCw,
  Mail,
  MessageSquare,
  Users,
  CreditCard,
  Lock,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import CustomSelect from "../../components/common/CustomSelect";

const initialSettings = {
  platformName: "AI Chatbot",
  supportEmail: "support@yourcompany.com",
  defaultLanguage: "en",
  timezone: "Asia/Kolkata",

  aiModel: "gemini-2.5-flash",
  temperature: "0.7",
  maxOutputTokens: "2048",
  enableChatHistory: true,
  enableStreaming: true,
  enableFallback: true,

  monthlyUsageAlert: true,
  usageAlertLimit: "80",
  emailNotifications: true,
  newClientNotification: true,
  subscriptionNotification: true,
  paymentNotification: true,

  maxLoginAttempts: "5",
  sessionTimeout: "30",
  twoFactorAuth: false,
  maintenanceMode: false,
};

const navigation = [
  { id: "general", label: "General", icon: Settings },
  { id: "ai", label: "AI Configuration", icon: Bot },
  { id: "usage", label: "Usage & Limits", icon: Gauge },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(initialSettings);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);

    // Replace with your save settings API.
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSaving(false);
    setSuccess(true);

    setTimeout(() => setSuccess(false), 3000);
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setSuccess(false);
  };

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
            onClick={handleReset}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-[#161b22] dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RefreshCw size={16} />
            Reset
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
          >
            <Save size={16} />
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
                  />
                  <InputField
                    label="Support Email"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(v) => updateSetting("supportEmail", v)}
                    placeholder="support@example.com"
                  />
                  {/* <SelectField
                    label="Default Language"
                    value={settings.defaultLanguage}
                    onChange={(v) => updateSetting("defaultLanguage", v)}
                    options={[
                      ["en", "English"],
                      ["hi", "Hindi"],
                    ]}
                  /> */}
                  {/* <SelectField
                    label="Timezone"
                    value={settings.timezone}
                    onChange={(v) => updateSetting("timezone", v)}
                    options={[
                      ["Asia/Kolkata", "India (IST)"],
                      ["Europe/London", "London"],
                      ["America/New_York", "New York"],
                      ["UTC", "UTC"],
                    ]}
                  /> */}
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
                  <InputField
                    label="Temperature"
                    type="number"
                    value={settings.temperature}
                    onChange={(v) => updateSetting("temperature", v)}
                    placeholder="0.7"
                  />
                  <InputField
                    label="Max Output Tokens"
                    type="number"
                    value={settings.maxOutputTokens}
                    onChange={(v) => updateSetting("maxOutputTokens", v)}
                    placeholder="2048"
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <SettingToggle
                    title="Chat History"
                    description="Allow chatbots to use previous conversation context."
                    checked={settings.enableChatHistory}
                    onChange={(v) => updateSetting("enableChatHistory", v)}
                  />
                  <SettingToggle
                    title="Streaming Responses"
                    description="Display AI responses as they are generated."
                    checked={settings.enableStreaming}
                    onChange={(v) => updateSetting("enableStreaming", v)}
                  />
                  <SettingToggle
                    title="Fallback Responses"
                    description="Enable a fallback response when AI generation fails."
                    checked={settings.enableFallback}
                    onChange={(v) => updateSetting("enableFallback", v)}
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
                  />
                  <SelectField
                    label="Session Timeout"
                    value={settings.sessionTimeout}
                    onChange={(v) => updateSetting("sessionTimeout", v)}
                    options={[
                      {
                        value: "15",
                        label: "15 Minutes",
                      },
                      {
                        value: "30",
                        label: "30 Minutes",
                      },
                      {
                        value: "60",
                        label: "1 Hour",
                      },
                      {
                        value: "120",
                        label: "2 Hours",
                      },
                    ]}
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
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              <Save size={16} />
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

function InputField({ label, value, onChange, type = "text", placeholder }) {
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
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-white/3 dark:text-white"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <CustomSelect
        size="md"
        // label="Business Status"
        name={"filter"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
        placeholder="Select status"
        // error={errors.accountStatus?.message}
        required
        icon={true}
      />
    </div>
  );
}

function SettingToggle({ title, description, checked, onChange }) {
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

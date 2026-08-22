import React, { useState } from "react";
import {
  Bell,
  Shield,
  Lock,
  Globe,
  Database,
  Save,
  Mail,
  KeyRound,
} from "lucide-react";

export default function AdminSettings ()  {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    clientNotifications: true,
    maintenanceMode: false,
    twoFactorAuth: false,
    autoBackup: true,
    publicRegistration: true,
    language: "English",
    timezone: "Asia/Kolkata",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSuccess(false);
  };

  const handleSave = () => {
    console.log("Admin Settings:", settings);

    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 dark:bg-[#0d1117] sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          Admin Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your platform settings and preferences
        </p>
      </div>

      {/* Success */}
      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
          Settings updated successfully.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Notifications */}
        <SettingsCard
          icon={<Bell size={18} />}
          title="Notifications"
          description="Manage admin and client notifications"
        >
          <ToggleRow
            title="Email Notifications"
            description="Receive important platform notifications"
            checked={settings.emailNotifications}
            onChange={(value) =>
              handleChange("emailNotifications", value)
            }
          />

          <ToggleRow
            title="Client Notifications"
            description="Receive notifications about client activity"
            checked={settings.clientNotifications}
            onChange={(value) =>
              handleChange("clientNotifications", value)
            }
          />
        </SettingsCard>

        {/* Security */}
        <SettingsCard
          icon={<Shield size={18} />}
          title="Security"
          description="Manage your admin security settings"
        >
          <ToggleRow
            title="Two-Factor Authentication"
            description="Add an extra layer of security"
            checked={settings.twoFactorAuth}
            onChange={(value) =>
              handleChange("twoFactorAuth", value)
            }
          />

          <button
            type="button"
            className="
              mt-3
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              border
              border-gray-200
              px-4
              py-3
              text-left
              transition
              hover:bg-gray-50
              dark:border-white/10
              dark:hover:bg-white/5
            "
          >
            <KeyRound
              size={17}
              className="text-gray-500 dark:text-gray-400"
            />

            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Change Password
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Update your administrator password
              </p>
            </div>
          </button>
        </SettingsCard>

        {/* Platform */}
        <SettingsCard
          icon={<Globe size={18} />}
          title="Platform"
          description="Configure platform preferences"
        >
          <SelectField
            label="Language"
            value={settings.language}
            options={["English", "Hindi"]}
            onChange={(value) => handleChange("language", value)}
          />

          <SelectField
            label="Timezone"
            value={settings.timezone}
            options={["Asia/Kolkata", "Europe/London", "UTC"]}
            onChange={(value) => handleChange("timezone", value)}
          />
        </SettingsCard>

        {/* System */}
        <SettingsCard
          icon={<Database size={18} />}
          title="System"
          description="Manage system-level configuration"
        >
          <ToggleRow
            title="Automatic Backup"
            description="Automatically backup platform data"
            checked={settings.autoBackup}
            onChange={(value) =>
              handleChange("autoBackup", value)
            }
          />

          <ToggleRow
            title="Public Registration"
            description="Allow new users to register"
            checked={settings.publicRegistration}
            onChange={(value) =>
              handleChange("publicRegistration", value)
            }
          />

          <ToggleRow
            title="Maintenance Mode"
            description="Temporarily disable public access"
            checked={settings.maintenanceMode}
            onChange={(value) =>
              handleChange("maintenanceMode", value)
            }
          />
        </SettingsCard>

        {/* Email */}
        <SettingsCard
          icon={<Mail size={18} />}
          title="Email Configuration"
          description="Configure platform email settings"
        >
          <InputField
            label="SMTP Host"
            placeholder="smtp.example.com"
          />

          <InputField
            label="SMTP Port"
            placeholder="587"
            type="number"
          />
        </SettingsCard>

        {/* Access */}
        <SettingsCard
          icon={<Lock size={18} />}
          title="Access Control"
          description="Manage administrator access"
        >
          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              p-4
              dark:border-white/10
              dark:bg-white/3
            "
          >
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Administrator Access
            </p>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Only authorized administrators can access this dashboard.
            </p>
          </div>
        </SettingsCard>
      </div>

      {/* Save */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-blue-600
            px-5
            py-2.5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          <Save size={16} />
          Save Settings
        </button>
      </div>
    </div>
  );
};

const SettingsCard = ({
  icon,
  title,
  description,
  children,
}) => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
        dark:border-white/10
        dark:bg-[#11161f]
      "
    >
      <div className="mb-5 flex items-start gap-3">
        <div
          className="
            flex
            h-9
            w-9
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
          {icon}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
};

const ToggleRow = ({
  title,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative
          h-6
          w-11
          shrink-0
          rounded-full
          transition
          ${checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"}
        `}
      >
        <span
          className={`
            absolute
            top-1
            h-4
            w-4
            rounded-full
            bg-white
            shadow
            transition
            ${checked ? "left-6" : "left-1"}
          `}
        />
      </button>
    </div>
  );
};

const SelectField = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-10
          w-full
          rounded-lg
          border
          border-gray-200
          bg-white
          px-3
          text-sm
          text-gray-800
          outline-none
          focus:border-blue-500
          dark:border-white/10
          dark:bg-[#171c25]
          dark:text-white
        "
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

const InputField = ({
  label,
  placeholder,
  type = "text",
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="
          h-10
          w-full
          rounded-lg
          border
          border-gray-200
          bg-white
          px-3
          text-sm
          text-gray-800
          outline-none
          placeholder:text-gray-400
          focus:border-blue-500
          dark:border-white/10
          dark:bg-[#171c25]
          dark:text-white
        "
      />
    </div>
  );
};
import { useEffect, useState } from "react";
import {
  Building2,
  Save,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { updateClient } from "../../../redux/features/Client/clientSlice";

export default function AddClient() {
  const dispatch = useDispatch();
  const { clientDetails, loading } = useSelector(
    (state) => state?.clientReducer?.clientSlice || {},
  );

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    businessDescription: "",
    clientKey: "",
    slug: "",
    status: "active",
  });

  useEffect(() => {
    if (clientDetails) {
      setFormData({
        businessName: clientDetails.businessName || "",
        businessType: clientDetails.businessType || "",
        businessDescription: clientDetails.businessDescription || "",
        clientKey: clientDetails.clientKey || "",
        slug: clientDetails.slug || "",
        status: clientDetails.status || "active",
      });
    }
  }, [clientDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "active" ? "inactive" : "active",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientDetails?._id) return;

    await dispatch(
      updateClient({
        clientId: clientDetails._id,
        data: formData,
      }),
    );
  };

  const handleReset = () => {
    setFormData({
      businessName: clientDetails?.businessName || "",
      businessType: clientDetails?.businessType || "",
      businessDescription: clientDetails?.businessDescription || "",
      clientKey: clientDetails?.clientKey || "",
      slug: clientDetails?.slug || "",
      status: clientDetails?.status || "active",
    });
  };

  const inputClass = `
    w-full rounded-xl border border-gray-200
    bg-white px-4 py-3 text-sm text-gray-900
    outline-none transition
    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
    dark:border-white/10 dark:bg-[#171b23]
    dark:text-white dark:placeholder:text-gray-500
  `;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="
            flex h-11 w-11 items-center
            justify-center rounded-xl
            bg-blue-500/10 text-blue-600
            dark:text-blue-400
          "
        >
          <Building2 size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Client Settings
          </h2>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Manage your business information and client configuration.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="
          rounded-2xl border border-gray-200
          bg-white p-5 shadow-sm
          dark:border-white/10 dark:bg-[#171b23]
          sm:p-6
        "
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Business Name */}
          <FormField
            label="Business Name"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="ABC Books"
            inputClass={inputClass}
          />

          {/* Business Type */}
          <FormField
            label="Business Type"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            placeholder="Bookstore"
            inputClass={inputClass}
          />

          {/* Client Key */}
          <FormField
            label="Client Key"
            name="clientKey"
            value={formData.clientKey}
            onChange={handleChange}
            placeholder="abc-books"
            inputClass={inputClass}
            disabled
          />

          {/* Slug */}
          <FormField
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="abc-books"
            inputClass={inputClass}
          />

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Business Description
            </label>

            <textarea
              name="businessDescription"
              value={formData.businessDescription}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your business..."
              className={inputClass}
            />
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <div
              className="
                flex flex-col gap-4 rounded-xl
                border border-gray-200 bg-gray-50
                p-4 sm:flex-row sm:items-center
                sm:justify-between
                dark:border-white/10 dark:bg-white/5
              "
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Client Status
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Inactive clients will not be available for the chatbot.
                </p>
              </div>

              <button
                type="button"
                onClick={handleStatusToggle}
                className="inline-flex items-center gap-2"
              >
                {formData.status === "active" ? (
                  <>
                    <ToggleRight size={34} className="text-green-500" />

                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Active
                    </span>
                  </>
                ) : (
                  <>
                    <ToggleLeft size={34} className="text-gray-400" />

                    <span className="text-sm font-medium text-gray-500">
                      Inactive
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 dark:border-white/10 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="
              inline-flex items-center
              justify-center gap-2 rounded-xl
              border border-gray-200 px-4 py-2.5
              text-sm font-medium text-gray-700
              transition hover:bg-gray-50
              dark:border-white/10 dark:text-gray-300
              dark:hover:bg-white/5
            "
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="submit"
            disabled={loading}
            className="
              inline-flex items-center
              justify-center gap-2 rounded-xl
              bg-blue-600 px-5 py-2.5
              text-sm font-medium text-white
              transition hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <Save size={16} />

            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  inputClass,
  disabled = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          ${inputClass}
          ${
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-white/5"
              : ""
          }
        `}
      />
    </div>
  );
}

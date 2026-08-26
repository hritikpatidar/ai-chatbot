import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { subscriptionPlanValidation } from "../../../utils/validation";
import CustomSelect from "../../common/CustomSelect";

const defaultValues = {
  name: "",
  description: "",
  stripePriceId: "",
  stripeProductId: "",
  amount: 0,
  currency: "gbp",
  interval: "month",
  features: [],
  sortOrder: 0,
  status: "active",
};

const SubscriptionPlanForm = ({
  initialData = null,
  loading = false,
  onSubmit,
  onCancel,
  apiError = "",
  success = "",
}) => {
  const [featureInput, setFeatureInput] = useState("");

  const isEdit = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subscriptionPlanValidation),
    defaultValues,
  });
  debugger

  const features = watch("features") || [];

  /* =========================================================
     LOAD INITIAL DATA
  ========================================================= */

  useEffect(() => {
    if (initialData) {
      const existingFeatures = Array.isArray(initialData.features)
        ? initialData.features
        : [];

      reset({
        name: initialData.name || "",
        description: initialData.description || "",
        stripePriceId: initialData.stripePriceId || "",
        stripeProductId: initialData.stripeProductId || "",
        amount: Number(initialData.amount) || 0,
        currency: initialData.currency || "gbp",
        interval: initialData.interval || "month",
        features: existingFeatures,
        sortOrder: Number(initialData.sortOrder) || 0,
        status: initialData.status || "active",
      });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  /* =========================================================
     ADD FEATURE
  ========================================================= */

  const addFeature = () => {
    const value = featureInput.trim();

    if (!value) return;

    const updatedFeatures = [...features, value];

    setValue("features", updatedFeatures, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setFeatureInput("");
  };

  /* =========================================================
     REMOVE FEATURE
  ========================================================= */

  const removeFeature = (index) => {
    const updatedFeatures = features.filter((_, i) => i !== index);

    setValue("features", updatedFeatures, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const submitHandler = async (data) => {
    const payload = {
      ...data,

      features,

      amount: Number(data.amount),

      sortOrder: Number(data.sortOrder),

      currency: data.currency.toLowerCase().trim(),
    };

    /*
     * IMPORTANT:
     *
     * Parent component me onSubmit async hoga.
     *
     * Agar API fail hoti hai to error parent me catch hoga
     * aur form open rahega.
     *
     * Agar API successful hoti hai to parent close karega.
     */

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {/* =====================================================
          API ERROR
      ===================================================== */}
      {success && (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-400">
          {success}
        </div>
      )}
      {apiError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-500/30 dark:bg-red-500/10">
          <AlertCircle size={19} className="mt-0.5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              Unable to save subscription plan
            </p>

            <p className="mt-1 text-sm text-red-600 dark:text-red-300">
              {apiError}
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              {isEdit ? "Edit Subscription Plan" : "Create Subscription Plan"}
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Configure your subscription pricing and features.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <Save size={17} />
          )}

          {isEdit ? "Update Plan" : "Create Plan"}
        </button>
      </div>

      {/* =====================================================
          BASIC INFORMATION
      ===================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#11151d] sm:p-6">
        <h2 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Plan Name"
            required
            placeholder="Basic"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Currency"
            required
            placeholder="gbp"
            error={errors.currency?.message}
            {...register("currency")}
          />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>

            <textarea
              rows={3}
              placeholder="Basic subscription plan"
              {...register("description")}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-700 dark:bg-[#171b23] dark:text-white"
            />

            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          STRIPE
      ===================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#11151d] sm:p-6">
        <h2 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
          Stripe Configuration
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Stripe Product ID"
            required
            placeholder="prod_xxxxxxxxx"
            error={errors.stripeProductId?.message}
            {...register("stripeProductId")}
          />

          <Input
            label="Stripe Price ID"
            required
            placeholder="price_xxxxxxxxx"
            error={errors.stripePriceId?.message}
            {...register("stripePriceId")}
          />
        </div>
      </div>

      {/* =====================================================
          PRICING
      ===================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#11151d] sm:p-6">
        <h2 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
          Pricing
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Input
            label="Amount"
            required
            type="number"
            min="0"
            step="1"
            placeholder="1099"
            error={errors.amount?.message}
            {...register("amount", {
              valueAsNumber: true,
            })}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Billing Interval
            </label>
            <Controller
              name="interval"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  size="md"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    {
                      value: "month",
                      label: "Monthly",
                    },
                    {
                      value: "year",
                      label: "Yearly",
                    },
                  ]}
                  rounded="rounded-xl"
                  error={errors.interval?.message}
                />
              )}
            />
            {errors.interval && (
              <p className="mt-1 text-xs text-red-500">
                {errors.interval.message}
              </p>
            )}
          </div>

          <Input
            label="Sort Order"
            required
            type="number"
            min="0"
            error={errors.sortOrder?.message}
            {...register("sortOrder", {
              valueAsNumber: true,
            })}
          />
        </div>
      </div>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#11151d] sm:p-6">
        <h2 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
          Plan Features
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeature();
              }
            }}
            placeholder="e.g. 100 chatbot conversations"
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-[#171b23] dark:text-white"
          />

          <button
            type="button"
            onClick={addFeature}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
          >
            <Plus size={17} />
            Add Feature
          </button>
        </div>

        {errors.features && (
          <p className="mt-2 text-xs text-red-500">{errors.features.message}</p>
        )}

        <div className="mt-4 space-y-2">
          {features.length === 0 && (
            <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500 dark:bg-[#171b23] dark:text-gray-400">
              No features added yet.
            </p>
          )}

          {features.map((feature, index) => (
            <div
              key={`${feature}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-700"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />

                <span className="wrap-break-word text-sm text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </div>

              <button
                type="button"
                onClick={() => removeFeature(index)}
                disabled={loading}
                className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          STATUS
      ===================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#11151d] sm:p-6">
        <h2 className="mb-5 text-base font-semibold text-gray-900 dark:text-white">
          Plan Status
        </h2>

        <div className="max-w-md">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>

          {/* <select
            {...register("status")}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-[#171b23] dark:text-white"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select> */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <CustomSelect
                size="md"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                options={[
                  {
                    value: "active",
                    label: "Active",
                  },
                  {
                    value: "inactive",
                    label: "Inactive",
                  },
                ]}
                rounded="rounded-xl"
                error={errors.status?.message}
              />
            )}
          />
        </div>
      </div>

      {/* =====================================================
          BOTTOM ACTION
      ===================================================== */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <Save size={17} />
          )}

          {isEdit ? "Update Plan" : "Create Plan"}
        </button>
      </div>
    </form>
  );
};

const Input = ({ label, required, error, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 dark:border-gray-700 dark:bg-[#171b23] dark:text-white"
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SubscriptionPlanForm;

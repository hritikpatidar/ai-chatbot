import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  UserPlus,
  User,
  Building2,
  KeyRound,
  MapPin,
  Phone,
  Save,
  Loader2,
  Bot,
  MessageSquare,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInputField from "../common/PhoneInputField";
import { clientSchema } from "../../utils/validation";
import { createClientService } from "../../service/Client/clientServices";

const defaultValues = {
  fullName: "",
  email: "",
  password: "",
  status: "active",
  businessName: "",
  businessType: "",
  businessDescription: "",
  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    googleMapsUrl: "",
  },
  contact: {
    phone: "",
    alternatePhone: "",
    email: "",
    website: "",
    whatsapp: "",
  },
  clientKey: "",
  slug: "",
  chatbot: {
    name: "",
    welcomeMessage: "",
    language: "english",
    tone: "professional",
    aiInstructions: "",
    predefinedQuestions: [
      {
        question: "",
        enabled: true,
        sortOrder: 1,
      },
    ],
  },
};

export default function AdminAddClientModal({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues,
    mode: "onChange",
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const isLoading = loading || isSubmitting;

  const {
    fields: questionFields,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "chatbot.predefinedQuestions",
  });

  const businessName = watch("businessName");
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen]);

  const handleClose = () => {
    if (isLoading) return;
    reset(defaultValues);
    setDraggedIndex(null);
    onClose?.();
  };

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      setApiError("");
      setSuccessMessage("");

      const formattedQuestions = data.chatbot.predefinedQuestions.map(
        (item, index) => ({
          question: item.question.trim(),
          enabled: Boolean(item.enabled),
          sortOrder: index + 1,
        }),
      );
      const payload = {
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        // status: data.status,
        businessName: data.businessName.trim(),
        businessType: data.businessType.trim(),
        businessDescription: data.businessDescription?.trim() || "",
        address: {
          addressLine1: data.address.addressLine1?.trim() || "",
          addressLine2: data.address.addressLine2?.trim() || "",
          city: data.address.city?.trim() || "",
          state: data.address.state?.trim() || "",
          country: data.address.country?.trim() || "India",
          postalCode: data.address.postalCode?.trim() || "",
          googleMapsUrl: data.address.googleMapsUrl?.trim() || "",
        },

        contact: {
          phone: data.contact.phone?.trim() || "",
          alternatePhone: data.contact.alternatePhone?.trim() || "",
          email: data.contact.email?.trim().toLowerCase() || "",
          website: data.contact.website?.trim() || "",
          whatsapp: data.contact.whatsapp?.trim() || "",
        },

        clientKey: data.clientKey.trim(),
        slug: data.slug.trim(),
        chatbot: {
          name: data.chatbot.name.trim(),
          welcomeMessage: data.chatbot.welcomeMessage?.trim() || "",
          language: data.chatbot.language,
          tone: data.chatbot.tone,
          aiInstructions: data.chatbot.aiInstructions.trim(),
          predefinedQuestions: formattedQuestions,
        },
      };
      const response = await createClientService(payload);
      if (response?.data?.success) {
        setSuccessMessage(
          response?.data?.message || "Client settings updated successfully.",
        );
      }

      reset(defaultValues);
      setTimeout(() => {
        onClose?.();
        setSuccessMessage("");
        reset(defaultValues);
        setDraggedIndex(null);
      }, 700);
    } catch (error) {
      console.error("Create client error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong while creating the client.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const generateClientKey = () => {
    const value = businessName
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!value) return;

    setValue("clientKey", value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue("slug", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleAddQuestion = () => {
    append({
      question: "",
      enabled: true,
      sortOrder: questionFields.length + 1,
    });
  };

  const handleDragStart = (index) => {
    if (isLoading) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (targetIndex) => {
    if (isLoading || draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    move(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            handleClose();
          }
        }}
      />

      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171b23]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-white/10">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <UserPlus size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                Add New Client
              </h2>

              <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                Create a new client, business and chatbot configuration
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex min-h-0 flex-1 flex-col"
          noValidate
        >
          {successMessage && (
            <div
              className="
                flex
                items-center
                gap-3
                rounded-lg
                border
                border-green-200
                bg-green-50
                px-4
                py-3
                text-sm
                text-green-700
                dark:border-green-500/20
                dark:bg-green-500/10
                dark:text-green-400
              "
            >
              <CheckCircle2 size={18} />

              <span>{successMessage}</span>
            </div>
          )}
          {apiError && (
            <div
              className="
                flex
                items-start
                gap-3
                rounded-lg
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700
                dark:border-red-500/20
                dark:bg-red-500/10
                dark:text-red-400
              "
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-medium">Error</p>

                <p className="mt-0.5 text-xs">{apiError}</p>
              </div>
            </div>
          )}
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-5 [scrollbar-color:#9ca3af_transparent] scrollbar-thin dark:[scrollbar-color:#4b5563_transparent]">
            <div className="space-y-5">
              <FormSection
                icon={User}
                title="Account Information"
                description="Login credentials for the client."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Full Name"
                    required
                    error={errors.fullName?.message}
                  >
                    <Input
                      type="text"
                      placeholder="Saviesa Infotech"
                      disabled={isLoading}
                      {...register("fullName")}
                    />
                  </FormField>

                  <FormField
                    label="Email"
                    required
                    error={errors.email?.message}
                  >
                    <Input
                      type="email"
                      placeholder="info@example.com"
                      disabled={isLoading}
                      {...register("email")}
                    />
                  </FormField>

                  <FormField
                    label="Password"
                    required
                    error={errors.password?.message}
                  >
                    <Input
                      type="password"
                      placeholder="Enter password"
                      disabled={isLoading}
                      {...register("password")}
                    />
                  </FormField>

                  <FormField
                    label="Account Status"
                    error={errors.status?.message}
                  >
                    <SelectInput disabled={isLoading} {...register("status")}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </SelectInput>
                  </FormField>
                </div>
              </FormSection>

              <FormSection
                icon={Building2}
                title="Business Information"
                description="Basic information about the client's business."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Business Name"
                    required
                    error={errors.businessName?.message}
                  >
                    <Input
                      type="text"
                      placeholder="Saviesa Infotech"
                      disabled={isLoading}
                      {...register("businessName")}
                    />
                  </FormField>

                  <FormField
                    label="Business Type"
                    required
                    error={errors.businessType?.message}
                  >
                    <Input
                      type="text"
                      placeholder="IT Software and Technology Company"
                      disabled={isLoading}
                      {...register("businessType")}
                    />
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField
                      label="Business Description"
                      error={errors.businessDescription?.message}
                    >
                      <Textarea
                        rows={4}
                        placeholder="Describe the client's business..."
                        disabled={isLoading}
                        {...register("businessDescription")}
                      />
                    </FormField>
                  </div>
                </div>
              </FormSection>

              <FormSection
                icon={KeyRound}
                title="Client Configuration"
                description="Unique identifiers used by the chatbot widget."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Client Key"
                    required
                    error={errors.clientKey?.message}
                  >
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="saviesa-infotech"
                        disabled={isLoading}
                        {...register("clientKey")}
                      />

                      <button
                        type="button"
                        onClick={generateClientKey}
                        disabled={isLoading}
                        className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#171b23] dark:text-gray-300 dark:hover:bg-white/5"
                      >
                        Generate
                      </button>
                    </div>

                    <p className="mt-1.5 text-[11px] text-gray-400">
                      Example: saviesa-infotech
                    </p>
                  </FormField>

                  <FormField label="Slug" required error={errors.slug?.message}>
                    <Input
                      type="text"
                      placeholder="saviesa-infotech"
                      disabled={isLoading}
                      {...register("slug")}
                    />
                  </FormField>
                </div>
              </FormSection>

              <FormSection
                icon={MapPin}
                title="Business Address"
                description="Physical location of the client business."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    label="Address Line 1"
                    error={errors.address?.addressLine1?.message}
                  >
                    <Input
                      placeholder="717, Shekhar Central, Palasia Square"
                      disabled={isLoading}
                      {...register("address.addressLine1")}
                    />
                  </FormField>

                  <FormField
                    label="Address Line 2"
                    error={errors.address?.addressLine2?.message}
                  >
                    <Input
                      placeholder="Near..."
                      disabled={isLoading}
                      {...register("address.addressLine2")}
                    />
                  </FormField>

                  <FormField label="City" error={errors.address?.city?.message}>
                    <Input
                      placeholder="Indore"
                      disabled={isLoading}
                      {...register("address.city")}
                    />
                  </FormField>

                  <FormField
                    label="State"
                    error={errors.address?.state?.message}
                  >
                    <Input
                      placeholder="Madhya Pradesh"
                      disabled={isLoading}
                      {...register("address.state")}
                    />
                  </FormField>

                  <FormField
                    label="Country"
                    error={errors.address?.country?.message}
                  >
                    <Input
                      placeholder="India"
                      disabled={isLoading}
                      {...register("address.country")}
                    />
                  </FormField>

                  <FormField
                    label="Postal Code"
                    error={errors.address?.postalCode?.message}
                  >
                    <Input
                      placeholder="452001"
                      disabled={isLoading}
                      {...register("address.postalCode")}
                    />
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField
                      label="Google Maps URL"
                      error={errors.address?.googleMapsUrl?.message}
                    >
                      <Input
                        type="url"
                        placeholder="https://maps.google.com/..."
                        disabled={isLoading}
                        {...register("address.googleMapsUrl")}
                      />
                    </FormField>
                  </div>
                </div>
              </FormSection>

              <FormSection
                icon={Phone}
                title="Contact Information"
                description="Contact details that your chatbot can provide to customers."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Controller
                    name="contact.phone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInputField
                        label="Phone"
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.contact?.phone?.message}
                        required
                        disabled={isLoading}
                      />
                    )}
                  />

                  <Controller
                    name="contact.alternatePhone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInputField
                        label="Alternate Phone"
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.contact?.alternatePhone?.message}
                        disabled={isLoading}
                      />
                    )}
                  />

                  <FormField
                    label="Email"
                    error={errors.contact?.email?.message}
                  >
                    <Input
                      type="email"
                      placeholder="contact@example.com"
                      disabled={isLoading}
                      {...register("contact.email")}
                    />
                  </FormField>

                  <Controller
                    name="contact.whatsapp"
                    control={control}
                    render={({ field }) => (
                      <PhoneInputField
                        label="WhatsApp"
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.contact?.whatsapp?.message}
                        disabled={isLoading}
                      />
                    )}
                  />

                  <div className="sm:col-span-2">
                    <FormField
                      label="Website"
                      error={errors.contact?.website?.message}
                    >
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        disabled={isLoading}
                        {...register("contact.website")}
                      />
                    </FormField>
                  </div>
                </div>
              </FormSection>

              <FormSection
                icon={Bot}
                title="Chatbot Configuration"
                description="Configure the chatbot identity, behavior and predefined questions."
              >
                <div className="space-y-5">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <MessageSquare size={16} className="text-blue-500" />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Basic Chatbot Information
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        label="Chatbot Name"
                        required
                        error={errors.chatbot?.name?.message}
                      >
                        <Input
                          type="text"
                          placeholder="Saviesa AI Assistant"
                          disabled={isLoading}
                          {...register("chatbot.name")}
                        />
                      </FormField>

                      <FormField
                        label="Language"
                        required
                        error={errors.chatbot?.language?.message}
                      >
                        <SelectInput
                          disabled={isLoading}
                          {...register("chatbot.language")}
                        >
                          <option value="english">English</option>
                          <option value="hindi">Hindi</option>
                          <option value="hinglish">Hinglish</option>
                        </SelectInput>
                      </FormField>

                      <FormField
                        label="Tone"
                        required
                        error={errors.chatbot?.tone?.message}
                      >
                        <SelectInput
                          disabled={isLoading}
                          {...register("chatbot.tone")}
                        >
                          <option value="professional">Professional</option>
                          <option value="friendly">Friendly</option>
                          <option value="casual">Casual</option>
                          <option value="formal">Formal</option>
                        </SelectInput>
                      </FormField>

                      <FormField
                        label="Welcome Message"
                        required
                        error={errors.chatbot?.welcomeMessage?.message}
                      >
                        <Textarea
                          rows={3}
                          placeholder="Hi 👋 Welcome to our company..."
                          disabled={isLoading}
                          {...register("chatbot.welcomeMessage")}
                        />
                      </FormField>
                    </div>
                  </div>

                  <div>
                    <FormField
                      label="AI Instructions"
                      error={errors.chatbot?.aiInstructions?.message}
                    >
                      <Textarea
                        rows={14}
                        placeholder="Enter instructions for the AI chatbot..."
                        disabled={isLoading}
                        className="font-mono text-xs leading-5"
                        {...register("chatbot.aiInstructions")}
                      />

                      <p className="mt-1.5 text-[11px] leading-4 text-gray-400">
                        These instructions control what the chatbot knows, how
                        it answers and what information it should not reveal.
                      </p>
                    </FormField>
                  </div>

                  <div>
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <MessageSquare size={16} className="text-blue-500" />

                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Predefined Questions
                          </h4>
                        </div>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Questions customers can quickly ask your chatbot.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus size={15} />
                        Add Question
                      </button>
                    </div>

                    <div className="space-y-3">
                      {questionFields.map((field, index) => (
                        <div
                          key={field.id}
                          draggable={!isLoading}
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(index)}
                          onDragEnd={handleDragEnd}
                          className={`rounded-xl border border-gray-200 bg-gray-50 p-3 transition dark:border-white/10 dark:bg-[#171b23] ${
                            draggedIndex === index ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-9 w-6 shrink-0 cursor-grab items-center justify-center text-gray-400 active:cursor-grabbing dark:text-gray-500"
                              title="Drag to reorder"
                            >
                              <GripVertical size={18} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <FormField
                                label=""
                                error={
                                  errors.chatbot?.predefinedQuestions?.[index]
                                    ?.question?.message
                                }
                              >
                                <Input
                                  type="text"
                                  placeholder="Tell me about Saviesa Infotech"
                                  disabled={isLoading}
                                  {...register(
                                    `chatbot.predefinedQuestions.${index}.question`,
                                  )}
                                />
                              </FormField>
                            </div>

                            <label className="inline-flex shrink-0 cursor-pointer items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <input
                                type="checkbox"
                                disabled={isLoading}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                                {...register(
                                  `chatbot.predefinedQuestions.${index}.enabled`,
                                )}
                              />
                              <span>Enabled</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => remove(index)}
                              disabled={
                                isLoading || questionFields.length === 1
                              }
                              title="Remove question"
                              className="shrink-0 rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-red-500/10"
                            >
                              <Trash2 size={17} />
                            </button>

                            <input
                              type="hidden"
                              {...register(
                                `chatbot.predefinedQuestions.${index}.sortOrder`,
                                {
                                  valueAsNumber: true,
                                },
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FormSection>

              <div className="h-1" />
            </div>
          </div>

          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-gray-200 p-5 sm:flex-row sm:justify-end dark:border-white/10">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Create Client
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

function FormSection({ icon: Icon, title, description, children }) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#11151d]">
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3.5 dark:border-white/10">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>

      <div className="p-4">{children}</div>
    </section>
  );
}

function FormField({ label, required = false, error, children }) {
  return (
    <div className="min-w-0">
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
          {label}

          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

const Input = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className={`h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#171b23] dark:text-white dark:placeholder:text-gray-500 ${className}`}
  />
));

Input.displayName = "Input";

const Textarea = React.forwardRef(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    {...props}
    className={`w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#171b23] dark:text-white dark:placeholder:text-gray-500 ${className}`}
  />
));

Textarea.displayName = "Textarea";

const SelectInput = React.forwardRef(({ className = "", ...props }, ref) => (
  <select
    ref={ref}
    {...props}
    className={`h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#171b23] dark:text-white ${className}`}
  />
));

SelectInput.displayName = "SelectInput";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

import {
  X,
  UserPlus,
  User,
  Building2,
  BriefcaseBusiness,
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
} from "lucide-react";

import { useForm, useFieldArray } from "react-hook-form";

/* ============================================================
   DEFAULT VALUES
============================================================ */

const defaultValues = {
  /* ==========================================================
     ACCOUNT
  ========================================================== */

  fullName: "",
  email: "",
  password: "",

  status: "active",

  /* ==========================================================
     BUSINESS
  ========================================================== */

  businessName: "",
  businessType: "",
  businessDescription: "",

  /* ==========================================================
     ADDRESS
  ========================================================== */

  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    googleMapsUrl: "",
  },

  /* ==========================================================
     CONTACT
  ========================================================== */

  contact: {
    phone: "",
    alternatePhone: "",
    email: "",
    website: "",
    whatsapp: "",
  },

  /* ==========================================================
     CLIENT CONFIGURATION
  ========================================================== */

  clientKey: "",
  slug: "",

  /* ==========================================================
     CHATBOT
  ========================================================== */

  chatbot: {
    name: "",

    welcomeMessage: "",

    language: "english",

    tone: "professional",

    aiInstructions: "",

    predefinedQuestions: [],
  },
};

/* ============================================================
   MODAL
============================================================ */

export default function AdminAddClientModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  /* ==========================================================
     PREDEFINED QUESTIONS ARRAY
  ========================================================== */

  const {
    fields: questionFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "chatbot.predefinedQuestions",
  });

  const businessName = watch("businessName");

  /* ==========================================================
     BODY SCROLL LOCK
  ========================================================== */

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

  /* ==========================================================
     CLOSE
  ========================================================== */

  const handleClose = () => {
    if (loading) return;

    reset(defaultValues);
    onClose?.();
  };

  /* ==========================================================
     SUBMIT
  ========================================================== */

  const submitHandler = async (data) => {
    /*
      Ensure sortOrder always matches
      the current question order.
    */

    const formattedData = {
      ...data,

      chatbot: {
        ...data.chatbot,

        predefinedQuestions: data.chatbot.predefinedQuestions.map(
          (item, index) => ({
            ...item,
            sortOrder: index + 1,
          }),
        ),
      },
    };

    await onSubmit?.(formattedData);
  };

  /* ==========================================================
     GENERATE CLIENT KEY
  ========================================================== */

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

  /* ==========================================================
     ADD QUESTION
  ========================================================== */

  const handleAddQuestion = () => {
    append({
      question: "",
      enabled: true,
      sortOrder: questionFields.length + 1,
    });
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-40

        flex
        items-center
        justify-center

        bg-black/50
        p-4

        backdrop-blur-sm
      "
      role="dialog"
      aria-modal="true"
    >
      {/* ======================================================
          BACKDROP
      ====================================================== */}

      <div
        className="absolute inset-0"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            handleClose();
          }
        }}
      />

      {/* ======================================================
          MODAL
      ====================================================== */}

      <div
        className="
          relative
          z-10

          flex
          max-h-[90vh]
          w-full
          max-w-4xl
          flex-col

          overflow-hidden

          rounded-2xl

          border
          border-gray-200

          bg-white

          shadow-2xl

          dark:border-white/10
          dark:bg-[#171b23]
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between

            border-b
            border-gray-200

            px-5
            py-4

            dark:border-white/10
          "
        >
          <div className="flex min-w-0 items-center gap-3">
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
                text-blue-500
              "
            >
              <UserPlus size={20} />
            </div>

            <div className="min-w-0">
              <h2
                className="
                  truncate

                  text-base
                  font-semibold

                  text-gray-900

                  dark:text-white
                "
              >
                Add New Client
              </h2>

              <p
                className="
                  mt-0.5

                  truncate

                  text-xs

                  text-gray-500

                  dark:text-gray-400
                "
              >
                Create a new client, business and chatbot configuration
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="
              shrink-0

              rounded-lg
              p-2

              text-gray-500

              transition

              hover:bg-gray-100
              hover:text-gray-900

              disabled:cursor-not-allowed
              disabled:opacity-50

              dark:text-gray-400
              dark:hover:bg-white/10
              dark:hover:text-white
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* ====================================================
            FORM
        ==================================================== */}

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="
            flex
            min-h-0
            flex-1
            flex-col
          "
          noValidate
        >
          {/* ==================================================
              SCROLL CONTENT
          ================================================== */}

          <div
            className="
              min-h-0
              flex-1

              overflow-y-auto
              overflow-x-hidden

              overscroll-contain

              p-5

              [scrollbar-width:thin]
              [scrollbar-color:#9ca3af_transparent]

              dark:[scrollbar-color:#4b5563_transparent]
            "
          >
            <div className="space-y-5">
              {/* =================================================
                  ACCOUNT INFORMATION
              ================================================= */}

              <FormSection
                icon={User}
                title="Account Information"
                description="Login credentials for the client."
              >
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  <FormField
                    label="Full Name"
                    required
                    error={errors.fullName?.message}
                  >
                    <Input
                      type="text"
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                      disabled={loading}
                      placeholder="Saviesa Infotech"
                    />
                  </FormField>

                  <FormField
                    label="Email"
                    required
                    error={errors.email?.message}
                  >
                    <Input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                      })}
                      disabled={loading}
                      placeholder="info@example.com"
                    />
                  </FormField>

                  <FormField
                    label="Password"
                    required
                    error={errors.password?.message}
                  >
                    <Input
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      disabled={loading}
                      placeholder="Enter password"
                    />
                  </FormField>

                  <FormField label="Account Status">
                    <SelectInput {...register("status")} disabled={loading}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </SelectInput>
                  </FormField>
                </div>
              </FormSection>

              {/* =================================================
                  BUSINESS INFORMATION
              ================================================= */}

              <FormSection
                icon={Building2}
                title="Business Information"
                description="Basic information about the client's business."
              >
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  <FormField
                    label="Business Name"
                    required
                    error={errors.businessName?.message}
                  >
                    <Input
                      type="text"
                      {...register("businessName", {
                        required: "Business name is required",
                      })}
                      disabled={loading}
                      placeholder="Saviesa Infotech"
                    />
                  </FormField>

                  <FormField
                    label="Business Type"
                    required
                    error={errors.businessType?.message}
                  >
                    <Input
                      type="text"
                      {...register("businessType", {
                        required: "Business type is required",
                      })}
                      disabled={loading}
                      placeholder="IT Software and Technology Company"
                    />
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField
                      label="Business Description"
                      error={errors.businessDescription?.message}
                    >
                      <textarea
                        {...register("businessDescription")}
                        disabled={loading}
                        rows={4}
                        placeholder="Describe the client's business..."
                        className="
                          w-full
                          resize-none
                          rounded-lg

                          border
                          border-gray-200

                          bg-white

                          px-3
                          py-2.5

                          text-sm
                          text-gray-900

                          outline-none

                          transition

                          placeholder:text-gray-400

                          focus:border-blue-500
                          focus:ring-2
                          focus:ring-blue-500/10

                          dark:border-white/10
                          dark:bg-[#171b23]
                          dark:text-white
                          dark:placeholder:text-gray-500
                        "
                      />
                    </FormField>
                  </div>
                </div>
              </FormSection>

              {/* =================================================
                  CLIENT CONFIGURATION
              ================================================= */}

              <FormSection
                icon={KeyRound}
                title="Client Configuration"
                description="Unique identifiers used by the chatbot widget."
              >
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  <FormField
                    label="Client Key"
                    required
                    error={errors.clientKey?.message}
                  >
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        {...register("clientKey", {
                          required: "Client key is required",
                        })}
                        disabled={loading}
                        placeholder="saviesa-infotech"
                      />

                      <button
                        type="button"
                        onClick={generateClientKey}
                        disabled={loading}
                        className="
                          shrink-0

                          rounded-lg

                          border
                          border-gray-200

                          bg-white

                          px-3

                          text-xs
                          font-medium

                          text-gray-700

                          transition

                          hover:bg-gray-50

                          disabled:cursor-not-allowed
                          disabled:opacity-50

                          dark:border-white/10
                          dark:bg-[#171b23]
                          dark:text-gray-300
                          dark:hover:bg-white/5
                        "
                      >
                        Generate
                      </button>
                    </div>

                    <p
                      className="
                        mt-1.5
                        text-[11px]
                        text-gray-400
                      "
                    >
                      Example: saviesa-infotech
                    </p>
                  </FormField>

                  <FormField label="Slug" required error={errors.slug?.message}>
                    <Input
                      type="text"
                      {...register("slug", {
                        required: "Slug is required",
                      })}
                      disabled={loading}
                      placeholder="saviesa-infotech"
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* =================================================
                  BUSINESS ADDRESS
              ================================================= */}

              <FormSection
                icon={MapPin}
                title="Business Address"
                description="Physical location of the client business."
              >
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  <FormField label="Address Line 1">
                    <Input
                      {...register("address.addressLine1")}
                      disabled={loading}
                      placeholder="717, Shekhar Central, Palasia Square"
                    />
                  </FormField>

                  <FormField label="Address Line 2">
                    <Input
                      {...register("address.addressLine2")}
                      disabled={loading}
                      placeholder="Near..."
                    />
                  </FormField>

                  <FormField label="City">
                    <Input
                      {...register("address.city")}
                      disabled={loading}
                      placeholder="Indore"
                    />
                  </FormField>

                  <FormField label="State">
                    <Input
                      {...register("address.state")}
                      disabled={loading}
                      placeholder="Madhya Pradesh"
                    />
                  </FormField>

                  <FormField label="Country">
                    <Input
                      {...register("address.country")}
                      disabled={loading}
                      placeholder="India"
                    />
                  </FormField>

                  <FormField label="Postal Code">
                    <Input
                      {...register("address.postalCode")}
                      disabled={loading}
                      placeholder="452001"
                    />
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField label="Google Maps URL">
                      <Input
                        type="url"
                        {...register("address.googleMapsUrl")}
                        disabled={loading}
                        placeholder="https://maps.google.com/..."
                      />
                    </FormField>
                  </div>
                </div>
              </FormSection>

              {/* =================================================
                  CONTACT INFORMATION
              ================================================= */}

              <FormSection
                icon={Phone}
                title="Contact Information"
                description="Public contact details for the business."
              >
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  <FormField
                    label="Phone"
                    required
                    error={errors.contact?.phone?.message}
                  >
                    <Input
                      type="text"
                      {...register("contact.phone", {
                        required: "Phone is required",
                      })}
                      disabled={loading}
                      placeholder="+91 9993993230"
                    />
                  </FormField>

                  <FormField label="Alternate Phone">
                    <Input
                      type="text"
                      {...register("contact.alternatePhone")}
                      disabled={loading}
                      placeholder="+91 9755755957"
                    />
                  </FormField>

                  <FormField label="Contact Email">
                    <Input
                      type="email"
                      {...register("contact.email")}
                      disabled={loading}
                      placeholder="info@example.com"
                    />
                  </FormField>

                  <FormField label="WhatsApp">
                    <Input
                      type="text"
                      {...register("contact.whatsapp")}
                      disabled={loading}
                      placeholder="+91 9993993230"
                    />
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField label="Website">
                      <Input
                        type="url"
                        {...register("contact.website")}
                        disabled={loading}
                        placeholder="https://example.com"
                      />
                    </FormField>
                  </div>
                </div>
              </FormSection>

              {/* =================================================
                  CHATBOT CONFIGURATION
              ================================================= */}

              <FormSection
                icon={Bot}
                title="Chatbot Configuration"
                description="Configure the chatbot identity, behavior and predefined questions."
              >
                <div className="space-y-5">
                  {/* =================================================
                      BASIC CHATBOT INFORMATION
                  ================================================= */}

                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <MessageSquare size={16} className="text-blue-500" />

                      <h4
                        className="
                          text-sm
                          font-semibold
                          text-gray-900
                          dark:text-white
                        "
                      >
                        Basic Chatbot Information
                      </h4>
                    </div>

                    <div
                      className="
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                      "
                    >
                      <FormField
                        label="Chatbot Name"
                        required
                        error={errors.chatbot?.name?.message}
                      >
                        <Input
                          type="text"
                          {...register("chatbot.name", {
                            required: "Chatbot name is required",
                          })}
                          disabled={loading}
                          placeholder="Saviesa AI Assistant"
                        />
                      </FormField>

                      <FormField
                        label="Language"
                        required
                        error={errors.chatbot?.language?.message}
                      >
                        <SelectInput
                          {...register("chatbot.language", {
                            required: "Language is required",
                          })}
                          disabled={loading}
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
                          {...register("chatbot.tone", {
                            required: "Tone is required",
                          })}
                          disabled={loading}
                        >
                          <option value="professional">Professional</option>

                          <option value="friendly">Friendly</option>

                          <option value="casual">Casual</option>

                          <option value="formal">Formal</option>
                        </SelectInput>
                      </FormField>

                      <FormField label="Welcome Message">
                        <textarea
                          {...register("chatbot.welcomeMessage")}
                          disabled={loading}
                          rows={3}
                          placeholder="Hi 👋 Welcome to our company..."
                          className="
                            w-full
                            resize-none
                            rounded-lg

                            border
                            border-gray-200

                            bg-white

                            px-3
                            py-2.5

                            text-sm
                            text-gray-900

                            outline-none

                            transition

                            placeholder:text-gray-400

                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/10

                            dark:border-white/10
                            dark:bg-[#171b23]
                            dark:text-white
                            dark:placeholder:text-gray-500
                          "
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* =================================================
                      AI INSTRUCTIONS
                  ================================================= */}

                  <div>
                    <FormField
                      label="AI Instructions"
                      required
                      error={errors.chatbot?.aiInstructions?.message}
                    >
                      <textarea
                        {...register("chatbot.aiInstructions", {
                          required: "AI instructions are required",
                        })}
                        disabled={loading}
                        rows={14}
                        placeholder="Enter instructions for the AI chatbot..."
                        className="
                          w-full
                          resize-y
                          rounded-lg

                          border
                          border-gray-200

                          bg-white

                          px-3
                          py-2.5

                          font-mono
                          text-xs
                          leading-5
                          text-gray-900

                          outline-none

                          transition

                          placeholder:font-sans
                          placeholder:text-gray-400

                          focus:border-blue-500
                          focus:ring-2
                          focus:ring-blue-500/10

                          dark:border-white/10
                          dark:bg-[#171b23]
                          dark:text-white
                          dark:placeholder:text-gray-500
                        "
                      />

                      <p
                        className="
                          mt-1.5
                          text-[11px]
                          leading-4
                          text-gray-400
                        "
                      >
                        These instructions control what the chatbot knows, how
                        it answers and what information it should not reveal.
                      </p>
                    </FormField>
                  </div>

                  {/* =================================================
                        PREDEFINED QUESTIONS
                    ================================================= */}

                  <div>
                    <div
                      className="
                        mb-3
                        flex
                        flex-col
                        gap-3

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        "
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <MessageSquare size={16} className="text-blue-500" />

                          <h4
                            className="
                                text-sm
                                font-semibold
                                text-gray-900
                                dark:text-white
                            "
                          >
                            Predefined Questions
                          </h4>
                        </div>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                            "
                        >
                          Questions customers can quickly ask your chatbot.
                        </p>
                      </div>

                      {/* =================================================
                        HEADER ADD BUTTON
                    ================================================= */}

                      {questionFields.length === 0 && (
                        <button
                          type="button"
                          onClick={handleAddQuestion}
                          disabled={loading}
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2

                            rounded-lg

                            bg-blue-600

                            px-3
                            py-2

                            text-xs
                            font-medium
                            text-white

                            transition

                            hover:bg-blue-700

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            "
                        >
                          <Plus size={15} />
                          Add Question
                        </button>
                      )}
                    </div>

                    {/* =================================================
                        EMPTY STATE
                    ================================================= */}

                    {questionFields.length === 0 ? (
                      <div
                        className="
                            rounded-xl

                            border
                            border-dashed
                            border-gray-200

                            p-8

                            text-center

                            dark:border-white/10
                        "
                      >
                        <MessageSquare
                          size={25}
                          className="mx-auto text-gray-400"
                        />

                        <p
                          className="
                            mt-2
                            text-sm
                            font-medium
                            text-gray-900
                            dark:text-white
                            "
                        >
                          No predefined questions
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                            "
                        >
                          Add questions that customers can quickly ask.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* =================================================
                            QUESTIONS
                        ================================================= */}

                        {questionFields.map((field, index) => (
                          <div
                            key={field.id}
                            className="
                                flex
                                flex-col
                                gap-3

                                rounded-xl

                                border
                                border-gray-200

                                bg-gray-50

                                p-3

                                sm:flex-row
                                sm:items-center

                                dark:border-white/10
                                dark:bg-[#0f131b]
                            "
                          >
                            {/* =================================================
                                DRAG / ORDER ICON
                            ================================================= */}

                            <GripVertical
                              size={18}
                              className="
                                hidden
                                shrink-0

                                text-gray-400

                                sm:block
                                "
                            />
                            <div className="min-w-0 flex-1">
                              <input
                                {...register(
                                  `chatbot.predefinedQuestions.${index}.question`,
                                )}
                                placeholder="Enter customer question..."
                                className="
                            w-full
                            rounded-lg
                            border
                            border-gray-200
                            bg-white
                            px-3 py-2.5
                            text-sm
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/10
                            dark:border-white/10
                            dark:bg-[#171b23]
                            dark:text-white
                            dark:placeholder:text-gray-500
                          "
                              />

                              {errors.chatbot?.predefinedQuestions?.[index]
                                ?.question?.message && (
                                <p className="mt-1 text-xs text-red-500">
                                  {
                                    errors.chatbot.predefinedQuestions[index]
                                      .question.message
                                  }
                                </p>
                              )}
                            </div>

                            {/* =================================================
                                ENABLED
                            ================================================= */}

                            <label
                              className="
                                flex
                                shrink-0
                                cursor-pointer
                                items-center
                                gap-2

                                text-xs

                                text-gray-600

                                dark:text-gray-400
                                "
                            >
                              <input
                                type="checkbox"
                                {...register(
                                  `chatbot.predefinedQuestions.${index}.enabled`,
                                )}
                                disabled={loading}
                                className="
                                    h-4
                                    w-4

                                    rounded

                                    border-gray-300

                                    text-blue-600

                                    focus:ring-blue-500

                                    dark:border-gray-600
                                "
                              />
                              Enabled
                            </label>

                            {/* =================================================
                                DELETE
                            ================================================= */}

                            <button
                              type="button"
                              onClick={() => remove(index)}
                              disabled={loading}
                              className="
                                inline-flex
                                shrink-0
                                items-center
                                justify-center

                                rounded-lg

                                p-2

                                text-red-500

                                transition

                                hover:bg-red-500/10

                                disabled:cursor-not-allowed
                                disabled:opacity-30
                                "
                              title="Delete question"
                            >
                              <Trash2 size={17} />
                            </button>

                            {/* =================================================
                                SORT ORDER
                            ================================================= */}

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
                        ))}

                        {/* =================================================
                            BOTTOM ADD BUTTON
                        ================================================= */}

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleAddQuestion}
                            disabled={loading}
                            className="
                                inline-flex
                                items-center
                                gap-2

                                rounded-lg

                                bg-blue-600

                                px-3
                                py-2

                                text-xs
                                font-medium
                                text-white

                                transition

                                hover:bg-blue-700

                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                          >
                            <Plus size={15} />
                            Add Question
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </FormSection>

              {/* Bottom spacing */}

              <div className="h-1" />
            </div>
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div
            className="
              flex
              shrink-0
              flex-col-reverse
              gap-3

              border-t
              border-gray-200

              p-5

              sm:flex-row
              sm:justify-end

              dark:border-white/10
            "
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="
                rounded-lg

                border
                border-gray-200

                px-4
                py-2.5

                text-sm
                font-medium

                text-gray-700

                transition

                hover:bg-gray-50

                disabled:cursor-not-allowed
                disabled:opacity-50

                dark:border-white/10
                dark:text-gray-300
                dark:hover:bg-white/5
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                items-center
                justify-center
                gap-2

                rounded-lg

                bg-blue-600

                px-5
                py-2.5

                text-sm
                font-medium

                text-white

                transition

                hover:bg-blue-700

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
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

/* ============================================================
   FORM SECTION
============================================================ */

function FormSection({ icon: Icon, title, description, children }) {
  return (
    <section
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
      {/* SECTION HEADER */}

      <div
        className="
          flex
          items-center
          gap-3

          border-b
          border-gray-200

          px-4
          py-3.5

          dark:border-white/10
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
            text-blue-500
          "
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <h3
            className="
              text-sm
              font-semibold

              text-gray-900

              dark:text-white
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-0.5

              text-xs

              text-gray-500

              dark:text-gray-400
            "
          >
            {description}
          </p>
        </div>
      </div>

      {/* SECTION CONTENT */}

      <div className="p-4">{children}</div>
    </section>
  );
}

/* ============================================================
   FORM FIELD
============================================================ */

function FormField({ label, required = false, error, children }) {
  return (
    <div className="min-w-0">
      <label
        className="
          mb-1.5

          block

          text-xs
          font-medium

          text-gray-700

          dark:text-gray-300
        "
      >
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {error && (
        <p
          className="
            mt-1.5

            text-xs

            text-red-500

            dark:text-red-400
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   INPUT
============================================================ */

const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={`
          h-10
          w-full

          rounded-lg

          border
          border-gray-200

          bg-white

          px-3

          text-sm
          text-gray-900

          outline-none

          transition

          placeholder:text-gray-400

          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/10

          disabled:cursor-not-allowed
          disabled:opacity-60

          dark:border-white/10
          dark:bg-[#171b23]
          dark:text-white
          dark:placeholder:text-gray-500

          ${className}
        `}
    />
  );
});

Input.displayName = "Input";

/* ============================================================
   SELECT
============================================================ */

const SelectInput = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <select
      ref={ref}
      {...props}
      className={`
          h-10
          w-full

          rounded-lg

          border
          border-gray-200

          bg-white

          px-3

          text-sm
          text-gray-900

          outline-none

          transition

          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/10

          disabled:cursor-not-allowed
          disabled:opacity-60

          dark:border-white/10
          dark:bg-[#171b23]
          dark:text-white

          ${className}
        `}
    />
  );
});

SelectInput.displayName = "SelectInput";

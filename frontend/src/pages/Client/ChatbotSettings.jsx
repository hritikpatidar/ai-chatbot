import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bot,
  Building2,
  MapPin,
  Phone,
  Globe,
  Plus,
  Trash2,
  Save,
  X,
  GripVertical,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  getClientById,
  updateClient,
} from "../../redux/features/Client/clientSlice";
import { formSchema } from "../../utils/validation";
import CustomSelect from "../../components/common/CustomSelect";
import PhoneInputField from "../../components/common/PhoneInputField";

const defaultValues = {
  businessName: "",
  businessType: "",
  businessDescription: "",

  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
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

  chatbot: {
    name: "AI Assistant",
    welcomeMessage: "Hi 👋 Welcome! How can I help you today?",
    language: "english",
    tone: "friendly",
    aiInstructions: "",
    predefinedQuestions: [],
  },

  status: "active",
};

export default function ClientChatbotSettings() {
  const dispatch = useDispatch();

  const { client, loading } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );
  const [draggedIndex, setDraggedIndex] = useState(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "chatbot.predefinedQuestions",
  });

  useEffect(() => {
    if (!message.text) return;

    const timer = setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [message.text]);

  useEffect(() => {
    if (client?.businessId) {
      dispatch(getClientById(client?.businessId));
    }
  }, [dispatch, client?.businessId]);

  useEffect(() => {
    if (!client) return;
    reset({
      businessName: client.businessName || "",
      businessType: client.businessType || "",
      businessDescription: client.businessDescription || "",
      address: {
        addressLine1: client.address?.addressLine1 || "",
        addressLine2: client.address?.addressLine2 || "",
        city: client.address?.city || "",
        state: client.address?.state || "",
        country: client.address?.country || "",
        postalCode: client.address?.postalCode || "",
        googleMapsUrl: client.address?.googleMapsUrl || "",
      },

      contact: {
        phone: client.contact?.phone || "",
        alternatePhone: client.contact?.alternatePhone || "",
        email: client.contact?.email || "",
        website: client.contact?.website || "",
        whatsapp: client.contact?.whatsapp || "",
      },

      chatbot: {
        name: client.chatbot?.name || "AI Assistant",
        welcomeMessage:
          client.chatbot?.welcomeMessage ||
          "Hi 👋 Welcome! How can I help you today?",
        language: client.chatbot?.language || "english",
        tone: client.chatbot?.tone || "friendly",
        aiInstructions: client.chatbot?.aiInstructions || "",
        predefinedQuestions: client.chatbot?.predefinedQuestions || [],
      },
      status: client.status || "active",
    });
  }, [client, reset]);

  const onSubmit = async (data) => {
    if (!client?.businessId) return;
    setSaving(true);
    setMessage({
      type: "",
      text: "",
    });

    try {
      const payload = {
        businessName: data.businessName,
        businessType: data.businessType,
        businessDescription: data.businessDescription,
        address: {
          addressLine1: data.address.addressLine1,
          addressLine2: data.address.addressLine2,
          city: data.address.city,
          state: data.address.state,
          country: data.address.country,
          postalCode: data.address.postalCode,
          googleMapsUrl: data.address.googleMapsUrl,
        },
        contact: {
          phone: data.contact.phone,
          alternatePhone: data.contact.alternatePhone,
          email: data.contact.email,
          website: data.contact.website,
          whatsapp: data.contact.whatsapp,
        },
        chatbot: {
          name: data.chatbot.name,
          welcomeMessage: data.chatbot.welcomeMessage,
          language: data.chatbot.language,
          tone: data.chatbot.tone,
          aiInstructions: data.chatbot.aiInstructions,
          predefinedQuestions: data.chatbot.predefinedQuestions.map(
            (item, index) => ({
              ...item,
              sortOrder: index + 1,
            }),
          ),
        },
        status: data.status,
      };

      const response = await dispatch(
        updateClient({ clientId: client?.businessId, payload }),
      ).unwrap();
      if (response?.success) {
        setMessage({
          type: "success",
          text: response.message || "Client settings updated successfully.",
        });

        dispatch(getClientById(client?.businessId));
      } else {
        setMessage({
          type: "error",
          text: response?.data?.message || "Unable to update client settings.",
        });
      }
    } catch (error) {
      console.error("Update client settings error:", error);

      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          "Something went wrong while updating settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDragStart = (index) => {
    if (loading) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (targetIndex) => {
    if (loading || draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    move(draggedIndex, targetIndex);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (loading && !client) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={30} />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-transparent text-gray-900 dark:text-white">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bot size={25} className="text-blue-600 dark:text-blue-400" />

            <h1 className="text-2xl font-semibold tracking-tight">
              Chatbot Settings
            </h1>
          </div>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your business information, contact details, chatbot
            configuration and AI instructions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={client?.status} />

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={saving || !isDirty}
            className="
                inline-flex items-center justify-center gap-2
                rounded-xl
                bg-blue-600
                px-4 py-2.5
                text-sm font-medium text-white
                shadow-sm
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
          >
            {saving ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`
              mb-6 flex items-start gap-3 rounded-xl
              border p-4
              ${
                message.type === "success"
                  ? `
                    border-green-200
                    bg-green-50
                    text-green-700
                    dark:border-green-500/20
                    dark:bg-green-500/10
                    dark:text-green-400
                  `
                  : `
                    border-red-200
                    bg-red-50
                    text-red-700
                    dark:border-red-500/20
                    dark:bg-red-500/10
                    dark:text-red-400
                  `
              }
            `}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={19} />
          ) : (
            <AlertCircle size={19} />
          )}

          <p className="text-sm">{message.text}</p>

          <button
            type="button"
            onClick={() =>
              setMessage({
                type: "",
                text: "",
              })
            }
            className="ml-auto"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* BUSINESS DETAILS */}

          <SectionCard
            icon={Building2}
            title="Business Information"
            description="Basic information about your business."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormInput
                label="Business Name"
                required
                placeholder="ABC Books"
                error={errors.businessName?.message}
                {...register("businessName")}
              />

              <FormInput
                label="Business Type"
                required
                placeholder="Book Store"
                error={errors.businessType?.message}
                {...register("businessType")}
              />

              <div className="md:col-span-2">
                <FormTextarea
                  label="Business Description"
                  placeholder="Tell customers about your business..."
                  rows={4}
                  error={errors.businessDescription?.message}
                  {...register("businessDescription")}
                />
              </div>
            </div>
          </SectionCard>

          {/* ADDRESS */}

          <SectionCard
            icon={MapPin}
            title="Business Address"
            description="Add the physical location of your business."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormInput
                label="Address Line 1"
                placeholder="12 Main Market"
                {...register("address.addressLine1")}
              />

              <FormInput
                label="Address Line 2"
                placeholder="Near City Mall"
                {...register("address.addressLine2")}
              />

              <FormInput
                label="City"
                placeholder="Neemuch"
                {...register("address.city")}
              />

              <FormInput
                label="State"
                placeholder="Madhya Pradesh"
                {...register("address.state")}
              />

              <FormInput
                label="Country"
                placeholder="India"
                {...register("address.country")}
              />

              <FormInput
                label="Postal Code"
                placeholder="458441"
                {...register("address.postalCode")}
              />

              <div className="md:col-span-2">
                <FormInput
                  label="Google Maps URL"
                  placeholder="https://maps.google.com/..."
                  error={errors.address?.googleMapsUrl?.message}
                  {...register("address.googleMapsUrl")}
                />
              </div>
            </div>
          </SectionCard>

          {/* CONTACT */}

          <SectionCard
            icon={Phone}
            title="Contact Information"
            description="Contact details that your chatbot can provide to customers."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Phone */}
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
                  />
                )}
              />

              {/* Alternate Phone */}
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
                  />
                )}
              />

              {/* Email */}
              <FormInput
                label="Email"
                type="email"
                placeholder="contact@example.com"
                error={errors.contact?.email?.message}
                {...register("contact.email")}
              />

              {/* WhatsApp */}
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
                  />
                )}
              />

              {/* Website */}
              <div className="md:col-span-2">
                <FormInput
                  label="Website"
                  placeholder="https://example.com"
                  error={errors.contact?.website?.message}
                  {...register("contact.website")}
                />
              </div>
            </div>
          </SectionCard>

          {/* CHATBOT */}

          <SectionCard
            icon={Bot}
            title="Chatbot Configuration"
            description="Configure how your AI chatbot appears and communicates with customers."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormInput
                label="Bot Name"
                required
                placeholder="ABC Books Assistant"
                error={errors.chatbot?.name?.message}
                {...register("chatbot.name")}
              />

              {/* Language */}
              <Controller
                name="chatbot.language"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    size="sm"
                    label="Language"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      {
                        value: "english",
                        label: "English",
                      },
                      {
                        value: "hindi",
                        label: "Hindi",
                      },
                      {
                        value: "hinglish",
                        label: "Hinglish",
                      },
                    ]}
                    placeholder="Select language"
                    error={errors.chatbot?.language?.message}
                    required
                  />
                )}
              />

              {/* Tone */}
              <Controller
                name="chatbot.tone"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    size="sm"
                    label="Tone"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      {
                        value: "friendly",
                        label: "Friendly",
                      },
                      {
                        value: "professional",
                        label: "Professional",
                      },
                      {
                        value: "casual",
                        label: "Casual",
                      },
                      {
                        value: "formal",
                        label: "Formal",
                      },
                    ]}
                    placeholder="Select tone"
                    error={errors.chatbot?.tone?.message}
                    required
                  />
                )}
              />

              {/* Status */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    size="sm"
                    label="Business Status"
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
                    placeholder="Select status"
                    error={errors.status?.message}
                    required
                  />
                )}
              />

              <div className="md:col-span-2">
                <FormTextarea
                  label="Welcome Message"
                  rows={3}
                  placeholder="Hi 👋 Welcome! How can I help you today?"
                  error={errors.chatbot?.welcomeMessage?.message}
                  {...register("chatbot.welcomeMessage")}
                />
              </div>

              <div className="md:col-span-2">
                <FormTextarea
                  label="AI Instructions"
                  rows={7}
                  placeholder="Tell the AI how it should help customers..."
                  error={errors.chatbot?.aiInstructions?.message}
                  {...register("chatbot.aiInstructions")}
                />

                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  These instructions guide the chatbot's behavior for this
                  business.
                </p>
              </div>
            </div>
          </SectionCard>

          {/* PREDEFINED QUESTIONS */}

          <SectionCard
            icon={MessageCircle}
            title="Predefined Questions"
            description="Questions customers can quickly ask your chatbot."
            action={
              fields.length === 0 && (
                <button
                  type="button"
                  onClick={() =>
                    append({
                      question: "",
                      enabled: true,
                      sortOrder: fields.length + 1,
                    })
                  }
                  className="
                    inline-flex items-center gap-2
                    rounded-lg
                    bg-blue-600
                    px-3 py-2
                    text-xs font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  <Plus size={15} />
                  Add Question
                </button>
              )
            }
          >
            {fields.length === 0 ? (
              <div
                className="
                    rounded-xl
                    border border-dashed
                    border-gray-200
                    p-8
                    text-center
                    dark:border-white/10
                  "
              >
                <MessageCircle size={25} className="mx-auto text-gray-400" />

                <p className="mt-2 text-sm font-medium">
                  No predefined questions
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Add questions that customers can quickly ask.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    draggable={!loading}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={handleDragEnd}
                    className="
                        flex flex-col gap-3
                        rounded-xl
                        border border-gray-200
                        bg-gray-50
                        p-3
                        sm:flex-row
                        sm:items-center
                        dark:border-white/10
                        dark:bg-[#0f131b]
                      "
                  >
                    <div
                      className="flex h-9 w-6 shrink-0 cursor-grab items-center justify-center text-gray-400 active:cursor-grabbing dark:text-gray-500"
                      title="Drag to reorder"
                    >
                      <GripVertical size={18} />
                    </div>

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

                      {errors.chatbot?.predefinedQuestions?.[index]?.question
                        ?.message && (
                        <p className="mt-1 text-xs text-red-500">
                          {
                            errors.chatbot.predefinedQuestions[index].question
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <label
                      className="
                          flex cursor-pointer
                          items-center gap-2
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
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Enabled
                    </label>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="
                          inline-flex
                          items-center
                          justify-center
                          rounded-lg
                          p-2
                          text-red-500
                          transition
                          hover:bg-red-500/10
                        "
                      title="Delete question"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}

                {/* Bottum add button */}
                {fields.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        append({
                          question: "",
                          enabled: true,
                          sortOrder: fields.length + 1,
                        })
                      }
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
                      "
                    >
                      <Plus size={15} />
                      Add Question
                    </button>
                  </div>
                )}
              </div>
            )}
          </SectionCard>

          {message.text && (
            <div
              className={`
              mb-6 flex items-start gap-3 rounded-xl
              border p-4
              ${
                message.type === "success"
                  ? `
                    border-green-200
                    bg-green-50
                    text-green-700
                    dark:border-green-500/20
                    dark:bg-green-500/10
                    dark:text-green-400
                  `
                  : `
                    border-red-200
                    bg-red-50
                    text-red-700
                    dark:border-red-500/20
                    dark:bg-red-500/10
                    dark:text-red-400
                  `
              }
            `}
            >
              {message.type === "success" ? (
                <CheckCircle2 size={19} />
              ) : (
                <AlertCircle size={19} />
              )}

              <p className="text-sm">{message.text}</p>

              <button
                type="button"
                onClick={() =>
                  setMessage({
                    type: "",
                    text: "",
                  })
                }
                className="ml-auto"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* BOTTOM SAVE */}

          <div
            className="
                flex flex-col gap-3
                rounded-2xl
                border border-gray-200
                bg-white
                p-4
                shadow-sm
                sm:flex-row
                sm:items-center
                sm:justify-between
                dark:border-white/10
                dark:bg-[#171b23]
              "
          >
            <div>
              <p className="text-sm font-medium">Save your changes</p>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Changes will immediately update your business chatbot
                configuration.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || !isDirty}
              className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5 py-2.5
                  text-sm font-medium
                  text-white
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
            >
              {saving ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

//  SECTION CARD

function SectionCard({ icon: Icon, title, description, children, action }) {
  return (
    <section
      className="
        rounded-2xl
        border border-gray-200
        bg-white
        shadow-sm
        dark:border-white/10
        dark:bg-[#171b23]
      "
    >
      <div
        className="
          flex flex-col gap-3
          border-b border-gray-200
          px-5 py-4
          sm:flex-row
          sm:items-center
          sm:justify-between
          dark:border-white/10
        "
      >
        <div className="flex items-start gap-3">
          <div
            className="
              flex h-10 w-10
              shrink-0
              items-center justify-center
              rounded-xl
              bg-blue-500/10
              text-blue-600
              dark:text-blue-400
            "
          >
            <Icon size={20} />
          </div>

          <div>
            <h2 className="text-sm font-semibold">{title}</h2>

            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>

        {action}
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

//  INPUT

const FormInput = ({ label, required, error, className = "", ...props }) => {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        {...props}
        className={`
          w-full
          rounded-xl
          border
          ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 focus:border-blue-500"
          }
          bg-white
          px-3.5 py-2.5
          text-sm
          text-gray-900
          outline-none
          transition
          focus:ring-2
          focus:ring-blue-500/10
          dark:border-white/10
          dark:bg-[#0f131b]
          dark:text-white
          dark:placeholder:text-gray-500
          ${error ? "dark:border-red-500/60" : ""}
        `}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

//  TEXTAREA

const FormTextarea = ({ label, required, error, className = "", ...props }) => {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <textarea
        {...props}
        className={`
          w-full
          resize-y
          rounded-xl
          border
          ${error ? "border-red-400" : "border-gray-200"}
          bg-white
          px-3.5 py-2.5
          text-sm
          text-gray-900
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/10
          dark:border-white/10
          dark:bg-[#0f131b]
          dark:text-white
          dark:placeholder:text-gray-500
          ${error ? "dark:border-red-500/60" : ""}
        `}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

//  STATUS BADGE

function StatusBadge({ status }) {
  const active = status === "active";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full
        px-3 py-1.5
        text-xs font-medium
        ${
          active
            ? `
              bg-green-500/10
              text-green-700
              dark:text-green-400
            `
            : `
              bg-gray-500/10
              text-gray-600
              dark:text-gray-400
            `
        }
      `}
    >
      <span
        className={`
          h-1.5 w-1.5 rounded-full
          ${active ? "bg-green-500" : "bg-gray-400"}
        `}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}

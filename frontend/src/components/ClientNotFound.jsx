import { AlertCircle, ArrowLeft, Building2, Mail } from "lucide-react";

export default function ClientNotFound() {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleContactAdmin = () => {
    window.location.href = "mailto:support@example.com";
  };

  return (
    <div
      className="
        flex  w-full items-center justify-center
        overflow-hidden
        bg-gray-50 px-4
        dark:bg-[#0d1117]
      "
    >
      <div className="w-full max-w-md">
        <div
          className="
            overflow-hidden rounded-2xl
            border border-gray-200
            bg-white
            shadow-sm
            dark:border-white/10
            dark:bg-[#171b23]
          "
        >
          {/* Top accent */}
          <div className="h-1 w-full bg-blue-600" />

          <div className="px-5 py-7 sm:px-8 sm:py-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div
                className="
                  flex h-14 w-14 items-center justify-center
                  rounded-xl
                  bg-blue-500/10
                  text-blue-600
                  dark:text-blue-400
                "
              >
                <Building2 size={28} strokeWidth={1.7} />
              </div>
            </div>

            {/* Badge */}
            <div className="mt-3 flex justify-center">
              <span
                className="
                  inline-flex items-center gap-1.5
                  rounded-full
                  bg-red-50 px-2.5 py-1
                  text-[11px] font-medium text-red-600
                  dark:bg-red-500/10
                  dark:text-red-400
                "
              >
                <AlertCircle size={12} />
                Chatbot Unavailable
              </span>
            </div>

            {/* Content */}
            <div className="mt-4 text-center">
              <h1
                className="
                  text-xl font-bold
                  text-gray-900
                  sm:text-2xl
                  dark:text-white
                "
              >
                Chatbot Is Currently Unavailable
              </h1>

              <p
                className="
                  mx-auto mt-2 max-w-sm
                  text-xs leading-5
                  text-gray-500
                  sm:text-sm
                  dark:text-gray-400
                "
              >
                Your administrator does not currently have an active chatbot
                plan. You’ll be able to chat with them once an active chatbot
                plan has been purchased.
              </p>
            </div>

            {/* Info */}
            <div
              className="
                mt-5 flex items-center gap-3
                rounded-xl
                border border-gray-200
                bg-gray-50
                px-3 py-3
                dark:border-white/10
                dark:bg-white/3
              "
            >
              <div
                className="
                  flex h-8 w-8 shrink-0 items-center justify-center
                  rounded-lg
                  bg-blue-500/10
                  text-blue-600
                  dark:text-blue-400
                "
              >
                <AlertCircle size={15} />
              </div>

              <p
                className="
                  text-xs leading-5
                  text-gray-500
                  dark:text-gray-400
                "
              >
                In the meantime, you can contact your administrator directly via
                email for any assistance.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={handleGoBack}
                className="
                  inline-flex h-10 flex-1 items-center justify-center gap-2
                  rounded-xl
                  border border-gray-200
                  bg-white
                  px-4
                  text-sm font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  active:scale-[0.98]
                  dark:border-white/10
                  dark:bg-white/3
                  dark:text-gray-200
                  dark:hover:bg-white/6
                "
              >
                <ArrowLeft size={15} />
                Go Back
              </button>

              <button
                type="button"
                onClick={handleContactAdmin}
                className="
                  inline-flex h-10 flex-1 items-center justify-center gap-2
                  rounded-xl
                  bg-blue-600
                  px-4
                  text-sm font-medium
                  text-white
                  transition
                  hover:bg-blue-700
                  active:scale-[0.98]
                "
              >
                <Mail size={15} />
                Contact Admin
              </button>
            </div>
          </div>
        </div>

        <p
          className="
            mt-3 text-center
            text-[11px] text-gray-400
            dark:text-gray-500
          "
        >
          Chatbot access will become available once the administrator activates
          a chatbot plan.
        </p>
      </div>
    </div>
  );
}

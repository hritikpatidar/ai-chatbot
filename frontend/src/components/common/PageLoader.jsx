import { useLanguage } from "../../context/LanguageContext";

export default function PageLoader() {
  const { t } = useLanguage();

  return (
    <div
      className="
        flex min-h-screen items-center justify-center
        bg-gray-50 text-gray-900
        transition-colors duration-300
        dark:bg-[#0b0f17] dark:text-white
      "
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="
            h-8 w-8
            animate-spin
            rounded-full
            border-2
            border-gray-300
            border-t-cyan-500
            dark:border-gray-700
            dark:border-t-cyan-400
          "
        />

        <p
          className="
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          {t("Loading...")}
        </p>
      </div>
    </div>
  );
}
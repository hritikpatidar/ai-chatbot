import React from "react";
import { Circle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { translateShared } from "../../context/translations/sharedComponents";

export default function AdminClientStatus({
  status = "inactive",
  className = "",
}) {
  const { t, language } = useLanguage();
  const isActive =
    status === true || status === "active" || status === "Active";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1
        text-xs
        font-medium
        ${
          isActive
            ? `
              bg-emerald-50
              text-emerald-600
              dark:bg-emerald-500/10
              dark:text-emerald-400
            `
            : `
              bg-gray-100
              text-gray-500
              dark:bg-white/5
              dark:text-gray-400
            `
        }
        ${className}
      `}
    >
      <Circle size={7} fill="currentColor" className="shrink-0" />

      {translateShared(isActive ? "Active" : "Inactive", t, language)}
    </span>
  );
}

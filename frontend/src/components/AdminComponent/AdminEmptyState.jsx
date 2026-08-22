import React from "react";
import { Inbox } from "lucide-react";

export default function AdminEmptyState({
  title = "No data found",
  description = "There is no data available at the moment.",
  icon: Icon = Inbox,
  action,
}) {
  return (
    <div
      className="
        flex
        min-h-70
        flex-col
        items-center
        justify-center
        rounded-xl
        border
        border-dashed
        border-gray-200
        bg-white
        px-5
        py-10
        text-center
        dark:border-white/10
        dark:bg-[#11151d]
      "
    >
      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-xl
          bg-gray-100
          text-gray-500
          dark:bg-white/5
          dark:text-gray-400
        "
      >
        <Icon size={25} />
      </div>

      <h3
        className="
          mt-4
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
          mt-1
          max-w-sm
          text-xs
          leading-5
          text-gray-500
          dark:text-gray-400
        "
      >
        {description}
      </p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

import React from "react";

export default function AdminStatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass = "",
  trend,
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        dark:border-white/10
        dark:bg-[#171b23]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="
              text-xs
              font-medium
              text-gray-500
              dark:text-gray-400
            "
          >
            {title}
          </p>

          <h3
            className="
              mt-2
              text-2xl
              font-bold
              tracking-tight
              text-gray-900
              dark:text-white
            "
          >
            {value}
          </h3>

          {description && (
            <p
              className="
                mt-1.5
                text-[11px]
                text-gray-500
                dark:text-gray-400
              "
            >
              {description}
            </p>
          )}
        </div>

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${iconClass}
          `}
        >
          <Icon size={20} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className="
              rounded-md
              bg-green-500/10
              px-1.5
              py-1
              text-[10px]
              font-semibold
              text-green-600
              dark:text-green-400
            "
          >
            {trend}
          </span>

          <span
            className="
              text-[10px]
              text-gray-400
              dark:text-gray-500
            "
          >
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}
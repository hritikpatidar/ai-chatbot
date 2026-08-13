import { FileQuestion, Plus } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  description = "There is no data available at the moment.",
  buttonText = "",
  onButtonClick,
  icon: Icon = FileQuestion,
}) {
  return (
    <div
      className="
        flex
        min-h-70
        w-full
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-gray-200
        bg-white
        px-5
        py-10
        text-center
        dark:border-white/10
        dark:bg-[#171b23]
      "
    >
      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-blue-500/10
          text-blue-600
          dark:text-blue-400
        "
      >
        <Icon size={26} />
      </div>

      <h3
        className="
          mt-4
          text-base
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
          max-w-md
          text-sm
          leading-6
          text-gray-500
          dark:text-gray-400
        "
      >
        {description}
      </p>

      {buttonText && onButtonClick && (
        <button
          type="button"
          onClick={onButtonClick}
          className="
            mt-5
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-blue-600
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          <Plus size={16} />
          {buttonText}
        </button>
      )}
    </div>
  );
}

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page = 1,
  totalPages = 1,
  total = 0,
  currentItems = 0,
  onPrevious,
  onNext,
  isFetching = false,
  itemName = "items",
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className="
        mt-5
        flex
        flex-col
        gap-3
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      {/* Showing count */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {currentItems}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {total}
        </span>{" "}
        {itemName}
      </p>

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={page <= 1 || isFetching}
          className="
            inline-flex
            items-center
            gap-1
            rounded-lg
            border
            border-gray-200
            bg-white
            px-3
            py-2
            text-sm
            font-medium
            text-gray-700
            transition
            hover:border-blue-500
            hover:text-blue-600
            disabled:cursor-not-allowed
            disabled:opacity-40
            dark:border-white/10
            dark:bg-[#171b23]
            dark:text-gray-200
            dark:hover:border-blue-500
            dark:hover:text-blue-400
          "
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {/* Current page */}
        <span
          className="
            rounded-lg
            bg-blue-600
            px-3
            py-2
            text-sm
            font-medium
            text-white
          "
        >
          {page}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages || isFetching}
          className="
            inline-flex
            items-center
            gap-1
            rounded-lg
            border
            border-gray-200
            bg-white
            px-3
            py-2
            text-sm
            font-medium
            text-gray-700
            transition
            hover:border-blue-500
            hover:text-blue-600
            disabled:cursor-not-allowed
            disabled:opacity-40
            dark:border-white/10
            dark:bg-[#171b23]
            dark:text-gray-200
            dark:hover:border-blue-500
            dark:hover:text-blue-400
          "
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

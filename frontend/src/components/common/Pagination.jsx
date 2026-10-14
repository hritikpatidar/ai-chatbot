import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page = 1,
  totalPages = 0,
  total = 0,
  currentCount = 0,
  isFetching = false,
  onPrevious,
  onNext,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className="
        mt-5
        flex
        flex-row
        items-center
        justify-between
        gap-2
        w-full
        min-w-0
      "
    >
      {/* Showing Count */}
      <p
        className="
          min-w-0
          text-xs
          sm:text-sm
          text-gray-500
          dark:text-gray-400
          whitespace-nowrap
        "
      >
        Showing{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {currentCount}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {total}
        </span>
      </p>

      {/* Pagination Buttons */}
      <div
        className="
          flex
          shrink-0
          items-center
          gap-1
          sm:gap-2
          whitespace-nowrap
        "
      >
        <button
          type="button"
          onClick={onPrevious}
          disabled={page <= 1 || isFetching}
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
            gap-1
            rounded-lg
            border
            border-gray-200
            bg-white
            px-2
            py-1.5
            sm:px-3
            sm:py-2
            text-xs
            sm:text-sm
            font-medium
            text-gray-700
            hover:border-blue-500
            hover:text-blue-600
            disabled:cursor-not-allowed
            disabled:opacity-40
            dark:border-white/10
            dark:bg-[#171b23]
            dark:text-gray-200
          "
        >
          <ChevronLeft size={14} className="shrink-0 sm:hidden" />
          <ChevronLeft size={16} className="hidden shrink-0 sm:block" />
          Previous
        </button>

        <span
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-blue-600
            px-2.5
            py-1.5
            sm:px-3
            sm:py-2
            text-xs
            sm:text-sm
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
            shrink-0
            items-center
            justify-center
            gap-1
            rounded-lg
            border
            border-gray-200
            bg-white
            px-2
            py-1.5
            sm:px-3
            sm:py-2
            text-xs
            sm:text-sm
            font-medium
            text-gray-700
            hover:border-blue-500
            hover:text-blue-600
            disabled:cursor-not-allowed
            disabled:opacity-40
            dark:border-white/10
            dark:bg-[#171b23]
            dark:text-gray-200
          "
        >
          Next
          <ChevronRight size={14} className="shrink-0 sm:hidden" />
          <ChevronRight size={16} className="hidden shrink-0 sm:block" />
        </button>
      </div>
    </div>
  );
}

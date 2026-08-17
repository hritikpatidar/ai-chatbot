import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function CustomSelect({
  label,
  rounded = "rounded-xl",
  name,
  value = "",
  onChange,
  options = [],
  placeholder = "Select an option",
  error = "",
  required = false,
  disabled = false,
  size = "md",
  className = "",
  labelClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);

  const sizeClasses = {
    sm: {
      button: "h-10 px-3 text-xs",
      icon: 15,
      menu: "text-xs",
    },

    md: {
      button: "h-11 px-3.5 text-sm",
      icon: 17,
      menu: "text-sm",
    },

    lg: {
      button: "h-12 px-4 text-sm",
      icon: 18,
      menu: "text-sm",
    },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    if (option.disabled) return;

    onChange?.({
      target: {
        name,
        value: option.value,
      },
    });

    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className={`
            mb-2
            block
            text-sm
            font-medium
            text-gray-700
            dark:text-gray-300
            ${labelClassName}
          `}
        >
          {label}

          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* Dropdown */}
      <div className="relative">
        <button
          type="button"
          id={name}
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
            flex
            w-full
            items-center
            justify-between
            gap-3
            ${rounded}
            border
            bg-white
            px-4
            text-left
            text-sm
            text-gray-900
            outline-none
            transition-all
            duration-200

            ${currentSize.button}

            ${
              error
                ? `
                  border-red-400
                  hover:border-red-500
                  focus:border-red-500
                  focus:ring-1
                  focus:ring-red-500
                `
                : `
                  border-gray-200
                  hover:border-gray-300

                  ${
                    isOpen
                      ? `
                        border-blue-500
                        ring-1
                        ring-blue-500
                      `
                      : ""
                  }
                `
            }

            disabled:cursor-not-allowed
            disabled:opacity-60
            disabled:bg-gray-100

            dark:bg-[#11151d]
            dark:text-white
            dark:border-white/10
            dark:hover:border-white/20

            ${
              isOpen && !error
                ? `
                  dark:border-blue-500
                  dark:ring-1
                  dark:ring-blue-500
                `
                : ""
            }

            dark:disabled:bg-white/5
          `}
        >
          {/* Selected Value */}
          <span
            className={`
              min-w-0
              flex-1
              truncate
              ${
                selectedOption
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400 dark:text-gray-500"
              }
            `}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          {/* Arrow */}
          <ChevronDown
            size={currentSize.icon}
            className={`
              shrink-0
              text-gray-400
              transition-transform
              duration-200
              dark:text-gray-500
              ${isOpen ? "rotate-180 text-blue-500" : ""}
            `}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div
            className="
              absolute
              left-0
              right-0
              z-50
              mt-2
              overflow-hidden
              rounded-xl
              border
              border-gray-200
              bg-white
              p-1.5
              shadow-xl
              shadow-gray-200/50
              animate-in
              fade-in
              slide-in-from-top-1
              duration-150

              dark:border-white/10
              dark:bg-[#171b23]
              dark:shadow-black/30
            "
          >
            <div className="max-h-60 overflow-y-auto">
              {options.length === 0 ? (
                <div
                  className="
                    px-3
                    py-3
                    text-center
                    text-xs
                    text-gray-400
                    dark:text-gray-500
                  "
                >
                  No options available
                </div>
              ) : (
                options.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={option.disabled}
                      onClick={() => handleSelect(option)}
                      className={`
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        ${currentSize.menu}
                        transition-colors

                        ${
                          option.disabled
                            ? `
                              cursor-not-allowed
                              opacity-40
                            `
                            : `
                              cursor-pointer
                              hover:bg-gray-100
                              dark:hover:bg-white/5
                            `
                        }

                        ${
                          isSelected
                            ? `
                              bg-blue-50
                              text-blue-600
                              dark:bg-blue-500/10
                              dark:text-blue-400
                            `
                            : `
                              text-gray-700
                              dark:text-gray-300
                            `
                        }
                      `}
                    >
                      <span className="truncate">{option.label}</span>

                      {isSelected && (
                        <Check
                          size={16}
                          className="
                            shrink-0
                            text-blue-600
                            dark:text-blue-400
                          "
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
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

import { useEffect, useRef } from "react";
import PhoneInputModule from "react-phone-input-2";

import "react-phone-input-2/lib/style.css";
import "./PhoneInputField.css";

const PhoneInput =
  PhoneInputModule?.default || PhoneInputModule;

export default function PhoneInputField({
  label,
  name,
  value = "",
  onChange,
  error = "",
  required = false,
  disabled = false,
  country = "in",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const updateDropdownPosition = () => {
      const container = containerRef.current;

      if (!container) return;

      const dropdown =
        container.querySelector(".country-list");

      const selectedFlag =
        container.querySelector(".selected-flag");

      if (!dropdown || !selectedFlag) return;

      const flagRect =
        selectedFlag.getBoundingClientRect();

      const dropdownWidth = 300;

      const dropdownHeight = Math.min(
        dropdown.scrollHeight || 240,
        240,
      );

      let left = flagRect.left;

      if (
        left + dropdownWidth >
        window.innerWidth - 16
      ) {
        left =
          window.innerWidth -
          dropdownWidth -
          16;
      }

      if (left < 16) {
        left = 16;
      }

      const spaceBelow =
        window.innerHeight - flagRect.bottom;

      const spaceAbove = flagRect.top;

      let top;

      if (
        spaceBelow < dropdownHeight &&
        spaceAbove > dropdownHeight
      ) {
        top =
          flagRect.top -
          dropdownHeight -
          6;
      } else {
        top = flagRect.bottom + 6;
      }

      dropdown.style.position = "fixed";
      dropdown.style.left = `${left}px`;
      dropdown.style.top = `${top}px`;
      dropdown.style.width = `${dropdownWidth}px`;
      dropdown.style.maxHeight = "240px";
      dropdown.style.overflowY = "auto";
      dropdown.style.zIndex = "999999";
    };

    const observer =
      new MutationObserver(() => {
        updateDropdownPosition();
      });

    if (containerRef.current) {
      observer.observe(
        containerRef.current,
        {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class"],
        },
      );
    }

    window.addEventListener(
      "resize",
      updateDropdownPosition,
    );

    window.addEventListener(
      "scroll",
      updateDropdownPosition,
      true,
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        updateDropdownPosition,
      );

      window.removeEventListener(
        "scroll",
        updateDropdownPosition,
        true,
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full phone-input-wrapper"
    >
      {label && (
        <label
          htmlFor={name}
          className="
            mb-1.5
            block
            text-xs
            font-medium
            text-gray-700
            dark:text-gray-300
          "
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <PhoneInput
        country={country}
        value={value}
        onChange={(phone) => {
          onChange?.({
            target: {
              name,
              value: phone
                ? `+${phone}`
                : "",
            },
          });
        }}
        inputProps={{
          name,
          id: name,
        }}
        disabled={disabled}
        countryCodeEditable={false}
        enableSearch={false}
        containerClass="phone-input-container"
        inputClass={`
          phone-input-field
          ${error ? "phone-input-error" : ""}
        `}
        buttonClass="phone-input-button"
        dropdownClass="phone-input-dropdown"
      />

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
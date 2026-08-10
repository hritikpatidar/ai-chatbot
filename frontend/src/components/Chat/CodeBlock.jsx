import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Prism as SyntaxHighlighter,
} from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({
  language = "text",
  code = "",
}) {
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  // Detect theme changes
  useEffect(() => {
    const html = document.documentElement;

    const updateTheme = () => {
      setIsDark(html.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(html, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleCopy = () => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      className="
        my-5
        overflow-hidden
        rounded-xl
        border
        border-gray-200
        bg-white
        dark:border-white/10
        dark:bg-[#0d1117]
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-gray-200
          bg-gray-100
          px-4
          py-2
          dark:border-white/10
          dark:bg-[#161b22]
        "
      >
        <span
          className="
            text-xs
            font-medium
            uppercase
            tracking-wide
            text-gray-600
            dark:text-gray-400
          "
        >
          {language}
        </span>

        <CopyToClipboard
          text={code}
          onCopy={handleCopy}
        >
          <button
            type="button"
            className="
              flex
              items-center
              gap-1.5
              rounded-lg
              px-2
              py-1
              text-xs
              text-gray-600
              transition
              hover:bg-gray-200
              hover:text-gray-900
              dark:text-gray-300
              dark:hover:bg-white/10
              dark:hover:text-white
            "
          >
            {copied ? (
              <>
                <Check
                  size={14}
                  className="text-green-600 dark:text-green-400"
                />

                Copied
              </>
            ) : (
              <>
                <Copy size={14} />

                Copy
              </>
            )}
          </button>
        </CopyToClipboard>
      </div>

      {/* Code */}

      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        wrapLongLines={false}
        showLineNumbers={false}
        customStyle={{
          margin: 0,
          padding: "18px",
          background: isDark ? "#0d1117" : "#fafafa",
          overflowX: "auto",
          fontSize: "13px",
          lineHeight: "1.7",
          borderRadius: 0,
          transition: "background-color 0.3s ease",
        }}
        codeTagProps={{
          style: {
            fontFamily:
              "JetBrains Mono, Fira Code, Consolas, monospace",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}


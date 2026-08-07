import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({
  language = "text",
  code = "",
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="my-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-white/10 bg-[#161b22] px-4 py-2">

        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {language}
        </span>

        <CopyToClipboard text={code} onCopy={handleCopy}>
          <button
            className="
              flex
              items-center
              gap-1.5
              rounded-lg
              px-2
              py-1
              text-xs
              text-gray-300
              transition
              hover:bg-white/10
            "
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-400" />
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
        style={oneDark}
        wrapLongLines={false}
        showLineNumbers={false}
        customStyle={{
          margin: 0,
          padding: "18px",
          background: "#0d1117",
          overflowX: "auto",
          fontSize: "13px",
          lineHeight: "1.7",
          borderRadius: 0,
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
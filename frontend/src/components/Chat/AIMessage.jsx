import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import CodeBlock from "./CodeBlock";
import "./markdown.css";

export default function AIMessage({
  content = "",
  isError = false,
}) {
  const normalizeMarkdown = (text = "") => {
    if (!text) return "";

    return (
      text
        // Windows line endings
        .replace(/\r\n/g, "\n")

        // 4 ya usse zyada backticks => 3
        .replace(/`{4,}/g, "```")

        // `bash / ``bash / ````bash => ```bash
        .replace(
          /(^|\n)`{1,}(javascript|js|jsx|ts|tsx|python|py|json|html|css|bash|sh|sql|java|cpp|c|go|php)/gi,
          "$1```$2",
        )

        // closing `` or ```` => ```
        .replace(/\n`{2,}(?=\n|$)/g, "\n```")

        // duplicate opening fences
        .replace(
          /(```[a-zA-Z0-9]+\n)(```[a-zA-Z0-9]+\n)+/g,
          "$1",
        )

        // duplicate empty fences
        .replace(/```\n```/g, "```")

        // code block ke baad blank line maintain
        .replace(/```([a-zA-Z0-9]+)\n/g, "```$1\n")

        // line ke start me single `language
        .replace(
          /^`(javascript|js|jsx|ts|tsx|python|py|json|html|css|bash|sh|sql|java|cpp|c|go|php)$/gim,
          "```$1",
        )

        // line ke start me double ``language
        .replace(
          /^``(javascript|js|jsx|ts|tsx|python|py|json|html|css|bash|sh|sql|java|cpp|c|go|php)$/gim,
          "```$1",
        )

        // Extra blank lines remove
        .replace(/\n{3,}/g, "\n\n")

        .trim()
    );
  };

  return (
    <div
      className="
        min-w-0
        text-gray-800
        transition-colors
        duration-300
        dark:text-gray-200
      "
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          //--------------------------------------
          // Headings
          //--------------------------------------

          h1: ({ children }) => (
            <h1
              className={`
                mt-7
                mb-4
                text-3xl
                font-bold
                ${
                  isError
                    ? "text-red-600 dark:text-red-500"
                    : "text-gray-900 dark:text-white"
                }
              `}
            >
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2
              className="
                mt-6
                mb-3
                text-2xl
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3
              className="
                mt-5
                mb-2
                text-xl
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4
              className="
                mt-4
                mb-2
                text-lg
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              {children}
            </h4>
          ),

          //--------------------------------------
          // Paragraph
          //--------------------------------------

          p: ({ children }) => (
            <p
              className={`
                mb-4
                text-[15px]
                leading-7
                ${
                  isError
                    ? "text-red-600 dark:text-red-500"
                    : "text-gray-700 dark:text-gray-200"
                }
              `}
            >
              {children}
            </p>
          ),

          //--------------------------------------
          // Lists
          //--------------------------------------

          ul: ({ children }) => (
            <ul
              className="
                mb-4
                list-disc
                space-y-2
                pl-6
                text-gray-700
                dark:text-gray-200
              "
            >
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol
              className="
                mb-4
                list-decimal
                space-y-2
                pl-6
                text-gray-700
                dark:text-gray-200
              "
            >
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="leading-7">{children}</li>
          ),

          //--------------------------------------
          // Bold
          //--------------------------------------

          strong: ({ children }) => (
            <strong
              className="
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              {children}
            </strong>
          ),

          //--------------------------------------
          // Italic
          //--------------------------------------

          em: ({ children }) => (
            <em
              className="
                italic
                text-gray-700
                dark:text-gray-100
              "
            >
              {children}
            </em>
          ),

          //--------------------------------------
          // Inline Code
          //--------------------------------------

          code({ inline, className, children }) {
            const match = /language-(\w+)/.exec(
              className || "",
            );

            if (!inline && match) {
              return (
                <CodeBlock
                  language={match[1]}
                  code={String(children).replace(/\n$/, "")}
                />
              );
            }

            return (
              <code
                className="
                  rounded
                  border
                  border-gray-200
                  bg-gray-100
                  px-1.5
                  py-1
                  font-mono
                  text-[13px]
                  text-cyan-700
                  dark:border-white/10
                  dark:bg-[#1f2937]
                  dark:text-cyan-300
                "
              >
                {children}
              </code>
            );
          },

          //--------------------------------------
          // Blockquote
          //--------------------------------------

          blockquote: ({ children }) => (
            <blockquote
              className="
                my-5
                border-l-4
                border-cyan-500
                bg-cyan-500/5
                py-2
                pl-4
                italic
                text-gray-600
                dark:border-cyan-400
                dark:text-gray-300
              "
            >
              {children}
            </blockquote>
          ),

          //--------------------------------------
          // Link
          //--------------------------------------

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="
                text-cyan-600
                underline
                underline-offset-2
                transition-colors
                hover:text-cyan-700
                dark:text-cyan-400
                dark:hover:text-cyan-300
              "
            >
              {children}
            </a>
          ),

          //--------------------------------------
          // Horizontal Rule
          //--------------------------------------

          hr: () => (
            <hr
              className="
                my-6
                border-gray-200
                dark:border-white/10
              "
            />
          ),

          //--------------------------------------
          // Image
          //--------------------------------------

          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="
                my-4
                max-w-full
                rounded-xl
                border
                border-gray-200
                dark:border-white/10
              "
            />
          ),

          //--------------------------------------
          // Table
          //--------------------------------------

          table: ({ children }) => (
            <div
              className="
                my-5
                overflow-x-auto
                rounded-xl
                border
                border-gray-200
                dark:border-white/10
              "
            >
              <table className="w-full border-collapse">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead
              className="
                bg-gray-100
                dark:bg-[#1b2232]
              "
            >
              {children}
            </thead>
          ),

          tbody: ({ children }) => (
            <tbody
              className="
                bg-white
                dark:bg-[#111827]
              "
            >
              {children}
            </tbody>
          ),

          tr: ({ children }) => (
            <tr
              className="
                border-b
                border-gray-200
                dark:border-white/10
              "
            >
              {children}
            </tr>
          ),

          th: ({ children }) => (
            <th
              className="
                px-4
                py-3
                text-left
                text-sm
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td
              className="
                px-4
                py-3
                text-sm
                text-gray-700
                dark:text-gray-300
              "
            >
              {children}
            </td>
          ),
        }}
      >
        {normalizeMarkdown(content)}
      </Markdown>
    </div>
  );
}


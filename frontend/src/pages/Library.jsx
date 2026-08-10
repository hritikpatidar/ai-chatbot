import {
  Search,
  FileText,
  FileImage,
  FileCode,
  Folder,
  Star,
  Clock,
  MoreHorizontal,
} from "lucide-react";

const files = [
  {
    id: 1,
    name: "React Interview Notes.pdf",
    type: "pdf",
    size: "2.3 MB",
    updated: "2 hours ago",
    favorite: true,
  },
  {
    id: 2,
    name: "AI Chat UI.fig",
    type: "design",
    size: "4.8 MB",
    updated: "Yesterday",
    favorite: false,
  },
  {
    id: 3,
    name: "Backend API Docs.docx",
    type: "doc",
    size: "1.2 MB",
    updated: "3 days ago",
    favorite: false,
  },
  {
    id: 4,
    name: "chatSlice.js",
    type: "code",
    size: "12 KB",
    updated: "1 week ago",
    favorite: true,
  },
  {
    id: 5,
    name: "AI Chat UI.fig",
    type: "design",
    size: "4.8 MB",
    updated: "Yesterday",
    favorite: false,
  },
  {
    id: 6,
    name: "Backend API Docs.docx",
    type: "doc",
    size: "1.2 MB",
    updated: "3 days ago",
    favorite: false,
  },
  {
    id: 7,
    name: "chatSlice.js",
    type: "code",
    size: "12 KB",
    updated: "1 week ago",
    favorite: true,
  },
];

export default function Library() {
  const getIcon = (type) => {
    switch (type) {
      case "pdf":
      case "doc":
        return <FileText size={20} />;

      case "design":
        return <FileImage size={20} />;

      case "code":
        return <FileCode size={20} />;

      default:
        return <FileText size={20} />;
    }
  };

  return (
    <div
      className="
       min-h-full w-full bg-transparent text-gray-900 dark:text-white
      "
    >
      <div className="mx-auto w-full px-4 py-5 sm:px-6 sm:py-6">

        {/* Header */}

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1
              className="
                text-2xl
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              Library
            </h1>

            <p
              className="
                mt-1
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              Organize and manage your AI resources.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-500
                dark:text-gray-500
              "
            />

            <input
              placeholder="Search files..."
              className="
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                py-2
                pl-9
                pr-3
                text-xs
                text-gray-900
                outline-none
                transition-colors
                placeholder:text-gray-400
                focus:border-blue-500
                dark:border-white/10
                dark:bg-[#171b23]
                dark:text-white
                dark:placeholder:text-gray-500
              "
            />
          </div>
        </div>

        {/* Categories */}

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Documents", "24"],
            ["Images", "15"],
            ["Projects", "8"],
            ["Favorites", "11"],
          ].map(([title, count], index) => (
            <div
              key={index}
              className="
                rounded-xl
                border
                border-gray-200
                bg-white
                p-3
                transition
                hover:border-blue-500
                dark:border-white/10
                dark:bg-[#171b23]
              "
            >
              <Folder
                className="
                  mb-2
                  text-blue-500
                  dark:text-blue-400
                "
              />

              <h3
                className="
                  text-sm
                  font-medium
                  text-gray-900
                  dark:text-white
                "
              >
                {title}
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                {count} Items
              </p>
            </div>
          ))}
        </div>

        {/* Recent Files */}

        <div className="mt-6 flex-1 overflow-hidden">
          <h2
            className="
              mb-4
              text-lg
              font-semibold
              text-gray-900
              dark:text-white
            "
          >
            Recent Files
          </h2>

          <div className="h-[calc(100vh-320px)] space-y-4 overflow-y-auto pr-2">
            {files.map((item, index) => (
              <div
                key={index}
                className="
                  flex
                  flex-col
                  gap-3
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  p-3
                  transition
                  hover:border-blue-500
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  dark:border-white/10
                  dark:bg-[#171b23]
                "
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-lg
                      bg-blue-500/10
                      text-blue-600
                      dark:text-blue-400
                    "
                  >
                    {getIcon(item.type)}
                  </div>

                  <div>
                    <h3
                      className="
                        text-sm
                        font-medium
                        text-gray-900
                        dark:text-white
                      "
                    >
                      {item.name}
                    </h3>

                    <div
                      className="
                        mt-1
                        flex
                        flex-wrap
                        items-center
                        gap-3
                        text-[11px]
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      <span>{item.size}</span>

                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {item.updated}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {item.favorite && (
                    <Star
                      size={15}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  )}

                  <button
                    type="button"
                    className="
                      rounded-md
                      p-1.5
                      text-gray-600
                      transition
                      hover:bg-gray-100
                      dark:text-gray-300
                      dark:hover:bg-white/10
                    "
                  >
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

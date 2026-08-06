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
];

export default function Library() {
  const getIcon = (type) => {
    switch (type) {
      case "pdf":
      case "doc":
        return <FileText size={22} />;
      case "design":
        return <FileImage size={22} />;
      case "code":
        return <FileCode size={22} />;
      default:
        return <Folder size={22} />;
    }
  };

  return (
    <div className="text-white z-50 pt-15">
      <div className="mx-auto max-w-5xl px-4 ">
        {/* Header */}

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Library</h1>
            <p className="mt-1 text-xs text-gray-400">
              Organize and manage your AI resources.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              placeholder="Search files..."
              className="w-full rounded-lg border border-white/10 bg-[#171b23] py-2 pl-9 pr-3 text-xs outline-none focus:border-blue-500"
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
          ].map(([title, count]) => (
            <div
              key={title}
              className="rounded-xl border border-white/10 bg-[#171b23] p-3 transition hover:border-blue-500"
            >
              <Folder className="mb-2 text-blue-400" />

              <h3 className="text-sm font-medium">{title}</h3>

              <p className="mt-1 text-xs text-gray-400">{count} Items</p>
            </div>
          ))}
        </div>

        {/* Recent Files */}
        <div className="mt-6 flex-1 overflow-hidden">
          <h2 className="mb-4 text-lg font-semibold">Recent Files</h2>

          <div className="h-[calc(100vh-320px)] overflow-y-auto pr-2 space-y-4">
            {files.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#171b23] p-3 transition hover:border-blue-500 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    {getIcon(item.type)}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium">{item.name}</h3>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
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

                  <button className="rounded-md p-1.5 transition hover:bg-white/10">
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

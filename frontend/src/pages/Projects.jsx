import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban,
  Search,
  Plus,
  MoreHorizontal,
  Star,
  Clock,
  Users,
  FileText,
} from "lucide-react";
import { useState } from "react";

const projectsData = [
  {
    id: 1,
    name: "AI Chatbot",
    description: "MERN based conversational AI assistant.",
    files: 18,
    members: 3,
    updated: "2 hours ago",
    favorite: true,
  },
  {
    id: 2,
    name: "Portfolio Website",
    description: "Personal portfolio with animations.",
    files: 9,
    members: 1,
    updated: "Yesterday",
    favorite: false,
  },
  {
    id: 3,
    name: "Invoice Generator",
    description: "Generate invoices using AI.",
    files: 14,
    members: 2,
    updated: "3 days ago",
    favorite: true,
  },
  {
    id: 4,
    name: "Blog CMS",
    description: "Content management dashboard.",
    files: 22,
    members: 5,
    updated: "1 week ago",
    favorite: false,
  },
];

export default function Projects() {
  const [openModal, setOpenModal] = useState(false);
  const [projectName, setProjectName] = useState("");

  const [projects, setProjects] = useState(projectsData);

  const createProject = () => {
    if (!projectName.trim()) return;

    const newProject = {
      id: Date.now(),
      name: projectName,
      description: "New AI Project",
      files: 0,
      members: 1,
      updated: "Just now",
      favorite: false,
    };

    setProjects([newProject, ...projects]);
    setProjectName("");
    setOpenModal(false);
  };

  return (
    <div
      className="
        min-h-full
        w-full
        bg-transparent
        text-gray-900
        transition-colors
        duration-300
        dark:text-white
      "
    >
      <div className="p-4 sm:p-6">
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
              Projects
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Organize your AI workspaces and files.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                "
              />

              <input
                placeholder="Search projects..."
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  py-2
                  pl-9
                  pr-3
                  text-sm
                  text-gray-900
                  outline-none
                  placeholder:text-gray-400
                  transition
                  focus:border-blue-500
                  dark:border-white/10
                  dark:bg-[#171b23]
                  dark:text-white
                  dark:placeholder:text-gray-500
                "
              />
            </div>

            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gray-900
                px-4
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:bg-gray-700
                dark:bg-white
                dark:text-black
                dark:hover:bg-gray-200
              "
            >
              <Plus size={16} />
              New Project
            </button>
          </div>
        </div>

        {/* Stats */}

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["Total", "12"],
            ["Active", "8"],
            ["Archived", "2"],
            ["Shared", "5"],
          ].map(([title, value]) => (
            <div
              key={title}
              className="
                rounded-xl
                border
                border-gray-200
                bg-white
                p-4
                dark:border-white/10
                dark:bg-[#171b23]
              "
            >
              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                {title}
              </p>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >
                {value}
              </h2>
            </div>
          ))}
        </div>

        {/* Project Grid */}

        <div className="mt-5 h-[calc(100vh-250px)] overflow-y-auto pr-2">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="
                  rounded-2xl
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
                <div className="flex items-start justify-between">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-xl
                      bg-blue-500/10
                      text-blue-600
                      dark:text-blue-400
                    "
                  >
                    <FolderKanban size={22} />
                  </div>

                  <div className="flex items-center gap-2">
                    {project.favorite && (
                      <Star
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    )}

                    <button
                      type="button"
                      className="
                        rounded-lg
                        p-1
                        text-gray-600
                        transition
                        hover:bg-gray-100
                        dark:text-gray-300
                        dark:hover:bg-white/10
                      "
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                <h2
                  className="
                    mt-5
                    text-lg
                    font-semibold
                    text-gray-900
                    dark:text-white
                  "
                >
                  {project.name}
                </h2>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-gray-600
                    dark:text-gray-400
                  "
                >
                  {project.description}
                </p>

                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
                    gap-4
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  <div className="flex items-center gap-1">
                    <FileText size={14} />
                    {project.files} Files
                  </div>

                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    {project.members}
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {project.updated}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}

      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/60
              px-4
              backdrop-blur-sm
            "
          >
            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
                y: 20,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                w-full
                max-w-md
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                shadow-2xl
                dark:border-white/10
                dark:bg-[#171b23]
              "
            >
              <h2
                className="
                  text-xl
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                Create New Project
              </h2>

              <div className="mt-5">
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    text-gray-700
                    dark:text-gray-300
                  "
                >
                  Project Name
                </label>

                <input
                  autoFocus
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-100
                    px-4
                    py-3
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-blue-500
                    dark:border-white/10
                    dark:bg-[#222938]
                    dark:text-white
                    dark:placeholder:text-gray-500
                  "
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      createProject();
                    }
                  }}
                />
              </div>

              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-emerald-200
                  bg-emerald-50
                  p-3
                  dark:border-emerald-500/20
                  dark:bg-emerald-500/10
                "
              >
                <p
                  className="
                    text-xs
                    leading-5
                    text-emerald-700
                    dark:text-emerald-300
                  "
                >
                  ✨ Projects help you organize AI conversations, uploaded
                  files, prompts and generated content in one workspace. Give
                  your project a clear, memorable name to find it quickly later.
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpenModal(false);
                    setProjectName("");
                  }}
                  className="
                    rounded-xl
                    border
                    border-gray-200
                    px-4
                    py-2
                    text-sm
                    text-gray-600
                    transition
                    hover:bg-gray-100
                    dark:border-white/10
                    dark:text-gray-300
                    dark:hover:bg-white/10
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={createProject}
                  className="
                    rounded-xl
                    bg-gray-900
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-gray-700
                    dark:bg-white
                    dark:text-black
                    dark:hover:bg-gray-200
                  "
                >
                  Create Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  onClick,
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
        transition
        dark:border-white/10
        dark:bg-[#171b23]
        ${onClick ? "cursor-pointer hover:border-blue-500" : ""}
      `}
    >
      <div className="flex items-start justify-between">
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-blue-500/10
            text-blue-600
            dark:text-blue-400
          "
        >
          {Icon && <Icon size={20} />}
        </div>
        {onClick && <ArrowUpRight size={17} className="text-gray-400" />}
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="mt-1 truncate text-lg font-semibold">{value}</h3>
        {description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

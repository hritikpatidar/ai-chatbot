export default function ActionButton({ icon, title, onClick, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`
        flex h-8 w-8
        items-center justify-center
        rounded-lg
        border
        transition
        ${
          danger
            ? `
              border-red-200
              text-red-500
              hover:bg-red-50
              dark:border-red-500/20
              dark:hover:bg-red-500/10
            `
            : `
              border-gray-200
              text-gray-600
              hover:bg-gray-100
              dark:border-white/10
              dark:text-gray-300
              dark:hover:bg-white/10
            `
        }
      `}
    >
      {icon}
    </button>
  );
}

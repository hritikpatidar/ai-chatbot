import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <>
      {/* Glow */}
      <div
        className="
          absolute inset-0 z-0 flex items-center justify-center
          pointer-events-none overflow-hidden
        "
      >
        <div
          className="
            h-80 w-[320px]
            rounded-full bg-blue-600/10 blur-[100px]
            sm:h-112.5 sm:w-112.5 sm:blur-[140px]
            md:h-150 md:w-150
            lg:h-175 lg:w-175 lg:blur-[180px]
          "
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(58)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/30"
            style={{
              width: `${4 + Math.random() * 6}px`,
              height: `${4 + Math.random() * 6}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </>
  );
}
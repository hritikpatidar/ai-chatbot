import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export default function AnimatedBackground() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

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

  const particles = useMemo(() => {
    return Array.from({ length: 58 }, (_, i) => ({
      id: i,
      size: 4 + Math.random() * 5,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 3,
      move: 20 + Math.random() * 25,
    }));
  }, []);

  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        overflow-hidden
        transition-colors
        duration-700
      "
      style={{
        backgroundColor: isDark ? "#0b0f17" : "#f8fafc",
      }}
    >
      <motion.div
        className="
          absolute
          -left-32
          -top-32
          h-105
          w-105
          rounded-full
          blur-[100px]
        "
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
          scale: [1, 1.15, 1],

          opacity: isDark ? [0.25, 0.45, 0.25] : [0.3, 0.55, 0.3],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: isDark
            ? "rgba(34, 211, 238, 0.35)"
            : "rgba(6, 182, 212, 0.30)",
        }}
      />

      <motion.div
        className="
          absolute
          -bottom-40
          -right-40
          h-112.5
          w-112.5
          rounded-full
          blur-[110px]
        "
        animate={{
          x: [0, -40, 0],
          y: [0, -30, 0],
          scale: [1, 1.18, 1],

          opacity: isDark ? [0.2, 0.4, 0.2] : [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: isDark
            ? "rgba(59, 130, 246, 0.35)"
            : "rgba(37, 99, 235, 0.25)",
        }}
      />

      <motion.div
        className="
          absolute
          left-1/2
          top-1/2
          h-87.5
          w-87.5
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          blur-[100px]
        "
        animate={{
          scale: [1, 1.2, 1],

          opacity: isDark ? [0.08, 0.2, 0.08] : [0.12, 0.25, 0.12],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: isDark
            ? "rgba(168, 85, 247, 0.25)"
            : "rgba(147, 51, 234, 0.20)",
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.left}%`,
              top: `${particle.top}%`,

              backgroundColor: isDark
                ? "rgba(34, 211, 238, 0.55)"
                : "rgba(8, 145, 178, 0.65)",

              boxShadow: isDark
                ? "0 0 10px rgba(34, 211, 238, 0.5)"
                : "0 0 12px rgba(8, 145, 178, 0.55)",
            }}
            animate={{
              y: [0, -particle.move, 0],
              x: [0, particle.move / 2, 0],

              opacity: isDark ? [0.25, 0.9, 0.25] : [0.35, 1, 0.35],

              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {!isDark && (
        <motion.div
          className="
            absolute
            left-1/2
            top-0
            h-0.5
            w-[40%]
            -translate-x-1/2
            rounded-full
            bg-cyan-500
            blur-sm
          "
          animate={{
            opacity: [0.35, 1, 0.35],
            width: ["20%", "60%", "20%"],
            boxShadow: [
              "0 0 8px rgba(6,182,212,0.3)",
              "0 0 20px rgba(6,182,212,0.7)",
              "0 0 8px rgba(6,182,212,0.3)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {!isDark && (
        <motion.div
          className="
            absolute
            left-1/2
            top-1/4
            h-72
            w-72
            -translate-x-1/2
            rounded-full
            bg-cyan-400/10
            blur-[120px]
          "
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}

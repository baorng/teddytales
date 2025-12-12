import { motion } from "framer-motion";

export const FloatingStars = () => {
  const stars = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-yellow-400 opacity-40"
          style={{
            left: star.left,
            top: star.top,
            fontSize: `${star.size}px`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
};

export const BookmarkDecoration = ({
  side = "left",
}: {
  side?: "left" | "right";
}) => {
  return (
    <div
      className={`absolute top-0 ${
        side === "left" ? "left-8" : "right-8"
      } w-8 h-32 bg-gradient-to-b from-sunset-400 to-sunset-500 shadow-lg`}
      style={{
        clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
      }}
    />
  );
};

export const PageCurl = ({ corner = "top-right" }: { corner?: string }) => {
  const positions = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
  };

  return (
    <div
      className={`absolute ${
        positions[corner as keyof typeof positions]
      } w-0 h-0`}
    >
      <div
        className="w-12 h-12 bg-gradient-to-br from-earth-200 to-earth-300 opacity-50"
        style={{
          clipPath:
            corner.includes("top") && corner.includes("right")
              ? "polygon(0 0, 100% 0, 100% 100%)"
              : corner.includes("top") && corner.includes("left")
              ? "polygon(0 0, 100% 0, 0 100%)"
              : corner.includes("bottom") && corner.includes("right")
              ? "polygon(100% 0, 100% 100%, 0 100%)"
              : "polygon(0 0, 0 100%, 100% 100%)",
        }}
      />
    </div>
  );
};

export const DoodleDecoration = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        rotate: [0, 5, -5, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-20"
      >
        <path
          d="M30 5 L35 20 L50 20 L38 30 L42 45 L30 37 L18 45 L22 30 L10 20 L25 20 Z"
          fill="#8B5C2E"
          stroke="#8B5C2E"
          strokeWidth="1"
        />
      </svg>
    </motion.div>
  );
};

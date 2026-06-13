"use client";

import { motion } from "framer-motion";

interface Orb {
  color: string;
  size: number;
  top: string;
  left: string;
  delay: number;
}

const ORBS: Orb[] = [
  { color: "#00D4FF", size: 520, top: "-12%", left: "8%", delay: 0 },
  { color: "#4285F4", size: 460, top: "2%", left: "62%", delay: 1.2 },
  { color: "#FF9900", size: 360, top: "38%", left: "78%", delay: 0.6 },
  { color: "#C4622D", size: 400, top: "30%", left: "-6%", delay: 1.8 },
];

export default function AmbientGlow({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}33 0%, ${orb.color}00 68%)`,
            filter: "blur(28px)",
          }}
          animate={{
            x: [0, 26, -18, 0],
            y: [0, -22, 16, 0],
            opacity: [0.55, 0.85, 0.6, 0.55],
          }}
          transition={{
            duration: 16 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}

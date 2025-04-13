// src/components/AnimatedPage.tsx
import React from "react";
import { motion } from "framer-motion";

interface AnimatedPageProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -50, scale: 0.95 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ height: "100%" }} // ensure the container takes full height
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;

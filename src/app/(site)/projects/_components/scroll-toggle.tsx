"use client";

import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

// Floating button that jumps to the bottom of the page, then back to the top.
export function ScrollToggle() {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 50);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: isAtBottom ? 0 : document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <motion.button
      type="button"
      aria-label={isAtBottom ? "Scroll to top" : "Scroll to bottom"}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="glass-dark glass-dark-hover fixed! bottom-10 left-1/2 z-40 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full"
    >
      <FontAwesomeIcon
        icon={isAtBottom ? faChevronUp : faChevronDown}
        className="text-lg text-white"
      />
    </motion.button>
  );
}

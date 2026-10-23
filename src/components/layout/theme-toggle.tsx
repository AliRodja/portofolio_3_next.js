"use client";

import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

const root = () => document.documentElement;

function readTheme(): Theme {
  return root().dataset.theme === "light" ? "light" : "dark";
}

// Re-render when anything changes the attribute, including another toggle.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function applyTheme(theme: Theme) {
  if (theme === "light") root().dataset.theme = "light";
  else delete root().dataset.theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage: the choice lasts for this page only.
  }
}

// Switches the public site between the dark and light themes. Shows the
// theme it switches to, like the toggle in most apps.
export function ThemeToggle() {
  // The server cannot know the visitor's choice, so it renders the default
  // and the real theme takes over right after hydration.
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as const);
  const next: Theme = theme === "dark" ? "light" : "dark";

  const toggle = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Cross-fade the whole page, the WebGL backdrop included, where the
    // browser supports it.
    if (document.startViewTransition && !reduceMotion) {
      document.startViewTransition(() => applyTheme(next));
    } else {
      applyTheme(next);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="glass glass-bar glass-hover pointer-events-auto relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full text-ink transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex"
        >
          <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} className="text-base" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

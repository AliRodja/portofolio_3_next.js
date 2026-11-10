export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

// Runs in <head> before paint to apply the saved theme without a flash.
export const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem("${THEME_STORAGE_KEY}")==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`;

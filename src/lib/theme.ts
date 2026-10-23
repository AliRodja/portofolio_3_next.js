export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

// Runs in <head> before the page paints, so a visitor who chose the light
// theme never sees a flash of the dark one. Dark is the default, so only
// "light" needs the attribute. The CSP allows inline scripts (see
// next.config.ts).
export const themeScript = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

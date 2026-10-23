import type { MouseEvent } from "react";

// Links to the page you are already on do nothing by default, and a hash that
// is already in the URL does not scroll again. Scroll there by hand instead.
// The home page scrolls inside its own container, marked data-scroll-root.
export function scrollWithinPage(event: MouseEvent<HTMLAnchorElement>, href: string) {
  const url = new URL(href, window.location.href);
  if (url.pathname !== window.location.pathname) return;

  event.preventDefault();
  const target = url.hash ? document.getElementById(url.hash.slice(1)) : null;
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  } else {
    const root = document.querySelector("[data-scroll-root]") ?? window;
    root.scrollTo({ top: 0, behavior: "smooth" });
  }
  window.history.replaceState(null, "", url.pathname + url.hash);
}

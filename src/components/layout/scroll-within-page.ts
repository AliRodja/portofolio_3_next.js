import type { MouseEvent } from "react";

// Smooth-scroll same-page and repeated hash links manually, using [data-scroll-root] on the home page.
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

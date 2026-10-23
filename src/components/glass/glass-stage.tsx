"use client";

import { useEffect, useRef } from "react";
import { GlassBackdrop } from "@/components/layout/glass-backdrop";
import { GlassRenderer, type Blob, type Pane, type Streak } from "./renderer";

const MAX_DPR = 2;

// The backdrop and every `.glass` surface, drawn with WebGL so the glass
// really refracts what is behind it. While it runs, <html data-glass="webgl">
// tells the CSS to hide its own backdrop, streaks, and glass fills (see
// globals.css). Without WebGL, or when the visitor asks for less
// transparency, the CSS versions stay as they are.
export function GlassStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-transparency: reduce)").matches) return;

    const renderer = GlassRenderer.create(canvas);
    if (!renderer) return;

    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    // Eases between the themes instead of jumping (0 dark, 1 light).
    let light = readLight();
    let lastTime = start;
    let frameId = 0;
    let active = true;

    const stop = () => {
      active = false;
      cancelAnimationFrame(frameId);
      delete root.dataset.glass;
    };
    canvas.addEventListener("webglcontextlost", stop);

    const loop = () => {
      if (!active) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.round(canvas.clientWidth * dpr);
      const height = Math.round(canvas.clientHeight * dpr);
      renderer.resize(width, height, dpr);

      const now = performance.now();
      const seconds = reduceMotion ? 0 : (now - start) / 1000;
      const target = readLight();
      light = reduceMotion
        ? target
        : light + (target - light) * Math.min(1, ((now - lastTime) / 1000) * 10);
      if (Math.abs(target - light) < 0.001) light = target;
      lastTime = now;
      renderer.render({
        blobs: readBlobs(seconds, dpr),
        streaks: readStreaks(dpr),
        streakHalfLength: 0.8 * Math.max(window.innerWidth, window.innerHeight) * dpr,
        light,
        panes: readPanes(dpr),
      });
      frameId = requestAnimationFrame(loop);
    };

    // Only switch the CSS off once the first frame has drawn.
    loop();
    root.dataset.glass = "webgl";

    return () => {
      stop();
      canvas.removeEventListener("webglcontextlost", stop);
      renderer.destroy();
    };
  }, []);

  return (
    <>
      <GlassBackdrop />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      />
    </>
  );
}

function readLight() {
  return document.documentElement.dataset.theme === "light" ? 1 : 0;
}

// Same blobs as GlassBackdrop: sizes, positions, and the 28s alternating
// drift of the .glass-blob animation (the second one starts 12s in).
function readBlobs(seconds: number, dpr: number): [Blob, Blob] {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

  const drift = (delay: number) => {
    const phase = ((seconds + delay) / 28) % 2;
    const t = phase < 1 ? phase : 2 - phase;
    return t * t * (3 - 2 * t); // ease-in-out
  };

  const blob = (left: number, top: number, size: number, delay: number): Blob => {
    const amount = drift(delay);
    return {
      x: (left + size / 2 + 0.06 * vw * amount) * dpr,
      y: (top + size / 2 + 0.04 * vh * amount) * dpr,
      radius: (size / 2) * (1 + 0.12 * amount) * dpr,
    };
  };

  const size1 = Math.max(0.4 * vw, 20 * rem);
  const size2 = Math.max(0.5 * vw, 24 * rem);
  return [
    blob(1.15 * vw - size1, 0.1 * vh, size1, 0),
    blob(0.15 * vw, 1.3 * vh - size2, size2, 12),
  ];
}

// Reads the hidden CSS streaks, which already encode where each page wants
// them (and animate their drift), so the WebGL ones follow along.
function readStreaks(dpr: number): Streak[] {
  const streaks: Streak[] = [];
  for (const element of document.querySelectorAll<HTMLElement>(".light-streak")) {
    const rect = element.getBoundingClientRect();
    if (!rect.width) continue;
    const style = getComputedStyle(element);
    streaks.push({
      x: (rect.left + rect.width / 2) * dpr,
      y: (rect.top + rect.height / 2) * dpr,
      angle: (parseFloat(style.rotate) || 0) * (Math.PI / 180),
      opacity: parseFloat(style.opacity) || 0,
    });
  }
  return streaks.slice(0, 2);
}

function readPanes(dpr: number): Pane[] {
  const panes: Pane[] = [];
  const viewport = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };

  for (const element of document.querySelectorAll<HTMLElement>(".glass")) {
    const rect = element.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;

    const clip = clipRect(element, viewport);
    if (!clip || !intersects(rect, clip)) continue;

    const opacity = visibleOpacity(element);
    if (opacity < 0.01) continue;

    const style = getComputedStyle(element);
    panes.push({
      x: rect.left * dpr,
      y: rect.top * dpr,
      width: rect.width * dpr,
      height: rect.height * dpr,
      radius: (parseFloat(style.borderTopLeftRadius) || 0) * dpr,
      opacity,
      clip: {
        x: clip.x * dpr,
        y: clip.y * dpr,
        width: clip.width * dpr,
        height: clip.height * dpr,
      },
    });
  }
  return panes;
}

type Box = { x: number; y: number; width: number; height: number };

// The part of the viewport the element can show in, after every ancestor
// that clips its overflow. Fixed elements escape their ancestors' clipping.
function clipRect(element: HTMLElement, viewport: Box): Box | null {
  let box = viewport;
  if (getComputedStyle(element).position === "fixed") return box;

  for (let node = element.parentElement; node && node !== document.body; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.overflowX !== "visible" || style.overflowY !== "visible") {
      const r = node.getBoundingClientRect();
      const x = Math.max(box.x, r.left);
      const y = Math.max(box.y, r.top);
      const right = Math.min(box.x + box.width, r.right);
      const bottom = Math.min(box.y + box.height, r.bottom);
      if (right <= x || bottom <= y) return null;
      box = { x, y, width: right - x, height: bottom - y };
    }
    if (style.position === "fixed") break;
  }
  return box;
}

function intersects(rect: DOMRect, box: Box) {
  return (
    rect.right > box.x &&
    rect.left < box.x + box.width &&
    rect.bottom > box.y &&
    rect.top < box.y + box.height
  );
}

// Combined opacity of the element and its ancestors, so the glass fades in
// with the scroll animations and disappears with hidden content.
function visibleOpacity(element: HTMLElement) {
  if (getComputedStyle(element).visibility === "hidden") return 0;
  let opacity = 1;
  for (let node: HTMLElement | null = element; node && node !== document.body; node = node.parentElement) {
    opacity *= parseFloat(getComputedStyle(node).opacity);
    if (opacity < 0.01) return 0;
  }
  return opacity;
}

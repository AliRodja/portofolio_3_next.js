export function GlassBackdrop() {
  return (
    <div
      aria-hidden
      className="glass-backdrop-css pointer-events-none fixed inset-0 -z-10 bg-canvas"
    />
  );
}

export function LightStreaks({ variant: _variant }: { variant: "hero" | "page" }) {
  void _variant;
  return null;
}

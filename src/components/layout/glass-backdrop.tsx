// A backdrop lit like a studio: a soft key light from the top left, a faint
// fill from the bottom right, slow gray glows, and fine grain, in the theme's
// colors (see globals.css). Glass needs tonal variation behind it to read as
// glass; on a flat color the effect disappears.
export function GlassBackdrop() {
  return (
    <div
      aria-hidden
      className="glass-backdrop-css pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas"
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_12%_8%,var(--backdrop-key),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_92%_96%,var(--backdrop-fill),transparent_70%)]" />
      <div className="glass-blob top-[10%] right-[-15%] size-[max(40vw,20rem)] bg-(--backdrop-blob-1)" />
      <div className="glass-blob bottom-[-30%] left-[15%] size-[max(50vw,24rem)] bg-(--backdrop-blob-2) [animation-delay:-12s]" />
      <div className="grain absolute inset-0 opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,var(--backdrop-vignette))]" />
    </div>
  );
}

// Each streak is a long line rotated around a point it should pass through
// (--sx, --sy). The points differ per breakpoint because the layouts do.
const streakSets = {
  // Home: behind the hero buttons (below the intro text), and behind the
  // menu button and photo frame.
  hero: [
    {
      position:
        "[--sa:12deg] [--sx:50vw] [--sy:81.8vh] md:[--sa:18deg] md:[--sx:20.8vw] md:[--sy:62.8vh]",
      opacity: 0.55,
      delay: "0s",
    },
    {
      position:
        "[--sa:-50deg] [--sx:67vw] [--sy:16.8vh] md:[--sa:-60deg] md:[--sx:85vw] md:[--sy:26vh]",
      opacity: 0.3,
      delay: "-7s",
    },
  ],
  // Reading pages: steep and faint, hugging the left and right edges so they
  // stay out of the text column. Phones have no side margins, so they are
  // hidden there.
  page: [
    {
      position: "max-md:hidden [--sa:-72deg] [--sx:96vw] [--sy:45vh]",
      opacity: 0.25,
      delay: "0s",
    },
    {
      position: "max-md:hidden [--sa:-72deg] [--sx:3vw] [--sy:80vh]",
      opacity: 0.15,
      delay: "-9s",
    },
  ],
};

export function LightStreaks({ variant }: { variant: keyof typeof streakSets }) {
  return (
    <div
      aria-hidden
      className="light-streak-layer pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {streakSets[variant].map((streak) => (
        <div
          key={streak.position}
          className={`light-streak ${streak.position}`}
          style={{
            width: "160vmax",
            left: "calc(var(--sx) - 80vmax)",
            top: "var(--sy)",
            rotate: "var(--sa)",
            opacity: streak.opacity,
            animationDelay: streak.delay,
          }}
        />
      ))}
    </div>
  );
}

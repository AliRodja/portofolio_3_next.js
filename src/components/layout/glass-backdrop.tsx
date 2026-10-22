// A vivid violet-to-navy backdrop with glowing blobs and fine grain, shared by
// every public page. Glass only reads as glass when there is color and
// something sharp behind it; on a flat surface the effect disappears.
export function GlassBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(160deg,#6d5ce2_0%,#4c50d8_30%,#2b3cc2_55%,#131f88_80%,#0a1458_100%)]"
    >
      <div className="glass-blob top-[-25%] left-[-10%] size-[max(55vw,26rem)] bg-[#a07dff]" />
      <div className="glass-blob top-[15%] right-[-18%] size-[max(45vw,22rem)] bg-[#3f8cff] [animation-delay:-8s]" />
      <div className="glass-blob bottom-[-35%] left-[10%] size-[max(60vw,28rem)] bg-[#2a1fa8] [animation-delay:-16s]" />
      <div className="grain absolute inset-0 opacity-[0.12]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_35%,transparent_55%,rgb(4_6_36/0.55))]" />
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
      opacity: 1,
      delay: "0s",
    },
    {
      position:
        "[--sa:-50deg] [--sx:67vw] [--sy:16.8vh] md:[--sa:-60deg] md:[--sx:85vw] md:[--sy:26vh]",
      opacity: 0.6,
      delay: "-7s",
    },
  ],
  // Reading pages: steep and faint, hugging the left and right edges so they
  // stay out of the text column. Phones have no side margins, so they are
  // hidden there.
  page: [
    {
      position: "max-md:hidden [--sa:-72deg] [--sx:96vw] [--sy:45vh]",
      opacity: 0.45,
      delay: "0s",
    },
    {
      position: "max-md:hidden [--sa:-72deg] [--sx:3vw] [--sy:80vh]",
      opacity: 0.3,
      delay: "-9s",
    },
  ],
};

export function LightStreaks({ variant }: { variant: keyof typeof streakSets }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
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

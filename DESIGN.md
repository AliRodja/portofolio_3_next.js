# DESIGN.md — Ali Imran Rodja Portfolio

## Design Read
> Reading this as: Personal engineering & UI/UX portfolio for hiring managers, clients, and collaborators, in a monochrome editorial studio style with floating glass navigation, dial `ENERGY 3 / RHYTHM 3 / MOTION 2`.

## Liveliness Dials
- **ENERGY: 3 (Bold)** — High-contrast monochrome photography, full-viewport sections on the home page, oversized display headings (`Jost`), and an interactive Dynamic Island navigation bar.
- **RHYTHM: 3 (Varied)** — Sections alternate between full-screen split compositions (Home), overlapping three-photo collages (`Who Am I?`, `Highlight`), an interactive split-pane skill index (`Skills & Expertise`), an alternating vertical timeline (`Professional Experience`), a two-column academic & awards ledger (`Education`), and a word-by-word typographic close (`Quote`).
- **MOTION: 2 (Scroll-reveal & transitions)** — Spring-based scroll-reveal entrances (`Reveal`), photo scale transitions on page load (`PageHero`), grayscale-to-color hover reveals on photography, and smooth view-transition theme switching. All non-essential motion stops under `prefers-reduced-motion: reduce`.

---

## Visual Identity & One-Line Reasons (R-31)

- **Color Palette (R-01, R-21, R-29):** Pure white studio canvas (`#ffffff`) with deep slate ink (`#0f172a`) in light mode, and near-black studio canvas (`#050505`) with crisp white ink (`#ffffff`) in dark mode, paired with a working light/dark theme toggle.
  - *Why this palette:* Monochrome surfaces keep the visitor's eye on the project screenshots and photography, which reveal full color on hover as the sole chromatic accent.
- **Typography (R-06):** `Jost` (`--font-display`) for geometric headings, navigation, and editorial lead paragraphs; `Poppins` (`--font-sans`) for body copy, metadata, and dashboard controls.
  - *Why this typography:* `Jost` provides sharp geometric structure at display sizes (4xl–8xl), while `Poppins` keeps dense project descriptions and admin forms legible at small sizes.
  - *Why wide-tracked uppercase labels (`tracking-[0.2em] uppercase`):* Used strictly as short section kickers above display titles to create typographic hierarchy between category metadata and the main title without introducing extra colors.
- **Layout & Structure (R-05):** Full-viewport snap sections on the home page act as an index to deeper narrative pages (`/about`, `/projects`, `/projects/[slug]`, `/projects/archive`), while `/admin` uses a fixed light-mode workspace shell built around content management tasks.
  - *Why this layout:* Visitors scanning a portfolio first want a fast overview (Home) and then deep evidence on demand (About & Projects), while the owner needs a distraction-free light workspace to edit records.
- **Glassmorphism Dose Cap (R-10):** Frosted glass (`backdrop-filter: blur`) is reserved exclusively for floating navigation and action controls that pass over scrolling content (`Navbar` pill, `DynamicIsland`, mobile `TabBar`, `ThemeToggle`, `BackButton`, `ScrollToggle`, and `glass` CTA buttons). Content cards, timelines, skill panels, and tables use crisp matte surfaces (`surface-card`) with subtle borders.
  - *Why glass here:* Floating navigation bars sit directly over scrolling text and photography, so frosted glass preserves legibility while keeping the viewport feeling open.
- **Border Radius System (R-11):**
  - `rounded-full`: Interactive floating navigation pills, primary/secondary CTA buttons, and circular portrait frames.
  - `rounded-2xl`: Content cards, photo frames, and section containers.
  - `rounded-md` / `rounded-lg`: Static technology tags, skill chips, and metadata badges.
  - *Why this radius scale:* Separating pill-shaped interactive controls (`rounded-full`) from rectangular static tags (`rounded-md`) makes clickable actions immediately distinguishable from read-only labels.
- **Elevation & Shadows (R-12):** Soft elevation is used only on floating navigation bars, primary solid CTAs, and overlapping collage photos. Content cards sit flat on the canvas with a 1px border (`border-ink/15`).
  - *Why this elevation:* Overlapping collage photos and fixed navigation physically sit in a layer above the page, whereas inline content cards belong to the document plane.
- **Identity Motifs (Part 3):**
  1. **DoubleBar:** Two offset horizontal bars sliding in beneath section headings to anchor the left edge of editorial sections.
  2. **Monochrome-to-Color Photography (`monoPhotoClass`):** All portfolio photos rest in grayscale to harmonize with the monochrome theme and bloom into full color on hover/focus.
- **Icons (R-04):** Font Awesome icons are used only where they communicate concrete platform identity (GitHub, LinkedIn, Instagram, Discord, X), navigation destinations (Home, About, Projects, Contact), or award tier (Medal/Award). No decorative AI sparkles (`✦`) or pulsing status dots.

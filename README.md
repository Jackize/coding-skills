# Coding Skills

Bilingual (EN/VN) mid-level learning site for Design Patterns, System Design, and Docker. Plain HTML, CSS, and JavaScript—no build step, no login.

## Curriculum

Each course is a full progression (~8–10+ sections). Bodies are scannable for developers (lists, **bold** terms, short paragraphs). Every section uses this heading ladder:

Analysis → Requirements → Features → Tech choices → Design → Code → Deploy → Trade-offs → Failure modes → Practice  

The `system-design` course is an exception: it mirrors the chapter structure of the *System Design* interview-prep ebook (Nguyễn Thế Huy) instead of the build ladder. Every section declares its own `headings` array (its chapter sub-topics) so the curriculum checker validates the right structure. Its 14 sections: interview intro → foundational concepts → high-level architecture → consistency & availability → SQL vs NoSQL → sharding/indexes/storage → load balancing → caching → message queues → idempotency & locking → communication & API design → fault tolerance & recovery → security & authorization → monitoring & observability.

Plus **Baseline** and **Skills gained** on the section page. Style guide: keep content mid-level and concrete. Content lives in `js/content/*.js`, assembled by `js/catalog.js`.

| Course id | Focus |
| --- | --- |
| `design-patterns` | Pattern vocabulary → creational / structural / behavioral → real-feature capstone |
| `system-design` | Interview guide: concepts → architecture → consistency → data → scaling → APIs → resilience → security → observability |
| `docker` | Containers & images → Compose & config → production basics → ship a small stack |

## Run locally

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080/](http://localhost:8080/).

Validate curriculum depth (after content is filled):

```bash
node scripts/check-curriculum.mjs
```

## URL shapes

| Page | Path |
| --- | --- |
| Home | `index.html` |
| Course | `course.html?id=<course-id>` |
| Section | `section.html?course=<course-id>&section=<section-id>` |

## Exports

On each section page:

- **Markdown** (`.md`) — Notion-friendly paste/import  
- **Standalone HTML** — offline reading with inlined styles and diagram  

## GitHub Pages

Live at [https://jackize.github.io/coding-skills/](https://jackize.github.io/coding-skills/) (branch `main`, site root).

## Adding content

1. Edit the course module under `js/content/` (`design-patterns.js`, `system-design.js`, or `docker.js`).
2. Add a section with bilingual `title`, `body` (template headings), `baseline`, `skills`, and `diagram` id.
3. Add `assets/diagrams/<diagram>.svg`.
4. Keep `js/catalog.js` importing the three course modules.

## Visual skills (self-contained packages)

Two drop-in packages give the site its look and motion. Each is a `css/` + `js/` pair with no build step.

### `foundation` — design tokens + dark mode + typography

- `css/foundation.css` — shadcn-style HSL tokens, a light/dark palette, Inter + JetBrains Mono, and a reading scale (`--reading-font-size`, `--reading-line-height`, `--reading-heading-scale`).
- `js/foundation.js` — wires the `#theme-toggle` button and persists the choice.

The theme is stored under `localStorage['coding-skills-theme']` and defaults to `prefers-color-scheme`. Each page sets `data-theme` on `<html>` from a tiny inline script in `<head>` to avoid a flash. Dark-mode colors are defined under `[data-theme="dark"]`; the concrete `--color-*` variables keep `styles.css` working in both modes.

### `diagram-animate` — animated SVG diagrams

- `css/diagram-animate.css` — `sd-node-in` / `sd-edge-draw` / `sd-fade-in` keyframes.
- `js/diagram-animate.js` — exports `animateDiagrams(root)`; `app-section.js` calls it after each render.

It upgrades every `<img class="section-diagram">` into an inline SVG and animates it when scrolled into view: nodes pop in, solid edges draw themselves (via `stroke-dashoffset`), dashed edges and labels fade, all staggered. No diagram files need editing. It respects `prefers-reduced-motion` and falls back to the static image if the fetch fails (e.g. `file://`).

### `semantic-blocks` — callouts, pros/cons cards, comparison tables

- `css/semantic-blocks.css` — styles for `.callout`, `.pros-cons`, and `.cmp-table`.
- `js/markdown.js` — extended to parse the container syntax below and markdown tables.

Container syntax (inside a section `body`):

```
:::note Recurring trade-offs
Sequential uniqueness versus enumeration risk; ...
:::

:::pros 301 Moved Permanently
- **Cuts origin load**: browsers and CDNs cache aggressively.
:::
:::cons 301 Moved Permanently
- **Slow edits & revocation**: cached copies linger.
:::
```

Supported types: `note` (amber), `tip` (green), `warning` (red), `info` (blue), `pros`, `cons`. A `:::pros` immediately followed by `:::cons` (or vice-versa) is laid out side by side; an unpaired one becomes a standalone card. Types may be nested. Markdown `| a | b |` tables now render as styled `.cmp-table`.

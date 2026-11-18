# Coding Skills

Bilingual (EN/VN) sample learning site for Design Patterns, System Design, and Docker. Plain HTML, CSS, and JavaScript—no build step, no login.

## Run locally

From this directory:

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080/](http://localhost:8080/).

## URL shapes

| Page | Path |
| --- | --- |
| Home | `index.html` |
| Course | `course.html?id=<course-id>` (e.g. `design-patterns`) |
| Section | `section.html?course=<course-id>&section=<section-id>` |

Course ids: `design-patterns`, `system-design`, `docker`.

## Exports

On each section page you can download:

- **Markdown** (`.md`) — Notion-friendly paste/import
- **Standalone HTML** — offline reading with inlined styles and diagram

## GitHub Pages

Publish from the `main` branch, site root (`/`). Expected URL once enabled:

`https://Jackize.github.io/coding-skills/`

Enable in the repo: **Settings → Pages → Deploy from a branch → `main` / `/` (root)**.

Or via API (needs auth):

```bash
gh api repos/Jackize/coding-skills/pages -X POST -f build_type=legacy -f source[branch]=main -f source[path]=/
```

## Adding content

Edit `js/catalog.js`:

1. Add or update a course under `courses` (`id`, bilingual `title` / `summary`).
2. Add sections with `id`, `title`, `body` (Markdown), `baseline`, `skills`, and `diagram` (filename stem under `assets/diagrams/`).
3. Drop a matching SVG at `assets/diagrams/<diagram>.svg`.

UI strings for chrome live in the page bootstraps (`js/app-*.js`) and `js/i18n.js`.

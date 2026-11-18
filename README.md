# Coding Skills

Bilingual (EN/VN) mid-level learning site for Design Patterns, System Design, and Docker. Plain HTML, CSS, and JavaScript—no build step, no login.

## Curriculum

Each course is a full progression (~8–10 sections). Every section follows the same document template:

1. Why this matters  
2. Mental model (+ diagram)  
3. Walkthrough  
4. Pitfalls & trade-offs  
5. Practice / exercises  

Plus **Baseline** and **Skills gained** on the section page. Content lives in `js/content/*.js` and is assembled by `js/catalog.js`.

| Course id | Focus |
| --- | --- |
| `design-patterns` | Pattern vocabulary → creational / structural / behavioral → real-feature capstone |
| `system-design` | Requirements → capacity & data → cache/API/async/scale → reliability & observability → design review |
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

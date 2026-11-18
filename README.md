# Coding Skills

Bilingual (EN/VN) sample learning site for Design Patterns, System Design, and Docker. Plain HTML, CSS, and JavaScript—no build step.

## Run locally

From this directory:

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080/](http://localhost:8080/) for the home page.

## URL shapes

| Page | Path |
| --- | --- |
| Home | `index.html` |
| Course | `course.html?id=<course-id>` (e.g. `design-patterns`) |
| Section | `section.html?course=<course-id>&section=<section-id>` |

## GitHub Pages

This repo is a static site. Enable **GitHub Pages** on the `main` branch (root) in repository settings to publish at `https://Jackize.github.io/coding-skills/`.

## Adding content

Later tasks load course and section data from `js/catalog.js`. See the implementation plan in the repo for the content model.
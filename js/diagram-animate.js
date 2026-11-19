/* ==========================================================================
   diagram-animate.js — upgrade <img class="section-diagram"> into an inline,
   animated SVG.

   Skill package: "diagram-animate" (S2)

   How it works (mirrors the algomaster.io technique, but for hand-authored
   SVGs loaded through <img>):
     1. Fetch the .svg and inline it (replace the <img>).
     2. Classify each shape as edge / node / text using simple heuristics.
     3. Add animation classes (edge-draw, node-in, fade) with staggered delays.
     4. Start the animation once, when the diagram scrolls into view.

   No diagram files need to be edited — it upgrades every section diagram.
   ========================================================================== */

/** Resolve an attribute, walking up through <g> groups (inheritance). */
function effectiveAttr(el, name) {
  let node = el;
  while (node && node.nodeType === 1) {
    const value = node.getAttribute(name);
    if (value) return value;
    node = node.parentElement;
  }
  return null;
}

/** Perceived luminance of a color (0 = dark, 1 = white). Unknown → 1. */
function colorLightness(color) {
  if (!color) return 1;
  const c = String(color).trim().toLowerCase();
  if (c === 'none' || c === 'transparent') return 0;
  if (c.startsWith('#')) {
    let hex = c.slice(1);
    if (hex.length === 3) hex = hex.split('').map((ch) => ch + ch).join('');
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    }
  }
  const nums = c.match(/[\d.]+/g);
  if (c.startsWith('rgb') && nums && nums.length >= 3) {
    return (0.2126 * +nums[0] + 0.7152 * +nums[1] + 0.0722 * +nums[2]) / 255;
  }
  return 1;
}

const GEOMETRY = 'rect,circle,ellipse,path,line,polyline,polygon';

/** Returns 'edge' | 'node' | 'text' | 'skip'. */
function classify(el) {
  const tag = el.tagName.toLowerCase();
  if (tag === 'text') return 'text';

  const fill = effectiveAttr(el, 'fill');
  const stroke = effectiveAttr(el, 'stroke');
  const dash = effectiveAttr(el, 'stroke-dasharray');

  // Connectors: lines, polylines, or any shape with fill="none".
  if (tag === 'line' || tag === 'polyline' || fill === 'none') {
    // Already-dashed edges (e.g. async flows) keep their style: fade only.
    return dash ? 'text' : 'edge';
  }

  // Filled shapes: a node unless it is a light, unstroked background/band.
  if (fill && fill !== 'none') {
    if (!stroke && colorLightness(fill) > 0.9) return 'skip';
    return 'node';
  }

  return 'skip';
}

/**
 * Inline and animate every `.section-diagram` <img> inside `root`.
 * Safe to call multiple times (e.g. after a language re-render).
 */
export function animateDiagrams(root = document) {
  const images = [...root.querySelectorAll('img.section-diagram')];
  if (!images.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return; // keep static <img> for reduced-motion users

  images.forEach((img) => {
    const src = img.getAttribute('src');
    if (!src) return;

    fetch(src)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error('bad response'))))
      .then((text) => {
        const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (!svg || svg.querySelector('parsererror')) return;

        // Preserve the <img> classes (e.g. inline-diagram) and add the marker.
        img.classList.forEach((c) => svg.classList.add(c));
        svg.classList.add('sd-svg');
        img.replaceWith(svg);

        const edges = [];
        const nodes = [];
        const texts = [];

        svg.querySelectorAll(`${GEOMETRY},text`).forEach((el) => {
          if (el.closest('defs,marker,clipPath,pattern,style,title,desc')) return;
          const kind = classify(el);
          if (kind === 'edge') edges.push(el);
          else if (kind === 'node') nodes.push(el);
          else if (kind === 'text') texts.push(el);
        });

        // Stagger: edges draw first, then nodes pop, then labels fade.
        edges.forEach((el, i) => {
          el.setAttribute('pathLength', '1');
          el.classList.add('sd-anim-edge-draw');
          el.style.animationDelay = `${Math.min(90 * i, 720)}ms`;
        });
        nodes.forEach((el, i) => {
          // A node that already has a transform would be clobbered by the
          // scale animation, so fall back to a fade for those.
          if (el.getAttribute('transform')) el.classList.add('sd-anim-fade');
          else el.classList.add('sd-anim-node');
          el.style.animationDelay = `${Math.min(240 + 70 * i, 1100)}ms`;
        });
        texts.forEach((el, i) => {
          el.classList.add('sd-anim-fade');
          el.style.animationDelay = `${Math.min(420 + 35 * i, 1200)}ms`;
        });

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                svg.classList.add('is-animating');
                observer.disconnect();
              }
            });
          },
          { threshold: 0.2 }
        );
        observer.observe(svg);
      })
      .catch(() => {
        /* file:// or offline — leave the static <img> untouched */
      });
  });
}

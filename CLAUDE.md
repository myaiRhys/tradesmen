---
name: web-design-creative
description: >
  Creative web design system for Kinnear Systems client work and portfolio demo sites.
  Use this skill whenever building ANY website, landing page, demo site, or frontend
  component for Kinnear Systems. This skill encodes the centrepiece-first design process,
  the 11 named aesthetics, forbidden patterns, and the workflow that produces award-winning
  output rather than generic AI slop.
  Trigger on: "build a site", "demo site", "law firm", "trades site", "construction site",
  "landing page", "portfolio site", "client site", "web design", "frontend", "hero section",
  "make it look like", "shader", "WebGL", "GSAP", "Three.js", "award winning", "unique design",
  "not generic", "Kinnear Systems site", or any request to build a website.
---

# Kinnear Systems — Creative Web Design System

Read this entire skill before writing a single line of HTML, CSS, or JS.
The process matters more than the code. Wrong process = AI slop. Right process = memorable work.

---

## THE CORE PROBLEM TO SOLVE

Claude defaults to the same skeleton every time:
- Dark background + muted text at 50% opacity
- Card grid with rounded corners and subtle borders  
- Serif heading + fade-up reveal on scroll
- Generic colour palette (navy, teal, warm white)
- Animations added ON TOP of the design as decoration

This produces sites that look identical regardless of the brief.
The fix is a completely different creative process.

---

## THE FIVE-STEP PROCESS (mandatory — do not skip)

### STEP 1 — PICK THE CENTREPIECE FIRST

Before layout. Before colour. Before content.
Identify ONE technical/interactive thing that will make someone stop and say "what is that."
Everything else on the site exists to support this one thing.

The centrepiece IS the design. It is not decoration added to a design.

**Available centrepiece options:**

| Centrepiece | Tech | Effect |
|-------------|------|--------|
| WebGL shader background | Raw WebGL + GLSL | Organic flowing animated background reacts to mouse |
| Image/text distortion | Three.js + displacement shader | Elements warp and ripple on hover/scroll |
| Kinetic typography | GSAP SplitText + physics | Headline characters fall, scatter, orbit, or collide |
| Horizontal scroll | GSAP ScrollTrigger | Site moves sideways instead of down |
| Magnetic cursor system | Spring physics JS | Large cursor element follows and morphs per section |
| Particle/dot grid | Canvas API | Interactive particle field responds to mouse with springs |
| 3D scene | Three.js | Actual 3D object or environment in the hero |
| Blueprint reveal | SVG stroke animation | Lines draw themselves on scroll (ideal for construction) |
| Cloth/fluid simulation | Three.js | Words or shapes hang and sway with physics |
| Scroll-jacked 3D | Three.js + ScrollTrigger | Camera moves through a 3D space as you scroll |

**Rule:** Pick ONE. Not two. One centrepiece executed with full attention.

### STEP 2 — INDUSTRY SUBVERSION

The centrepiece must feel WRONG for the industry at first glance, then RIGHT on reflection.
This is what makes it memorable and positions the client above competitors.

| Industry | Expected | Subverted | Why it works |
|----------|----------|-----------|--------------|
| Law firm | Dark, serif, conservative | Kinetic typography hero — letters scatter on scroll | Communicates precision, weight, control |
| Plumber/trades | Blue, orange, stock photos | Luxury dark aesthetic, Porsche-configurator quote tool | Signals premium pricing immediately |
| Construction | Corporate navy, project photos | Glowing wireframe/blueprint 3D that builds on scroll | Mirrors the industry — construction, structure |
| Accounting | Grey, trustworthy, boring | Swiss brutalism — grid systems, oversized numbers | Signals data precision through design |
| Restaurant | Warm, food photography | Dark editorial magazine — full-bleed type, one image | Positions as destination dining, not a takeaway |

### STEP 3 — PICK A NAMED AESTHETIC

Use one of the 11 named aesthetics from the claudekit reference system.
Naming it gives Claude Code a precise target. Do not describe, name.

| # | Aesthetic | Key characteristics | Best for |
|---|-----------|--------------------|---------:|
| 01 | Swiss Minimalism | Rigid grid, massive type, tons of white space, asymmetric | Accounting, legal, tech |
| 02 | Neumorphism | Extruded elements, multiple drop shadows, pressed-in buttons | Apps, dashboards |
| 03 | Glassmorphism | Animated mesh gradients, frosted glass, backdrop blur | SaaS, tech startups |
| 04 | Brutalism | Thick 3–4px borders, hard drop shadows, broken grid, raw type | Agencies, trades, anything bold |
| 05 | Claymorphism | Inflated 3D clay, marshmallow shapes, candy pastels | Consumer apps, food |
| 06 | Aurora Mesh Gradient | Slow breathing colour blobs, floating glass overlays | Beauty, wellness, creative |
| 07 | Retro-Futurism / Cyberpunk | Aggressive neon, CRT scanlines, HUD elements, glitch | Gaming, tech, entertainment |
| 08 | 3D Hyperrealism | Realistic textures, cinematic lighting, physics-based motion | Automotive, luxury products |
| 09 | Vibrant Block Maximalist | Solid clashing colour blocks, thick borders, snap hover | Fashion, events, bold brands |
| 10 | Dark OLED Luxury | True black, gold/brass accents, spotlight cursor | Legal, finance, luxury |
| 11 | Organic Biomorphic | Earth tones, morphing blobs, wavy dividers, living shapes | Health, nature, food |

### STEP 4 — DEFINE THE INTERACTION VOCABULARY

Three interactions, consistent across the whole site.
Consistency of interaction language = designed system, not dev demo.

Examples of good interaction vocabularies:
- Cursor distorts nearest text / all reveals use the same physics curve / hover reveals hidden content
- Everything responds to mouse position / transitions use matching ease / hover enlarges not colours
- Scroll drives all animation / nothing animates without scroll intent / hover is always additive not replacing

Write these three rules down before building.

### STEP 5 — WRITE THE FORBIDDEN PATTERNS LIST

Explicitly ban the default pattern for this specific site before writing any code.
Include at least 5 specific things Claude must NOT do.

Example for a law firm:
- No card grid layouts
- No opacity fades as the primary reveal
- No rounded corners anywhere
- No blue as an accent colour
- No stock-photo-style placeholder imagery
- No "professional and trustworthy" as a design goal — aim for "unexpected and precise"

---

## WHAT ACTUALLY MAKES SITES WIN AWARDS

Research from Awwwards, Lusion, Shader.se, Codrops:

**1. The interaction IS the design**
Not a page with animations. The animation is the primary experience.
Scroll doesn't reveal sections — scroll transforms the entire visual state.

**2. One insane technical centrepiece**
Lusion: cloth simulation. Shader.se: mouse-reactive WebGL shader.
Igloo (SOTY 2024): immersive 3D environment.
Always ONE jaw-drop moment. Not twelve decent things.

**3. Typography does violence**
Not "nice big heading." Text that:
- Splits character-by-character (GSAP SplitText)
- Distorts on hover (SVG displacement filter)
- Glitches on scroll (CSS glitch keyframes)
- Runs so large it breaks the grid
- Changes weight as you scroll through it

**4. Layout breaks expected rules**
Not a centred column with sections.
- Overlapping elements
- Text that runs off screen intentionally  
- Horizontal scroll
- Fullscreen sections that hijack scroll velocity
- Asymmetric grids that feel designed not generated

**5. Every hover state is a micro-experience**
Not "colour changes on hover."
- Images that warp and ripple
- Text that scatters then reforms
- Cursor that morphs shape per section
- Elements that attract or repel the cursor magnetically

---

## TECHNICAL STACK FOR CENTREPIECE EFFECTS

### WebGL Shader Background (Shader.se style)

```javascript
// Vertex shader — fullscreen quad
const vsSource = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

// Fragment shader — fbm noise reacting to mouse and time
const fsSource = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float smoothNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = noise(i); float b = noise(i + vec2(1,0));
    float c = noise(i + vec2(0,1)); float d = noise(i + vec2(1,1));
    return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float amp = 0.5; float freq = 1.0;
    for(int i=0; i<5; i++) { v += amp*smoothNoise(p*freq); amp*=0.5; freq*=2.0; }
    return v;
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse / u_resolution;
    float t = u_time * 0.12;
    vec2 p = uv * 2.5 - 1.25 + mouse * 0.15;
    float n1 = fbm(p + t*0.3);
    float n2 = fbm(p + n1 + vec2(t*0.2, t*0.15));
    float pattern = fbm(p + vec2(n2, fbm(p + n2 + vec2(-t*0.1, t*0.25))));
    // Replace dark/mid/light colours to match the aesthetic
    vec3 col = mix(vec3(0.04), mix(vec3(0.08), vec3(0.14), pattern), pattern*pattern*0.6);
    col *= 1.0 - length(uv - 0.5) * 1.2; // vignette
    gl_FragColor = vec4(col, 1.0);
  }
`;
// Canvas: position fixed, inset 0, z-index 0, pointer-events none
// Mouse: lerp actual uniforms toward target at 0.06 per frame for spring feel
// Resize: use ResizeObserver
```

### Spring Cursor System

```javascript
// Two elements: 6px dot (exact mouse) + 28px ring (80ms lag)
// On hover interactive elements: dot grows to 16px, ring to 56px
// body { cursor: none; } via useEffect, clean up on unmount
// Skip on touch devices: window.matchMedia('(pointer: coarse)')
```

### GSAP SplitText Hero Reveal

```javascript
// Mount animation — not scroll triggered
gsap.from('.hero-content > *', {
  opacity: 0, y: 20, stagger: 0.15,
  duration: 0.9, ease: 'power2.out', delay: 0.3
});

// Character split for kinetic effect
const split = new SplitText('h1', { type: 'chars' });
gsap.from(split.chars, {
  opacity: 0, y: 60, rotation: 'random(-15,15)',
  stagger: 0.03, duration: 0.8, ease: 'back.out(1.7)'
});
```

### Scroll Progress Bar

```javascript
// 1px fixed bar at top, z-index 200
// scrollEl.scrollTop / (scrollHeight - clientHeight) * 100
// background: accent colour at 50% opacity
```

### Horizontal Scroll Section (GSAP)

```javascript
gsap.to('.horizontal-track', {
  x: () => -(document.querySelector('.horizontal-track').scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-wrapper',
    start: 'top top',
    end: () => '+=' + document.querySelector('.horizontal-track').scrollWidth,
    scrub: 1,
    pin: true,
  }
});
```

### SVG Blueprint Reveal (Construction sites)

```javascript
// All SVG paths start with strokeDashoffset = strokeDasharray (invisible)
// ScrollTrigger animates dashoffset to 0 as user scrolls
gsap.to('path', {
  strokeDashoffset: 0,
  stagger: 0.1,
  duration: 1.5,
  ease: 'power2.inOut',
  scrollTrigger: { trigger: '.blueprint', start: 'top 70%', scrub: 0.5 }
});
```

---

## TYPOGRAPHY RULES

**Never use:** Inter, Roboto, Arial, system-ui, Space Grotesk as display fonts.

**Distinctive pairings that work:**

| Display | Body/UI | Mood |
|---------|---------|------|
| Playfair Display (serif) | DM Mono | Legal, editorial, luxury |
| Bebas Neue (compressed) | Inter | Industrial, trades, bold |
| Syne (geometric) | DM Sans | Tech, modern, agency |
| Cormorant Garamond (elegant serif) | DM Mono | Ultra-luxury, fashion |
| Space Mono (monospace) | Space Mono | Brutalist, technical, raw |
| Unbounded (wide) | Outfit | Construction, bold, modern |
| DM Serif Display | DM Sans | Editorial, clean premium |

**Typography as violence (award-winning technique):**
- Hero heading: `clamp(4rem, 10vw, 9rem)` — so big it crops at mobile
- Letter spacing: `-0.04em` on display, `0.2em` on mono labels
- Weight contrast: 400 display vs 500 mono — never use 700 for headings
- One font at one weight, differentiated by size and spacing only (brutalist constraint)

---

## COLOUR SYSTEM (OKLCH approach)

Instead of picking hex colours, derive everything from one hue:

```css
:root {
  --hue: 30; /* change this one number to re-theme everything */
  --bg:      oklch(0.08 0.01 var(--hue));
  --surface: oklch(0.12 0.015 var(--hue));
  --raised:  oklch(0.16 0.02 var(--hue));
  --text:    oklch(0.92 0.02 var(--hue));
  --muted:   oklch(0.92 0.02 var(--hue) / 0.5);
  --faint:   oklch(0.92 0.02 var(--hue) / 0.22);
  --accent:  oklch(0.72 0.15 var(--hue)); /* gold/brass at hue 30 */
  --border:  oklch(0.92 0.02 var(--hue) / 0.07);
}
```

Hue reference: 0=red, 30=orange/gold, 60=yellow, 120=green, 200=blue, 270=purple, 330=pink

---

## FORBIDDEN PATTERNS (always ban these in prompts)

These are the things Claude defaults to. Explicitly ban them in every site prompt:

- `border-radius` on cards and containers (use sharp corners unless aesthetic demands otherwise)
- `opacity: 0.5` as the only way to mute colours (use OKLCH alpha instead)
- Card grid as the primary layout pattern
- `transform: translateY(20px)` fade-up as the only scroll reveal
- Blue or teal as the default accent (unless specifically chosen)
- Purple gradient on any background
- Centred hero content as the default (try bottom-left, edge-aligned, or cropped)
- `font-weight: 700` on headings (use 400 or 500 with size instead)
- Rounded pill buttons (use sharp rectangular buttons)
- "Professional and trustworthy" as a design goal (too vague, produces generic output)

---

## THE PROTOTYPE-FIRST RULE

**Never write the Claude Code prompt before seeing the centrepiece work.**

Process:
1. Agree on centrepiece interaction in chat with Rhys
2. Build centrepiece as standalone HTML/JS prototype in chat
3. Rhys reacts to the prototype — refine until it feels right
4. ONLY THEN write the Claude Code prompt
5. Prompt references prototype: "replicate this centrepiece exactly, build the rest around it"
6. Claude Code builds the full site
7. Review and iterate

This prevents writing prompts for things that won't look good.
The prototype is the brief. Code after agreement, not before.

---

## THREE DEMO SITES — KINNEAR SYSTEMS PORTFOLIO

### Site 1: Law Firm — Van der Berg & Associates

**Centrepiece:** WebGL shader background (warm, like candlelight — not the cold dark KS version)
+ hero heading that splits into characters on load using GSAP
**Aesthetic:** Dark OLED Luxury (#10) with Brutalist typography elements
**Subversion:** Law firm that feels like a luxury watchmaker's website
**Forbidden extra:** No card layouts. No section reveals. All content in one continuous editorial scroll.
**Fonts:** Cormorant Garamond display + DM Mono UI
**Accent hue:** 35 (warm brass/gold)
**Wow interaction:** Hover on attorney names reveals a floating text panel that follows the cursor

### Site 2: Trades — Premium Plumber

**Centrepiece:** Interactive quote calculator styled like a Porsche configurator — large dial/slider, not a form
**Aesthetic:** Brutalism (#4) — but dark, not the white brutalism people expect
**Subversion:** Plumber site that looks more expensive than any competitor in Cape Town
**Forbidden extra:** No orange. No stock photos of pipes. No "call now" buttons.
**Fonts:** Bebas Neue display + Space Mono body
**Accent hue:** 45 (sharp yellow — the one unexpected colour)
**Wow interaction:** The price counter animates as you adjust sliders — feels alive

### Site 3: Construction / Property Development

**Centrepiece:** SVG blueprint line-drawing that builds itself on scroll — entire hero is an architectural line drawing
**Aesthetic:** Swiss Minimalism (#01) — white or light, extremely precise grid
**Subversion:** Construction company that looks like an architecture firm's website
**Forbidden extra:** No dark background. No project photo grids. No "delivering excellence."
**Fonts:** Unbounded display + DM Mono
**Accent hue:** 200 (architectural blue — precise, not corporate)
**Wow interaction:** Project portfolio items are large architectural numbers (01, 02, 03) that reveal images on hover

---

## CLAUDE CODE PROMPT STRUCTURE

When writing a Claude Code prompt, always follow this order:

1. **Centrepiece specification first** — full technical detail of the one wow effect
2. **Named aesthetic** — "this site uses Dark OLED Luxury aesthetic"  
3. **Stack** — Next.js 15, TypeScript, Tailwind, GSAP, (Three.js if needed)
4. **Forbidden patterns list** — explicit, specific, at least 5 items
5. **Typography specification** — exact font names and pairing
6. **Colour specification** — OKLCH hue value and role mapping
7. **Section content** — AFTER all of the above
8. **Final checks** — npm run build, TypeScript, mobile, pointer events

Content comes LAST. The experience comes first.

---

## KINNEAR SYSTEMS BRAND (for the KS site itself)

- **Aesthetic:** Technical Brutalism meets Swiss Minimalism
- **Centrepiece:** WebGL fbm shader background — cool dark, mouse reactive
- **Fonts:** Georgia serif display + DM Mono UI
- **Accent:** rgba(232,228,220,0.5) — warm off-white, no bright colours
- **Palette:** #0a0a0a background, #e8e4dc text
- **Cursor:** Spring cursor — 6px dot + 28px ring, 80ms lag
- **Stack:** Next.js 15, TypeScript, Tailwind, GSAP ScrollTrigger, raw WebGL
- **Domain:** kinnearsystems.co.za
- **Email:** rhys@kinnearsystems.co.za

---

## QUALITY CHECKLIST

Before shipping any site, verify:

- [ ] The centrepiece is the FIRST thing you see and feel
- [ ] Three consistent interaction rules are applied throughout
- [ ] At least 5 forbidden patterns were actively avoided
- [ ] Typography uses a distinctive pairing — not system fonts
- [ ] Colour is derived from a single hue — not arbitrary hex picking
- [ ] Mobile works at 375px width
- [ ] Pointer events on WebGL canvas = none (never blocks clicks)
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] The site looks nothing like any other site in that industry
- [ ] Rhys has seen a prototype and approved the centrepiece before full build

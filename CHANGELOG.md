# 📋 MindScroll AI — Changelog

All notable changes and upgrades to MindScroll AI are documented in this file.

---

## [2.1.0] - Vercel Multi-Service Deployment Support
- **Vercel Project Services Architecture**: Added root `vercel.json` defining `frontend` (Vite) and `backend` (FastAPI) as unified multi-services.
- **Top-Level Rewrites**: Configured `/(.*)` -> `frontend` and `/api/(.*)` -> `backend`.
- **Internal Service Bindings**: Added `BACKEND_URL` binding from `frontend` to `backend`.
- **FastAPI Route Dual-Mounting**: Configured routes at both root `/` and `/api` prefix for seamless reverse-proxying.
- **Vercel ASGI Entrypoint**: Created `backend/main.py` exporting the ASGI app for automatic framework detection.

---

## [2.0.0] - Creative Motion & Universal Theme Upgrade

### 🎨 Part 1: Light / Dark / System Theme Architecture
- **Semantic CSS Variables**:
  - Replaced all hardcoded hex values with CSS variables defined on `:root` and `[data-theme="dark"|"light"]`.
  - Mapped tokens in `tailwind.config.js`: `bg-base`, `bg-card`, `bg-subtle`, `bg-input`, `border-theme`, `primary`, `content-main`, `content-muted`, `content-subtle`, and accent states.
  - **Dark Mode**: Rich near-black `#0A0A0A` background with `#121212` elevated card surfaces, vibrant orange gradient accent (`#FF6B1A` to `#FF8A3D`), subtle glowing borders, and neon-style shadows.
  - **Light Mode**: Warm cream base (`#FFF8F1`) with frosted white glass cards (`rgba(255, 255, 255, 0.8)`), crisp dark-ink typography (`#1A1410`), soft peach gradients, and layered shadows.
- **Zero-FOUC Theme Initialization**:
  - Injected an inline script in `index.html` executing synchronously prior to the first render pass to read `localStorage` or `prefers-color-scheme` and apply `data-theme` immediately without layout shifts.
- **Showpiece Theme Toggle**:
  - Morphing Sun & Moon icon with SVG path morphing, animated sun rays, moon craters, star glints, spring bounce, and radial back-glow.
  - **Circular Reveal Transition**: Utilizes the modern View Transitions API (`document.startViewTransition`) with radial clipping expansion (`clip-path: circle(...)`) centered precisely at the user's click coordinate, falling back seamlessly to an ultra-smooth 0.4s cross-fade if unsupported.
  - Accessible `aria-label`, `aria-pressed`, and global keyboard shortcut (`"T"` key) for instant toggling.
- **WCAG AA Compliance & Chart Adaptation**:
  - Recharts axes, grids, tooltips, and bar/scatter/pie elements dynamically recalculate colors and contrast across light and dark themes.

---

### 🌊 Part 2: Motion, Visual Atmosphere & Micro-Interactions
- **Atmospheric Backgrounds**:
  - `AuroraBackground`: Smoothly drifting theme-adaptive mesh gradient blobs in warm orange, amber, and subtle violet hues.
  - `ParticleField`: High-performance HTML5 Canvas interactive particle field with mouse parallax and reactive attraction, automatically paused via `visibilitychange` when the tab is inactive.
  - `NoiseOverlay`: Subtle SVG film-grain texture layered over the viewport.
- **Landing Page & Cinematic Hero**:
  - `HeroPhoneOrbit`: 3D CSS perspective phone silhouette showcasing a luminous mini score gauge and orbiting platforms (TikTok, Instagram, YouTube, Snapchat, X).
  - `SplitText`: Masked stagger entrance for hero titles with word-by-word and letter-by-letter reveal animations.
  - `PlatformMarquee`: Seamless infinite horizontal ticker showcasing monitored social media networks.
  - Smooth inertia scrolling integrated via **Lenis** (`@studio-freight/lenis`) configured with `overflow-x: clip` to preserve sticky positioning.
- **Interactive Cursor & Physics**:
  - `CustomCursor`: Trailing elastic ring and center dot with contextual feedback badges (`"Explore"`, `"View"`, `"Drag"`), disabled automatically on touch and mobile devices.
  - `MagneticButton`: Smooth cursor-pull physics and radial click ripple wave effects.
  - `TiltCard`: Gyroscopic 3D card tilt with a cursor-following specular glare highlight.
  - `SpotlightCard`: Dynamic radial spotlight glow that tracks mouse movement across cards.
- **Interactive Wizard & Flow**:
  - Direction-aware step transitions (smooth left/right slide and fade).
  - Stress Level segmented control with a sliding pill indicator (`layoutId="stress-pill"`).
  - Floating live value badges on continuous range sliders.
- **Result & Simulation Polish**:
  - Sweeping luminous SVG score gauge with dynamic glow and trail effect.
  - Confetti celebration blast on high-wellness scores via `canvas-confetti`.
  - Sequential cascading animation for driver impact bars.
  - `SimulatorPage`: 3D flipping delta badge that pulses green or red depending on predicted score changes.
- **Performance & Reduced-Motion Respect**:
  - Strict compliance with `prefers-reduced-motion: reduce`: automatically disables heavy canvas physics, tilt glare, and parallax while maintaining smooth instant fades.
  - Hardware-accelerated transforms (`transform: translate3d`, `opacity`) utilized exclusively for zero paint-loop degradation.

---

### 📱 Part 3: Full Responsiveness (All Screen Sizes)
- **Multi-Tier Adaptive Navigation**:
  - **Desktop (>= 1024px)**: Glass collapsible sidebar with expand/collapse toggle (`w-64` / `w-20`).
  - **Tablet (768px – 1023px)**: Icon-only collapsed sidebar that smoothly expands on hover or tap.
  - **Mobile (< 768px)**: Fixed top glass header (with logo, status dot, history, and 1-tap ThemeToggle) + fixed bottom tab bar with animated active indicator (`layoutId="mobile-active-tab-glow"`) and hamburger sheet for extra tools.
- **Fluid Layouts & Safe-Area Ergonomics**:
  - Adopted `100dvh` across containers and `env(safe-area-inset-*)` padding for notched devices.
  - Applied fluid `clamp()` typography to hero headers (`clamp(2.1rem, 6vw, 4.5rem)`).
  - Enforced `max-w-[1600px]` width capping for 4K and ultrawide displays.
- **Touch Target & Mobile Input Enhancements**:
  - All interactive buttons, tabs, sliders, and controls meet or exceed `44x44px` hit areas.
  - Sliders enhanced with 24px grab thumbs and touch-action tracking.
  - `@media (hover: hover)` queries prevent stuck hover states on touch screens.
- **Component Reflows**:
  - **Hero 3D Phone**: Responsive scale and height transform preventing horizontal overflow on 320px–375px screens.
  - **Score Gauge**: Container-relative `viewBox` geometry fluidly scaling from small phones to large monitors.
  - **Insights Dashboard**: Adaptive 1-col (mobile) / 2-col (tablet) / 3-col (desktop) grid.
  - **Mobile Filter Drawer**: Filters slide into a bottom sheet drawer on screens `< 768px`.
  - **Heatmap Swipeability**: Horizontal swipe hint and scrollable overflow container for 6x6 correlation matrix.
  - **Model Card Table**: Automatically transforms from wide table to stacked metric cards on mobile devices.

---

## [1.0.0] - Initial Production Release
- Trained Scikit-Learn Random Forest Regression Pipeline (`Mental_Health_Model.pkl`).
- FastAPI backend serving `/predict`, `/options`, `/insights`, `/whatif`, and `/model-card`.
- 4-step wizard assessment, comparative insights analytics, and printable PDF reports.

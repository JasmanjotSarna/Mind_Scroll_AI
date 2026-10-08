# 📋 MindScroll AI — Changelog

All notable changes and upgrades to MindScroll AI are documented in this file.

---

## [2.2.0] - "The Scroll Leaves a Mark" Creative Direction Upgrade

### 🔍 Step 0 Audit: Top 10 Visual, Spacing, Contrast, Alignment & Performance Issues Resolved
1. **Missing Web Fonts & Monospace Fallback**: `Space Grotesk` and `JetBrains Mono` were absent in `index.html`, resulting in browser default serif/sans font shifts. Integrated high-performance Google Fonts with display swapping and preconnect headers.
2. **Lack of Narrative Signal Continuity**: The interface lacked the unifying concept "THE SCROLL LEAVES A MARK". Introduced `SignalOrb3D` (Three.js WebGL reactive particle sphere) that dynamically shifts hue and intensity across the hero, wizard, and result screens.
3. **Absence of Preloader Experience**: First-time session visitors were immediately thrust into the page. Added `Preloader` with an editorial 0-100% counter, drawing SVG signal wave, and curtain reveal, guarded by `sessionStorage` and `prefers-reduced-motion`.
4. **Desktop Navigation Architecture**: Replaced generic links with Vertex3D bracket navigation syntax (`[ Home ] [ Predict ] [ Simulator ] [ Insights ] [ Model ]`) and added DashDigital "Menu +" full-screen overlay with numerical indices and item counts.
5. **Hero Editorial Impact & Empirical Proof**: Upgraded the hero with a mixed-weight headline (`Your scroll, *decoded*`) and added `ProofNumbersStrip` with live ease-out count-up metrics (5,000 students, 12 features, 0.864 R², 10+ countries).
6. **Feature Plate Tagging**: Transformed feature cards into portfolio-grade plates with `[Plate 01]`, `[Plate 02]`, `[Plate 03]` numbered tags and hairline glass borders.
7. **Interactive Pipeline Explorer**: Created `PipelineExplorer` ("How the model thinks"), featuring 4 stages (Student Inputs $\rightarrow$ Preprocessing $\rightarrow$ Random Forest $\rightarrow$ Score Synthesis) with arrow-key navigation, auto-play toggle, and live JSON I/O inspection.
8. **Result Telemetry & Action Layer**: Enhanced `ResultPage` with a quick "Copy Summary" markdown clipboard generator, numbered suggestion plates, and the 3D signal orb settling into the student's wellness score color band.
9. **Model Card Expandable Rows**: Refactored the Model Card and FAQ sections into DashDigital expandable rows with clear "More +" and "Less -" triggers, preserving the stacked cards view on mobile devices.
10. **Contextual Next-Page Footer & Back-to-Top**: Built an editorial "Next Destination" preview banner in `Footer` that links sequentially to the next experience, alongside a smooth "Back to top" control.

### 🎨 Visual & Motion Design Additions
- **`Preloader.tsx`**: 0-100% counter, SVG drawing line, and curtain lift animation.
- **`SignalOrb3D.tsx`**: Lightweight Three.js particle sphere with orbiting signal rings, mouse parallax, and tab visibility pausing.
- **`PipelineExplorer.tsx`**: Interactive scikit-learn pipeline explorer with formatted JSON payloads and copy triggers.
- **`HowItWorksStepper.tsx`**: 4-step Riotters stepper with Prev/Next controls and playful micro-copy.
- **`ProofNumbersStrip.tsx`**: Smooth count-up telemetry strip for empirical validation metrics.
- **`MenuOverlay.tsx`**: Full-screen DashDigital editorial atlas navigation overlay with ESC and keyboard shortcuts.
- **SEO & Social Sharing**: Complete OpenGraph, Twitter card, canonical tags, theme colors, and a 1200x630 cinematic `og-image.png`.

---

## [2.1.0] - Vercel Multi-Service Deployment Support
- **Vercel Project Services Architecture**: Added root `vercel.json` defining `frontend` (Vite) and `backend` (FastAPI) as unified multi-services.
- **Top-Level Rewrites**: Configured `/(.*)` -> `frontend` and `/api/(.*)` -> `backend`.
- **Internal Service Bindings**: Added `BACKEND_URL` binding from `frontend` to `backend`.
- **FastAPI Route Dual-Mounting**: Configured routes at both root `/` and `/api` prefix for seamless reverse-proxying.
- **Vercel ASGI Entrypoint**: Created `backend/main.py` exporting the ASGI app for automatic framework detection.

---

## [2.0.0] - Creative Motion & Universal Theme Upgrade
- Semantic CSS variables and Tailwind token system for Dark (`#0A0A0A`) and Light (`#FFF8F1`) themes.
- Circular reveal View Transition theme switcher with morphing Sun/Moon icon.
- Interactive custom cursor, magnetic button physics, and 3D tilt cards.
- Mobile-first responsive layout (320px to 2560px) with 100dvh and safe-area insets.

---

## [1.0.0] - Initial Production Release
- Trained Scikit-Learn Random Forest Regression Pipeline (`Mental_Health_Model.pkl`).
- FastAPI backend serving `/predict`, `/options`, `/insights`, `/whatif`, and `/model-card`.
- 4-step wizard assessment, comparative insights analytics, and printable PDF reports.

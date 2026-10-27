# Changelog

All notable changes to QR Volde are recorded here.

## [Unreleased]

### Marketing

- Added a 20-second launch film built from real app captures and rendered with [HyperFrames](https://hyperframes.heygen.com).
- Added `launch.html`, an animated GIF preview, poster, MP4 download, share copy, and social sharing links.
- Added the editable composition, launch plan, composition brief, and render notes under `launch-film/`.

### Documentation

- Rebuilt the README with a project overview, screenshot gallery, architecture, QA, deployment, safety, and license sections.
- Added desktop, mode, QR Studio, and mobile screenshots under `docs/screenshots/`.
- Improved scene-rail label legibility over the QR artwork.
- Added launch-film credits and third-party notices for the music, SFX, GSAP, and HyperFrames.

## [0.1.0] — 2026-10-27

### Added

- **The Signal → The Unfold → The Chowk → The Studio** scroll narrative.
- A giant 3D QR monolith built from instanced modules, with a wall-to-ground morph and a matching QR ground texture.
- A procedural Kathmandu-style chowk: tiered pagoda, shop row, tea stall, dhunge dhara, stupa, trees, prayer flags, utility wires, lamps, people, a dog, pigeons, a bus, and a scooter.
- Himalayan backdrop with layered mountains, snow caps, clouds, and an island plaza.
- Three switchable visual modes: **Himalayan Dawn**, **Neon Kathmandu**, and **Minimal Gallery**. Mode choice persists in `localStorage`.
- **QR Studio** dialog with client-side QR generation, live preview, four presets, PNG download, and “Use in world”.
- High-contrast flat QR output at 512 × 512 with a four-module quiet zone; 3D QR remains themed artwork.
- UTF-8 / Devanagari payload support; 160-character limit; error correction Q (25%).
- Responsive camera framing for wide, tablet, and portrait screens.
- Reduced-motion support, keyboard-friendly dialog, focus restoration, and a WebGL fallback that keeps QR Studio usable.
- Accessibility fixes: descriptive brand label and larger rail touch targets.
- Local QA server, syntax check script, and GitHub Pages–ready static structure.

### QA

- Lighthouse: 100 accessibility, 100 best practices, 100 SEO (local v0.1.0 audit).
- Verified desktop (1280 × 800), narrow desktop (785 × 932), and mobile (390 × 844) layouts.
- Verified all three modes at the signal and chowk stages.
- Verified real scrolling, rail navigation, CTA, mode persistence, QR Studio generate/apply/download, Devanagari input, invalid input, max length, reduced motion, and no-WebGL fallback.
- Downloaded QR checked visually for finder patterns and quiet zone.

### Known limits

- The 3D QR is an artwork, not a scanning target. The flat QR in QR Studio is the scannable code.
- The chowk is a Kathmandu-inspired composition, not a survey-accurate reconstruction.
- Payment and authenticator presets are clearly labelled demos; no real bank, merchant, or TOTP payloads are included.
- No backend, accounts, analytics, routing, or QR history.
- Final brand copy, CTA destination, and any real payloads remain open for approval.

### Planned

- **v0.2** — City: more streets, depth, and life.
- **v0.3** — Districts: switchable neighbourhoods and landmarks.
- **v0.4** — Launch: final brand copy, CTA destination, and real demo payloads.
- **v1.0** — Stable release.

# Changelog

All notable changes to QR Volde are recorded here.

## [0.2.0] — 2026-10-29

**QR Atelier.** The flat code becomes a collectible art card, and every export is tested for scannability.

### Added

- **QR Atelier** inside QR Studio, with six sample styles: **Everest Nocturne**, **Newari Heirloom**, **Lotus Rosé**, **Neon Bazaar**, **Pashmina Light**, and **Tiger Guardian**.
- **Custom Atelier** with a name or monogram, caption, four palettes, and five procedural motifs. No photo or file upload is required.
- **2048 × 2560 art-card export** with a gallery plinth, deterministic edition code, style label, inscription, paper texture, and a scannable QR panel.
- **Plain QR fallback** export at **1024 × 1024** for printers and older scanners.
- Live Atelier preview in QR Studio, including the art card, edition code, and plain-code note.
- Atelier preferences persist in `localStorage` under `qrvolde-art`.
- New screenshots: `atelier-newari.webp`, `atelier-custom.webp`, `qr-studio.webp`, and `mobile-atelier.webp`.
- README sections for QR Atelier, art-QR scannability, and the expanded QA record.

### Changed

- Error correction is now **H (30%)** by default, giving the central seal and decorative panel recovery room. The same matrix still drives the 3D wall, ground texture, art card, and plain fallback.
- QR Studio now leads with the collectible art preview; the plain high-contrast code remains one click away.
- **Use in world** uses the current payload even when the preview has not been refreshed.
- Invalid input clears the Atelier thumbnails and disables all three export actions.
- Atelier labels were enlarged for legibility on desktop and mobile.

### Marketing

- Added a 20-second launch film built from real app captures and rendered with [HyperFrames](https://hyperframes.heygen.com).
- Added `launch.html`, an animated GIF preview, poster, MP4 download, share copy, and social sharing links.
- Added the editable composition, launch plan, composition brief, and render notes under `launch-film/`.

### Documentation

- Rebuilt the README with a project overview, screenshot gallery, architecture, QA, deployment, safety, and license sections.
- Added desktop, mode, QR Studio, Atelier, and mobile screenshots under `docs/screenshots/`.
- Improved scene-rail label legibility over the QR artwork.
- Added launch-film credits and third-party notices for the music, SFX, GSAP, and HyperFrames.
- Updated the research notes with QR art, error-correction, and scannability decisions.

### QA

- App Lighthouse: 100 accessibility, 100 best practices, 100 SEO (local v0.2.0 audit).
- Launch-page Lighthouse: 100 accessibility, 100 best practices, 100 SEO (local audit).
- Axe-core: no violations with QR Studio open at desktop width. The base page's only note, a missing landmark on the scroll hint, was fixed with `role="complementary"`.
- Verified at 1440 × 1100, 1280 × 800, 785 × 932, and 390 × 844. No horizontal overflow on mobile.
- All six sample styles plus custom variants decoded with a QR reader at 2048 × 2560 and 640 × 800.
- Long 160-character payloads, one-character monograms, long names/captions, and the plain 1024 × 1024 fallback decoded successfully.
- Tested all three visual modes, real scrolling, rail navigation, CTA, Atelier style switching, custom palette/motif selection, name and caption personalization, art PNG download, plain fallback download, Use in world, Devanagari input, invalid input, reduced motion, and no-WebGL fallback.
- Downloaded art checked for finder patterns, a four-module quiet zone, opaque paper, and high contrast.

### Known limits

- The 3D QR remains an artwork, not a scanning target. The Atelier art PNG and plain fallback are the scannable artifacts.
- The art card is a normal PNG. No wallet, chain, marketplace, or on-chain uniqueness integration is included; the edition code is a deterministic design detail.
- Payment and authenticator presets are clearly labelled demos; no real bank, merchant, or TOTP payloads are included.
- The chowk is a Kathmandu-inspired composition, not a survey-accurate reconstruction.
- No backend, accounts, analytics, or QR history. Atelier preferences are stored only in the browser.
- Final brand copy, CTA destination, real payloads, and the original-code license remain open.

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

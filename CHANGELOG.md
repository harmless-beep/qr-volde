# Changelog

All notable changes to QR Volde are recorded here.

## [0.4.0] — 2026-10-31

**Mithila Courtyard.** A fourth visual mode leaves the Kathmandu Valley for the Terai. It is a separate architecture group and a separate camera flight, not a palette swap.

### Added

- **Mithila Courtyard** visual mode, inspired by Janakpur: a white domed temple with chhatris, arches, and jaali screens; Mithila-painted houses and a painting pavilion; a sacred pond with ghats, floating diyas, and herons; a tulsi shrine; mango and banana groves; festival kites; a cart; an elephant; a bovine; and courtyard residents in sari, dhoti, bun, and tika.
- A **raised circular aripana** floor painting above the QR plaza, built from original Canvas 2D line art and procedural geometry.
- A second camera rig, `CAMERA_RIGS.mithila`, that flies **left** over the pond and painting pavilion instead of orbiting right over the Newari shop row.
- Scene switching in `scene.js` (`setSceneMode`, `setCityVisible`, `setMithilaVisible`) and a named `mithila` scene group. The Newari `chowk` and `chowk-road` groups hide while Mithila is active.
- **Mithila palette** in `scene-world.js`: warm Terai dusk, pale hazy mountains, deep-plum QR floor, teal pond water, and a low sun. High clouds are cleared so the sky belongs to the temple and the kites.
- Per-mode section copy: section 3 becomes **The Courtyard** with `A courtyard at dusk.` and the tags `Mithila` / `Janakpur`.
- Mithila theme, page background, mode swatch, theme-color value, and `localStorage` whitelist entry.
- New `city-mithila.js` scene module, added to `npm run check`.
- New screenshots: `mithila-courtyard.webp`, `mobile-mithila.webp`, and `mithila-studio.webp`.

### Changed

- `makePerson` in `city-life.js` accepts `sari`, `dhoti`, `bun`, `tika`, and `tray` options, so the same low-poly resident system can dress for the Terai courtyard.
- `scene-world.js` special-cases Mithila for sun position, sky sprite, halo, cloud opacity, and mountain haze.
- The mode group now holds four swatches; mobile spacing was retuned so it still fits the top bar at 320px.
- Version bumped to 0.4.0.

### QA

- App Lighthouse: 100 accessibility, 100 best practices, 100 SEO (local v0.4.0 audit).
- Launch-page Lighthouse: 100 accessibility, 100 best practices, 100 SEO.
- Axe-core: no violations with QR Studio closed and open, at desktop and mobile widths, in Mithila mode.
- Verified at 1440 × 1100, 390 × 844, and 320 × 700. No horizontal overflow; the four-swatch mode group fits.
- Mode QA: switching hides `chowk`/`chowk-road`, shows `mithila` with 30 scene groups, and restores the chowk on switch-back. Persistence survives reload and section-3 copy resets.
- Reduced motion and no-WebGL paths verified; the WebGL run has no console errors.
- Full v0.3 regression re-run: all six Atelier styles plus custom and plain fallback decode; overlay exclusion stays at zero pixels; export is unchanged; Studio interactions pass.

### Known limits

- Mithila is an artistic, Janakpur-inspired interpretation, not a survey-accurate reconstruction. The white domed temple is a composition, not a specific building.
- The 3D QR remains artwork, not a scanning target.
- Payment and authenticator presets remain clearly labelled demos.
- Final brand copy, CTA destination, real payloads, and the original-code license remain open.

## [0.3.0] — 2026-10-31

**Living Atelier.** The collectible preview becomes a small playable object: gold dust, a gentle tilt, a seal ceremony, and a one-tap randomizer.

### Added

- **Living Atelier** pointer layer on the QR Studio preview: palette-tinted gold dust, a soft radial glow, and a card tilt of up to 3°.
- **Seal interaction**: click, tap, **Enter**, or **Space** triggers two rings, a warm flash, a particle burst, and a rotating hint with the style name and deterministic edition code.
- **Surprise me** control beside the style name. It picks a different sample style, or keeps Custom Atelier about half the time and chooses a new palette and motif.
- **QR exclusion rectangle**: the overlay clears the code every frame, and pointer effects project to the nearest panel edge so the QR never sits under dust or glow.
- Keyboard support: the preview stage is a real `<button>` with a dynamic accessible label, an `aria-describedby` hint, and a visible focus ring.
- Touch support: tapping the card seals it on mobile.
- New `qr-play.js` Canvas 2D overlay module with no runtime dependencies.
- New `living-atelier.webp` screenshot, plus refreshed `qr-studio.webp` and `mobile-atelier.webp`.

### Changed

- The live Studio preview is now wrapped in a `#qr-stage` button, `#qr-tilt` transform layer, and `#qr-spark` overlay canvas.
- `renderQRArt` returns the QR panel rectangle and palette colors so the overlay can protect the code and match the current finish.
- Atelier style name now sits beside the Surprise me pill, with the live hint below the card.
- Mobile Studio stage widths were retuned so the preview, hint, and randomizer fit without horizontal overflow.
- Version bumped to 0.3.0; `npm run check` includes `qr-play.js`.

### QA

- App Lighthouse: 100 accessibility, 100 best practices, 100 SEO (local v0.3.0 audit).
- Launch-page Lighthouse: 100 accessibility, 100 best practices, 100 SEO.
- Axe-core: no violations with QR Studio open at desktop and mobile widths.
- Verified at 1440 × 1100 and 390 × 844. No horizontal overflow and no clipped Studio controls.
- Overlay QA: zero overlay pixels inside the QR rectangle while the pointer is over the panel; dust and glow render outside it; tilt resets on pointer leave.
- Keyboard Enter and Space both seal; touch tap seals; hint updates correctly; export canvas is unchanged by pointer movement or sealing.
- Surprise me kept Custom active 17 of 36 tries and produced 10 distinct palette/motif combinations.
- All six sample styles plus custom variants decoded at 2048 × 2560 and 640 × 800; the plain 1024 × 1024 fallback decoded.
- Reduced motion: zero overlay pixels, no tilt, no seal/shuffle animation, and the seal hint still updates.
- No-WebGL: fallback visible, Studio usable, art preview renders, stage still seals.
- No console errors on the live site.

### Known limits

- The Living Atelier is a preview-only flourish. It does not add sound, haptics, or gameplay progression.
- The interaction is intentionally decorative; the QR stays the dominant element and the downloadable art is unchanged.
- The 3D QR remains artwork, not a scanning target.
- Payment and authenticator presets remain clearly labelled demos.
- Final brand copy, CTA destination, real payloads, and the original-code license remain open.

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

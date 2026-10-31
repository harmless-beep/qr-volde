# Research Notes

**Project:** QR Volde  
**Version:** v0.4.0  
**Research date:** 2026-10-27; updated 2026-10-31

This document records the references and decisions behind the v0.1 vertical slice, the v0.2 QR Atelier, the v0.3 Living Atelier, and the v0.4 Mithila Courtyard. The goal is recognition, not reconstruction. All geometry, textures, signs, characters, and Atelier motifs are original procedural work; no photos, maps, stock models, third-party visual assets, or AI-generated images were copied into the project.

## 1. Kathmandu Valley and Newar architecture

### Sources reviewed

- UNESCO World Heritage Centre — Kathmandu Valley: <https://whc.unesco.org/en/list/121/>
- Kathmandu Durbar Square (background): <https://en.wikipedia.org/wiki/Kathmandu_Durbar_Square>
- Newar architecture (background): <https://en.wikipedia.org/wiki/Newar_architecture>
- Patan Durbar Square (background): <https://en.wikipedia.org/wiki/Patan_Durbar_Square>
- Dhunge dhara / stone spouts: <https://en.wikipedia.org/wiki/Dhunge_dhara>
- Stupa (background): <https://en.wikipedia.org/wiki/Stupa>
- Prayer flags (background): <https://en.wikipedia.org/wiki/Prayer_flag>

### Visual language used

- **Tiered pagoda temple:** stacked eaves, exposed brick, timber columns, carved window rhythms, and a gold-toned finial. The chowk pagoda is a simplified original composition, not a copy of a specific temple.
- **Newari shop row:** brick and timber facades, deep window reveals, awnings, hand-painted signboards, and goods spilling into the street.
- **Chowk:** a courtyard-like block where the temple, shops, tea stall, and stone spout meet. The road ring and island edge frame the scene.
- **Dhunge dhara:** a stone water spout with a carved spout, stepped base, and water basin. It is a recognizable civic detail, treated respectfully.
- **Stupa:** a whitewashed dome, square harmika, and spire, used as a smaller neighbourhood landmark.
- **Prayer flags:** strings crossing the street and rooflines, with five-colour cloth.
- **Himalayan backdrop:** layered low-poly ridges, snow caps, haze, and flat-shaded clouds. The mountains are atmospheric scenery, not a geographic survey.
- **Street life:** people, a dog, pigeons, a bus, a scooter, utility wires, lamps, and small errands. These make the chowk feel lived-in rather than like a museum model.

### Decisions

- Keep the v0.1 city to **one detailed chowk** so the vertical slice stays legible and performant.
- Use the **QR ground pattern** as the plaza itself: the code literally becomes the place.
- Do **not** recreate sacred interiors or use sensitive imagery as decoration. The temple and stupa are exterior, neighbourhood-scale forms.
- Use **Devanagari** sparingly and correctly: `चिया` (chiya, tea) on the tea stall, `PASAL` for a shop sign, and small QR/URL labels. English remains the primary UI language.
- Keep all people abstract and low-poly; no real likenesses.

## 2. QR Code standards

### Sources reviewed

- ISO/IEC 18004:2015 — QR Code bar code symbology specification: <https://www.iso.org/standard/62021.html>
- DENSO WAVE — QR Code essentials and trademark notice: <https://www.denso-wave.com/en/technology/qrcode/>
- `qrcode-generator` by Kazuhiko Arase: <https://github.com/kazuhikoarase/qrcode-generator>
- Thonky — QR Code error correction table (background): <https://www.thonky.com/qr-code-tutorial/error-correction-table>
- jsQR — JavaScript QR decoder used for local verification: <https://github.com/cozmo/jsQR>
- Three.js documentation: <https://threejs.org/docs/>

### Implementation notes

- The flat QR is generated client-side with `qrcode-generator`. The v0.1 preview and download were 512 × 512; v0.2 renders a live Atelier preview and exports at 2048 × 2560, with a 1024 × 1024 plain fallback.
- Error correction is **H (30%)** in v0.2, up from Q (25%) in v0.1. H provides recovery room for the central seal and for print or screen imperfections while keeping the 160-character payload limit practical.
- The flat QR uses a high-contrast dark-on-cream palette and a **four-module quiet zone**.
- The 3D wall uses the **same matrix** as the flat code, so the artwork and the functional code stay in sync.
- The 3D QR is intentionally **not** a scanning target: modules are extruded, spaced, lit, and later scattered into the city. The Atelier art PNG and the plain fallback are the scannable artifacts.
- The QR Code word mark is a registered trademark of DENSO WAVE INCORPORATED. The project uses the term descriptively.

## 3. Nepalese payment QR context

### Sources reviewed

- Nepal Clearing House Ltd. (NCHL): <https://nchl.com.np/>
- NepalQR is an interoperable payment QR standard in Nepal, associated with NCHL and participating banks/wallets.

### Decisions

- No real bank, merchant, or wallet QR payload is generated or shown.
- The “Payment demo” preset is a **URL demo**, clearly labelled as a demo.
- The Studio note tells users to use their own merchant QR payload for a real payment code.
- The scene does not imply that scanning the artwork pays anyone.

## 4. Authenticator QR context

### Sources reviewed

- Google Authenticator Key URI Format: <https://github.com/google/google-authenticator/wiki/Key-Uri-Format>
- RFC 6238 — TOTP: <https://www.rfc-editor.org/rfc/rfc6238>

### Decisions

- The authenticator preset is an **educational URL**, not an `otpauth://` URI and not a TOTP secret.
- The UI warns: “Authenticator QR codes contain secrets. This demo explains the flow; never share your authenticator QR.”
- The project never asks for, collects, stores, or transmits a TOTP secret.

## 5. Accessibility and motion

### Sources reviewed

- W3C WAI — Dialog (modal) pattern: <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/>
- MDN — `prefers-reduced-motion`: <https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion>
- MDN — `<dialog>`: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog>
- Deque — Axe-core: <https://github.com/dequelabs/axe-core>

### Decisions

- Use a native `<dialog>` with `showModal()` for focus containment and Escape handling.
- Restore scroll lock and focus when the dialog closes.
- Provide a WebGL fallback that keeps QR Studio usable.
- Respect reduced motion with instant section changes, static scene props, and a Living Atelier preview with no particles, tilt, or seal/shuffle animation.
- Make the Living Atelier preview a real `<button>` with a dynamic label and an `aria-describedby` hint, so pointer, touch, and keyboard users get the same seal interaction.
- Keep touch targets at least 2rem where practical; rail controls use larger transparent hit areas.
- Provide `aria-pressed` on visual mode buttons and `aria-current` on scene rail buttons.
- Wrap the scroll hint in a complementary landmark so all base-page content sits inside a landmark.
- Lighthouse v0.4.0: 100 accessibility, 100 best practices, 100 SEO. Axe-core reported no violations with QR Studio open at desktop and mobile widths, including Mithila mode.

## 6. QR Atelier art and scannability

### Sources reviewed

- ISO/IEC 18004:2015 — module placement, finder patterns, quiet zone, and error-correction levels.
- DENSO WAVE — QR Code essentials: <https://www.denso-wave.com/en/technology/qrcode/>
- Thonky — error-correction table and module structure (background): <https://www.thonky.com/qr-code-tutorial/>
- jsQR — local decode verification at multiple output sizes: <https://github.com/cozmo/jsQR>
- WCAG 2.2 — contrast guidance for the QR panel: <https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html>

### Design decisions

- **The QR panel is the constant.** Every style uses an opaque cream paper panel with dark ink, regardless of the decorative palette. Artwork, texture, and motif geometry stay outside the panel.
- **Quiet zone:** four modules on every side, filled with the panel's paper color, so the code is not crowded by ornament.
- **Finder patterns:** the three finders keep the nested 7 / 5 / 3 silhouette. Their corners are lightly rounded, but the structure and contrast remain conventional.
- **Data modules:** rounded squares at roughly 17% corner radius. This softens the code without merging adjacent dark modules.
- **Central seal:** a paper-filled circle with an accent ring and the collector's initials or a motif glyph. It covers roughly seven modules across at the centre, a small fraction of the data area, and relies on H (30%) recovery.
- **Error correction H:** chosen so the seal, paper grain, and print variation have headroom. The payload limit stays at 160 characters so the module count remains low enough for the art panel.
- **Edition code:** a four-character FNV-1a hash of payload, style, name, caption, and, for custom pieces, palette and motif. It is deterministic and decorative. It is **not** a claim of blockchain uniqueness, ownership, or scarcity.
- **No photo upload:** personalization is limited to text, palette, and motif. This keeps the artwork original and procedural, avoids collecting personal images, and keeps the tool usable without a file picker or backend.
- **Plain fallback:** a 1024 × 1024 black-on-cream code with a four-module quiet zone, for printers and older scanners that struggle with styled modules.

### Verification

- All six sample styles and custom variants decoded with jsQR at **2048 × 2560** and at **640 × 800**.
- A 160-character payload, a one-character monogram, and long name/caption combinations decoded successfully.
- The plain 1024 × 1024 fallback decoded successfully.
- Downloaded art was inspected for finder patterns, quiet zone, opaque paper, and contrast.
- jsQR returned question marks for a Devanagari payload in the local harness. The matrix itself rendered correctly; this appears to be a decoder/UTF-8 limitation in the test harness, not an art-renderer failure. Physical-phone scanning remains the recommended final check.

## 7. Living Atelier interaction

### Sources reviewed

- MDN — Pointer events: <https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events>
- MDN — Canvas 2D API: <https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API>
- W3C WAI — Button pattern: <https://www.w3.org/WAI/ARIA/apg/patterns/button/>
- WCAG 2.2 — Animation from interactions: <https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html>
- MDN — `prefers-reduced-motion`: <https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion>

### Design decisions

- **The QR stays the hero.** The interaction lives on a separate 640 x 800 overlay canvas above the art canvas. It cannot alter the exported PNG.
- **Exclusion rectangle.** `renderQRArt` returns the panel rectangle. The overlay clears that rectangle every frame with a small pad, so particles and glow never sit over data modules.
- **Edge projection.** When the pointer is over the QR panel, the effect point is projected to the nearest panel edge. The user still sees feedback, and the code stays untouched.
- **Playful, not noisy.** Gold dust is capped at 220 particles. Trail particles are small circles or four-point stars; the seal adds two rings, a soft flash, and a 42-particle burst.
- **Gentle tilt.** The card leans at most 3° toward the pointer. Touch pointers do not tilt, so tapping stays stable on mobile.
- **Seal ceremony.** Click, tap, Enter, and Space all call the same seal path. The hint cycles through four lines and includes the style short name and deterministic edition code.
- **Surprise me.** When Custom Atelier is active, the randomizer keeps it about half the time and chooses a different palette and motif; otherwise it picks a different sample style. This keeps the custom work from being erased by every roll.
- **Reduced motion.** The media query disables particles, tilt, shuffle, and seal animations. The hint still changes, so the ceremony remains legible without motion.
- **No new dependencies.** The overlay is plain Canvas 2D and pointer events. No animation library, audio, haptics, or paid API is used.

### Verification

- Overlay sampling with the pointer over the QR panel: **0** non-transparent pixels inside the QR rectangle, **5,176** outside it.
- Pointer leave resets tilt to `0deg`; Enter and Space both seal; touch tap seals on a 390 x 844 viewport.
- Export canvas data URL was identical before and after pointer movement and sealing.
- **Surprise me** kept Custom active 17 of 36 tries and produced 10 distinct palette/motif combinations.
- Reduced motion: **0** overlay pixels, `transform: none` on the tilt layer, no seal/shuffle animation, and the hint still updates.
- All six sample styles plus custom variants decoded at 2048 x 2560 and 640 x 800; the plain 1024 x 1024 fallback decoded.
- Lighthouse v0.4.0: 100 accessibility, 100 best practices, 100 SEO for the app and launch page. Axe-core: no violations with the Studio open at desktop and mobile widths.

## 8. Janakpur and Mithila

### Sources reviewed

- UNESCO World Heritage Centre — Ram Janaki Temple tentative list: <https://whc.unesco.org/en/tentativelists/5261/>
- Janaki Mandir (background): <https://en.wikipedia.org/wiki/Janaki_Mandir>
- Janakpur (background): <https://en.wikipedia.org/wiki/Janakpur>
- Mithila region (background): <https://en.wikipedia.org/wiki/Mithila_(region)>
- Madhubani / Mithila art (background): <https://en.wikipedia.org/wiki/Madhubani_art>
- Nepal Tourism Board — Mithila Art: <https://ntb.gov.np/mithila-art>
- Mithila painting symbols and styles (background): Bharni, Kachni, Tantrik, Godna, and Kohbar traditions; fish, lotus, bamboo, parrot, sun, and moon motifs; double-line borders and dense fill.
- Aripana / Aripan ritual floor art (background): rice-paste line drawing in Mithila courtyards, related to rangoli and kolam traditions.

### Visual language used

- **White domed temple:** a bright white three-storey massing with a central dome, corner chhatris, arched openings, lattice jaali screens, turrets, and a gold finial. It is an original composition inspired by the Janaki Mandir's white stone, domes, and arches, not a replica.
- **Painted houses:** mud-plaster walls with Mithila-style line painting, double borders, fish, lotus, bamboo, parrots, and sun motifs. Roofs are low-pitched tile or thatch, distinct from the Newari tiered pagoda.
- **Painting pavilion:** an open courtyard pavilion with painted panels, a low worktable, and seated painters, suggesting Mithila art as a living practice rather than a museum object.
- **Sacred pond and ghats:** stepped stone ghats, teal water, lotus, floating oil lamps, and herons. Janakpur is known for its ponds and ghats, and the pond gives the new camera flight its leftward destination.
- **Tulsi shrine:** a small raised courtyard shrine, a common domestic and devotional detail.
- **Groves and festival life:** mango and banana trees, a cart, an elephant, a bovine, residents in sari and dhoti with bun and tika, and kites in the dusk sky.
- **Aripana:** a circular floor painting built from original Canvas 2D line work — concentric rings, petals, dots, and a lotus centre — placed just above the QR plaza.
- **Palette:** warm Terai dusk, pale hazy mountains at the plains' edge, a deep-plum QR floor, white temple stone, terracotta red, marigold yellow, and teal water.

### Decisions

- **A different place, not a recolour.** Mithila has its own scene group (`mithila`), its own props, and its own leftward camera rig. Dawn, Neon, and Gallery keep the Newari chowk and its rightward orbit.
- **The QR stays the plaza.** The code remains the ground pattern; the aripana sits above the raised modules so the QR and the courtyard ornament stay visible together.
- **No sacred interior.** The temple is exterior and neighbourhood-scale. The scene does not recreate a shrine interior or use sensitive imagery as decoration.
- **Original motifs only.** The painting panels and aripana are procedural line art drawn from general Mithila visual vocabulary. No scanned, photographed, or AI-generated Mithila artwork is used, and the project does not claim to reproduce a specific artist's work.
- **Cultural interpretation, not a survey.** The courtyard is a Janakpur-inspired composition. It is not a geographic reconstruction, and the temple is not a measured model of the Janaki Mandir.
- **English UI, local accents.** Interface copy stays English; `Mithila` and `Janakpur` name the place and tradition without pretending to be a language lesson.

## 9. Asset and originality statement

- All 3D geometry is generated in JavaScript with Three.js primitives and original code.
- All textures are generated procedurally or with Canvas 2D (QR, signs, labels, glow sprites, Atelier paper, motifs, and plinths).
- No external images, photography, maps, fonts, models, or stock assets are loaded.
- No AI image/video generation was used.
- No paid APIs, credits, or generation services were used.
- Third-party software is limited to Three.js and `qrcode-generator`; see [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).

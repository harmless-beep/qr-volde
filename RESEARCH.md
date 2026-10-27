# Research Notes

**Project:** QR Volde  
**Version:** v0.1.0  
**Research date:** 2026-10-27

This document records the references and decisions behind the v0.1 vertical slice. The goal was recognition, not reconstruction. All geometry, textures, signs, and characters are original procedural work; no photos, maps, stock models, or third-party visual assets were copied into the scene.

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
- Three.js documentation: <https://threejs.org/docs/>

### Implementation notes

- The flat QR is generated client-side with `qrcode-generator` and rendered to a 512 × 512 canvas.
- Error correction is **Q (25%)**, a practical balance for screens, screenshots, and angled scans.
- The flat QR uses a high-contrast dark-on-cream palette and a **four-module quiet zone**.
- The 3D wall uses the **same matrix** as the flat code, so the artwork and the functional code stay in sync.
- The 3D QR is intentionally **not** a scanning target: modules are extruded, spaced, lit, and later scattered into the city. The Studio preview and PNG are the scannable artifacts.
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

### Decisions

- Use a native `<dialog>` with `showModal()` for focus containment and Escape handling.
- Restore scroll lock and focus when the dialog closes.
- Provide a WebGL fallback that keeps QR Studio usable.
- Respect reduced motion with instant section changes and static scene props.
- Keep touch targets at least 2rem where practical; rail controls use larger transparent hit areas.
- Provide `aria-pressed` on visual mode buttons and `aria-current` on scene rail buttons.
- Lighthouse v0.1.0: 100 accessibility, 100 best practices, 100 SEO.

## 6. Asset and originality statement

- All 3D geometry is generated in JavaScript with Three.js primitives and original code.
- All textures are generated procedurally or with Canvas 2D (QR, signs, labels, glow sprites).
- No external images, photography, maps, fonts, models, or stock assets are loaded.
- No AI image/video generation was used.
- No paid APIs, credits, or generation services were used.
- Third-party software is limited to Three.js and `qrcode-generator`; see [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).

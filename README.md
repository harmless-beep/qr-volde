# QR Volde

A giant 3D QR code that unfolds into a living Himalayan chowk as you scroll.

**v0.1.0 — vertical slice.** The code is the door. The city is what it opens into.

Live demo: <https://harmless-beep.github.io/qr-volde/> (GitHub Pages).

## What this is

QR Volde is a scroll-scrubbed 3D landing page. A dark-square QR monolith faces you, then breaks apart into a Kathmandu-style courtyard: a tiered pagoda, a shop row, a tea stall, a stone spout, a stupa, prayer flags, trees, people, a bus, a scooter, and the Himalayas behind it.

The 3D code is the artwork. The flat QR in **QR Studio** is the scannable code.

## The four scenes

1. **The Signal** — the QR monolith. Every square is a door.
2. **The Unfold** — the modules lift and fly into the plaza.
3. **The Chowk** — the city assembles: Newari roofs, brick, timber, tea steam, and small errands.
4. **The Studio** — make a QR for a link, video, payment demo, or app.

## Visual modes

- **Himalayan Dawn** — warm cream, terracotta, brick, and pale mountain haze.
- **Neon Kathmandu** — midnight blue, cyan modules, magenta signage, and wet-street glow.
- **Minimal Gallery** — chalk, stone, charcoal, and a single teal accent.

The mode persists in `localStorage` under `qrvolde-mode`. The QR Studio preview stays high-contrast black-on-cream in every mode.

## QR Studio

- Client-side QR generation. No backend, no analytics, no uploads.
- Default payload: `https://example.com/qr-volde` (demo only).
- Presets: **Website** (also works for Google Sites), **Video**, **Payment demo**, **Authenticator**.
- **Use in world** updates the 3D matrix and ground pattern.
- **Download PNG** exports a 512 × 512 high-contrast QR with a four-module quiet zone.
- Error correction: **Q (25%)**. UTF-8 / Devanagari input supported.
- Max input: 160 characters. Longer inputs are rejected so the 3D code stays readable.

**Safety notes:** the payment preset is a URL demo, not a real bank or merchant QR. The authenticator preset is an educational link, not a TOTP secret. Never share an authenticator QR. Use your own payload for a real payment code.

## Run locally

Requires Python 3 for the tiny static server, or any static file server.

```sh
npm run serve
# open http://127.0.0.1:4180/
```

Syntax check:

```sh
npm run check
```

No build step. No npm install. No paid APIs, credits, stock assets, or AI generation.

## Tech

- Three.js **r186**, vendored (`vendor/three.module.js`, `vendor/three.core.js`).
- `qrcode-generator` **2.0.4** + UTF-8 helper, vendored (MIT).
- Vanilla ES modules, CSS custom properties, Canvas 2D, WebGL.
- One continuous camera flight with section-weighted scroll mapping.
- Procedural geometry only. No image textures, photos, maps, or font files.
- WebGL fallback keeps QR Studio usable.
- Reduced-motion support: instant section changes and static scene props.
- Lighthouse: **100 accessibility, 100 best practices, 100 SEO** (local audit, v0.1.0).

## Known limits

- The 3D QR is deliberately an artwork; use the flat QR in the Studio to scan.
- The chowk is a Kathmandu-inspired composition, not a survey-accurate reconstruction.
- No real payment, bank, merchant, or authenticator payloads are included.
- No routing, backend, accounts, analytics, or QR history.
- The final CTA destination and brand tagline are still open for approval.
- The city is one detailed block in v0.1; more districts are planned.

## Roadmap

- **v0.1** — Signal vertical slice: QR monolith, unfold, chowk, Studio.
- **v0.2** — City: more streets, depth, and life.
- **v0.3** — Districts: switchable neighbourhoods and landmarks.
- **v0.4** — Launch: final brand copy, CTA destination, real demo payloads.
- **v1.0** — Stable release.

## Credits

Original code, procedural geometry, copy, and art direction: QR Volde project, 2026.

Third-party notices and the MIT license text: [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).

Research notes and references: [`RESEARCH.md`](./RESEARCH.md).

## License

Original QR Volde code and procedural art: license TBD. Third-party components remain under their respective MIT licenses; see [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).

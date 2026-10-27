# Hyperframes Composition Brief: QR Volde

## Objective

Create a short, polished launch film for QR Volde: a 3D QR code that unfolds into a living Kathmandu chowk and then lets the viewer make a scannable QR of their own.

## Output

- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 20.0 seconds
- FPS: 30

## Source Material

- Project root: `C:\Users\kroas\Documents\Default Project\qr-volde`
- Primary files read: `index.html`, `styles.css`, `README.md`, `world.js`, `scene.js`, `scene-qr.js`, `scene-city.js`, `city-buildings.js`, `city-life.js`
- Product name: QR Volde
- Tagline / strongest claim: **Every square is a door.**
- Key UI or visual moment to recreate: the real app scroll from the QR monolith to the Kathmandu chowk, captured as `assets/scroll.mp4`; the real QR Studio dialog captured as `assets/qr-studio.png`.
- Copy that must appear verbatim:
  - Every square is a door.
  - A QR code that becomes a living Kathmandu chowk.
  - Kathmandu, in code.
  - Every square becomes a place.
  - Make your own.
  - Any link. Any story. A scannable code in seconds.
  - Create your QR.
  - harmless-beep.github.io/qr-volde
  - FREE · CLIENT-SIDE · NO BACKEND

## Creative Direction

- Tone preset: polished
- Creative direction: quiet premium product film with a touch of wonder
- Interpretation: restraint, long holds, editorial typography, soft transitions, and a single continuous camera move. The world is the spectacle; the copy is calm and specific.
- Angle: the QR is not a utility graphic, it is architecture. Show the actual transformation, then show the real tool.
- Hook: the giant QR wall and **"Every square is a door."**
- Outro / punchline: the wide chowk, the wordmark, the URL, and **"Create your QR."**
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign
  - Fake UI or invented product claims
  - Hyperactive text animation

## Visual Identity

- Background: `#f4e6d2`
- Deep background: `#e6cfb1`
- Text: `#241f1a`
- Muted text: `#6e5a47`
- Accent: `#c96f4a`
- Secondary accent: `#2f6f6a`
- Display font: EB Garamond
- Body font: Inter
- Visual references from the project:
  - giant black QR modules on warm cream
  - terracotta QR frame
  - tiered Newari pagoda
  - shop row, tea stall, dhara, stupa
  - prayer flags, trees, bus, scooter, people, one small dog
  - Himalayan peaks and warm haze
  - QR Studio's cream panel and black-on-cream scannable QR preview
  - site copy card with eyebrow, serif headline, body, tags, and dark pill CTA

## Storyboard

Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:

1. **The Signal** — 4.6s — the real QR wall footage on the right; editorial copy on the left; the camera starts to move.
2. **The Chowk** — 6.0s — the QR unfolds into the actual city; copy and four specific detail tags; keep scrolling.
3. **QR Studio** — 5.2s — the real Studio screenshot as a card over the final city plate; **Make your own.**; CTA.
4. **The Door** — 4.2s — wordmark, tagline, URL, CTA, and a quiet fade.

## Audio

- Audio role: warm bed / sparse professional accents
- Audio arc: warm and curious → open and airy → tool-focused lift → resolved fade
- Music: `assets/music/happy-beats-business-moves-vol-10.mp3`
- Music treatment: start at 0.0, fade in over 0.4s, sit under the copy, fade out 19.1–20.0
- Music cue guidance: track tempo ≈110 BPM; strong cue at **18.55s** for the final CTA/wordmark; cut points near **4.6s**, **10.6s**, **15.8s**
- Audio-reactive treatment: subtle; warm the final city plate with a barely perceptible glow, not waveform graphics
- Audio-coupled moments:
  - QR-to-city camera move — soft whoosh
  - Studio card arrival — quiet click
  - final CTA/wordmark — soft sparkle or low chime
- SFX selection guidance: use short, low-risk sounds from the Hyperframes media-use set; keep them under the music; do not add a hit on every text line.
- SFX analysis guidance: `C:\Users\kroas\AppData\Local\Temp\opencode\hyperframes\skills\media-use\audio\assets\sfx\manifest.json` if available; exact filenames, timestamps, density, and volume are Hyperframes' choice.
- Audio files: copy chosen music and SFX into `brag-output/composition/assets/`

## Hyperframes Instructions

Load the composition-building Hyperframes skills — `hyperframes` (composition contract + `data-*` timing, `references/format.md`; motion, eases and seek-safe keyframes in `references/motion.md`; look in `references/look.md`), `hyperframes-registry` (ready-made effects, transitions, titles), `media-use` (music, SFX, audio-reactive data), and `hyperframes-cli` (lint/check/render). /brag is its own workflow: skip the `hyperframes` storyline step; don't read `references/types/*` or `references/story.md`, don't propose storylines, and don't write a `SPEC.md`. The brag plan and composition brief replace them, including the LOOK line `references/look.md` asks for. Also skip its `usage`, `history`, `feedback` and REVIEW.md steps; `check` is brag's gate. Do not route into its generic launch-video workflow.

Requirements:

- Show the real app footage and the real QR Studio screenshot; do not rebuild the 3D world.
- Keep all text readable in the final render; the video is 20 seconds, so do not overpack the left column.
- Keep the video within 15–25 seconds.
- Include the planned music/SFX layer.
- Use the project's exact palette and typography feel.
- Treat music cue metadata as optional timing hints; readability and story first.
- Use local assets; no network fetches.
- Run `npx hyperframes check` before render.
- Keep creation and rendering local.

## Composition notes

- The source footage is 1600x900, upscaled to 1920x1080. Keep the frame full-bleed; do not letterbox.
- The QR wall sits on the right in the first scene; the copy belongs on the left.
- The city sits on the right in the second scene; leave room for copy on the left.
- The final city plate is deliberately wide and calm; use it as a stage for the wordmark, not as a busy background.
- The QR Studio screenshot is cropped from the real dialog; it should read as a product artifact with a soft shadow and rounded corners.
- Avoid visible UI chrome from the live site (top bar, rail, copy card); the capture is clean 3D only.
- The final frame should be postable as a still.

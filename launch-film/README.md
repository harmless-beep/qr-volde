# QR Volde launch film

A 20-second, 1920x1080 launch film for QR Volde, built from real captures of the app and rendered with [HyperFrames](https://hyperframes.heygen.com).

- **Film:** [`launch-film.mp4`](./launch-film.mp4) — 20.0s, 1920x1080, 30 fps, H.264/AAC
- **Animated preview:** [`launch-film.gif`](./launch-film.gif) — 20.0s, 720x405, 10 fps, loops in the GitHub README
- **Poster:** [`launch-film-poster.jpg`](./launch-film-poster.jpg)
- **Launch page:** <https://harmless-beep.github.io/qr-volde/launch.html>
- **Share copy:** [`share-copy.md`](./share-copy.md)
- **Plan:** [`launch-plan.md`](./launch-plan.md)
- **Composition brief:** [`composition-brief.md`](./composition-brief.md)
- **Editable composition:** [`composition/index.html`](./composition/index.html)

## What is real in the film

- The QR-to-chowk camera move is a real capture of the QR Volde app, not a recreation. The source capture is 1600x900 and is upscaled to 1920x1080 in the composition.
- The QR Studio card is a real element screenshot of the Studio dialog, including the scannable QR preview and the **Download PNG** action.
- The copy, palette, type feel, and product claims come from the project. No fake UI or invented features.

## Rebuild

```bash
cd launch-film/composition
npx hyperframes check
npx hyperframes render -o ../launch-film.mp4 --fps 30 --quality looks --video-frame-format png --workers 2
```

`check` currently reports **0 errors**. It also reports four non-blocking `nested_structure_needs_subcomposition` warnings because the four scenes are kept in one root composition for a single GSAP timeline. The composition is intentionally one file; the warnings are structural hints, not render failures.

## Source assets

| Asset | Source |
|---|---|
| `composition/assets/scroll.mp4` | Real app capture, 1600x900, 12s, upscaled in the composition. |
| `composition/assets/final-city.png` | Last frame of the real scroll capture. |
| `composition/assets/qr-studio-panel.png` | Real QR Studio dialog element screenshot. |
| `composition/assets/music/happy-beats-business-moves-vol-10.mp3` | Sascha Ende, ende.app — CC BY 4.0. |
| `composition/assets/music/whoosh-short.mp3` | HyperFrames media-use SFX, Pixabay Content License. |
| `composition/assets/music/click-soft.mp3` | HyperFrames media-use SFX, Pixabay Content License. |
| `composition/assets/music/sparkle.mp3` | HyperFrames media-use SFX, Pixabay Content License. |
| `composition/assets/gsap.min.js` | GSAP 3.14.2, GSAP Standard License. |

## Credits

- Music: **Sascha Ende**, [ende.app](https://ende.app/en), “Happy Beats / Business Moves, Vol. 10” — [CC BY 4.0](https://ende.app/en/standard-license).
- Sound effects: [Pixabay Content License](https://pixabay.com/service/license-summary/), via HyperFrames media-use.
- Film render: [HyperFrames](https://hyperframes.heygen.com) (Apache-2.0).
- Original app footage, geometry, copy, and art direction: QR Volde, 2026.

No paid APIs, voiceover, stock footage, or cloud render were used.

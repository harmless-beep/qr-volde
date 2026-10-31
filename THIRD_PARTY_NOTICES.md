# Third-Party Notices

QR Volde v0.3.0 includes the following third-party software. The original QR Volde code, procedural art, and QR Atelier motifs are separate from these components. v0.3.0 adds no new runtime dependencies.

## Three.js r186

- Files: `vendor/three.module.js`, `vendor/three.core.js`
- Project: <https://threejs.org/>
- Source: <https://github.com/mrdoob/three.js>
- License: MIT
- Copyright: Copyright 2010–2026 Three.js Authors
- SPDX identifier: `MIT`

The vendored files retain their upstream `@license` header and SPDX identifier.

## qrcode-generator 2.0.4

- Files: `vendor/qrcode.mjs`
- Project: <https://github.com/kazuhikoarase/qrcode-generator>
- License: MIT
- Copyright: Copyright (c) 2009 Kazuhiko Arase

## qrcode-generator UTF-8 helper

- Files: `vendor/qrcode_UTF8.mjs`
- Project: <https://github.com/kazuhikoarase/qrcode-generator>
- License: MIT
- Copyright: Copyright (c) 2011 Kazuhiko Arase

The UTF-8 helper is used to keep Devanagari and other non-Latin QR payloads intact.

## QR Code trademark

“QR Code” is a registered trademark of DENSO WAVE INCORPORATED.

- <https://www.denso-wave.com/en/technology/qrcode/>

The project uses the term descriptively. No endorsement by DENSO WAVE is implied.

## MIT License text

The following MIT license text applies to the third-party components listed above.

```text
MIT License

Copyright (c) 2010-2026 Three.js Authors
Copyright (c) 2009 Kazuhiko Arase
Copyright (c) 2011 Kazuhiko Arase

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Launch film assets

The launch film and its editable composition are under `launch-film/`. They are separate from the QR Volde app runtime.

- **Music:** “Happy Beats / Business Moves, Vol. 10” by Sascha Ende, [ende.app](https://ende.app/en), licensed under [CC BY 4.0](https://ende.app/en/standard-license). Credit: “Music: Sascha Ende, ende.app (CC BY 4.0).”
- **Sound effects:** `whoosh-short.mp3`, `click-soft.mp3`, and `sparkle.mp3` from the HyperFrames media-use library, under the [Pixabay Content License](https://pixabay.com/service/license-summary/).
- **Fonts in the film:** Inter, EB Garamond, and IBM Plex Mono, under the SIL Open Font License 1.1. They are loaded by HyperFrames for the composition and are not used by the QR Volde app runtime.
- **GSAP 3.14.2:** `launch-film/composition/assets/gsap.min.js`, Copyright GreenSock. Used under the [GSAP Standard License](https://gsap.com/standard-license). A copy of the upstream notice is included at `launch-film/composition/assets/GSAP-NOTICE.txt`.
- **HyperFrames 0.8.208:** [hyperframes.heygen.com](https://hyperframes.heygen.com), Apache-2.0. Used to render the film locally.

## Other assets

- All other 3D geometry, Canvas 2D textures, signs, copy, and art direction are original to this project.
- The QR Volde app itself includes no stock images, photography, maps, 3D models, external fonts, or AI-generated assets.
- The app and launch page use system font stacks only; the launch film uses the licensed fonts listed above.
- The launch film contains real captures of the project’s own UI and 3D scene. It does not contain stock footage.

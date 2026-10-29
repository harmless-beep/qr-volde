import { createQR, drawQR, downloadCanvas, QR_DEFAULT } from './qr.js';
import {
  ART_MOTIFS,
  ART_PALETTES,
  ART_STYLES,
  DEFAULT_ART_OPTIONS,
  artFileName,
  renderQRArt,
} from './qr-art.js';
import { initScene, sectionAt, sectionStart } from './scene.js';
import { clamp } from './scene-world.js';

const SECTIONS = [
  {
    id: 'signal',
    label: 'Signal',
    eyebrow: '01 · The Signal',
    title: 'Every square is a door.',
    body: 'A QR is a small city of decisions. One scan can open a website, a film, a payment, or a whole life.',
    tags: ['Web', 'Video', 'Pay'],
  },
  {
    id: 'unfold',
    label: 'Unfold',
    eyebrow: '02 · The Unfold',
    title: 'The code becomes a street.',
    body: 'Each dark square is a doorway. Scroll, and the plan lifts into a living block of brick, timber, and tea steam.',
    tags: ['Plan', 'Place'],
  },
  {
    id: 'chowk',
    label: 'Chowk',
    eyebrow: '03 · The Chowk',
    title: 'A chowk at dawn.',
    body: 'Pagoda eaves, prayer flags, a stone spout, and a hundred small errands. This is what a code can open into.',
    tags: ['Newari', 'Himalayan'],
  },
  {
    id: 'studio',
    label: 'Studio',
    eyebrow: '04 · The Studio',
    title: 'Make your own way in.',
    body: 'Turn a link, a video, a payment demo, or an app into a QR. The city is the showcase; the code is the key.',
    tags: ['Free', 'Client-side'],
    cta: true,
  },
];

const MODE_THEME = {
  dawn: '#f4e6d2',
  neon: '#070b16',
  minimal: '#f3f0e9',
};

const PRESETS = {
  web: {
    value: 'https://example.com/qr-volde',
    note: 'A demo link. Works for websites, Google Sites, and any URL.',
  },
  video: {
    value: 'https://example.com/qr-volde/video',
    note: 'Paste a video URL. This demo points to a placeholder.',
  },
  pay: {
    value: 'https://example.com/qr-volde/pay-demo',
    note: 'Demo only — not a real payment code. Use your own merchant QR payload for a real payment.',
  },
  auth: {
    value: 'https://example.com/qr-volde/authenticator-guide',
    note: 'Authenticator QR codes contain secrets. This demo explains the flow; never share your authenticator QR.',
  },
};

const canvas = document.getElementById('world');
const fallback = document.getElementById('fallback');
const copy = document.getElementById('copy');
const eyebrow = document.getElementById('eyebrow');
const title = document.getElementById('title');
const body = document.getElementById('body');
const tags = document.getElementById('tags');
const cta = document.getElementById('cta');
const rail = document.getElementById('rail');
const progressBar = document.getElementById('progress');
const hint = document.getElementById('hint');
const modeWash = document.getElementById('mode-wash');
const modeButtons = [...document.querySelectorAll('.qv__mode')];
const openStudioButton = document.getElementById('open-studio');

const studio = document.getElementById('studio');
const closeStudioButton = document.getElementById('close-studio');
const qrInput = document.getElementById('qr-input');
const qrCanvas = document.getElementById('qr-canvas');
const qrNote = document.getElementById('qr-note');
const qrNameInput = document.getElementById('qr-name');
const qrCaptionInput = document.getElementById('qr-caption');
const qrStyleList = document.getElementById('qr-styles');
const qrStyleName = document.getElementById('qr-style-name');
const qrCustomPanel = document.getElementById('qr-custom');
const qrPaletteList = document.getElementById('qr-palettes');
const qrMotifList = document.getElementById('qr-motifs');
const presetButtons = [...document.querySelectorAll('.studio__preset')];
const applyQrButton = document.getElementById('apply-qr');
const downloadQrButton = document.getElementById('download-qr');
const downloadPlainButton = document.getElementById('download-plain');

let sceneAPI = null;
let currentQR = null;
let previewQR = null;
let currentMode = 'dawn';
let lastSection = -1;
let lastFocus = null;
let previewTimer = null;
let artTimer = null;
let styleButtons = [];
let paletteButtons = [];
let motifButtons = [];
let artStyleId = DEFAULT_ART_OPTIONS.styleId;
let artName = DEFAULT_ART_OPTIONS.name;
let artCaption = DEFAULT_ART_OPTIONS.caption;
let customPaletteId = DEFAULT_ART_OPTIONS.paletteId;
let customMotifId = DEFAULT_ART_OPTIONS.motifId;
let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const startTime = performance.now();
let lastFrame = startTime;
let targetProgress = 0;
let smoothProgress = 0;
let maxScroll = 1;
let frozen = false;

const railButtons = [];

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

function getMaxScroll() {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

function readProgress() {
  return clamp(window.scrollY / getMaxScroll(), 0, 1);
}

function savedMode() {
  try {
    const value = window.localStorage.getItem('qrvolde-mode');
    return ['dawn', 'neon', 'minimal'].includes(value) ? value : 'dawn';
  } catch {
    return 'dawn';
  }
}

function storeMode(mode) {
  try {
    window.localStorage.setItem('qrvolde-mode', mode);
  } catch {
    // The world still works when storage is unavailable.
  }
}

function setMetaTheme(mode) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', MODE_THEME[mode] ?? MODE_THEME.dawn);
}

function setMode(mode, options = {}) {
  if (!MODE_THEME[mode]) return;
  currentMode = mode;
  document.documentElement.dataset.mode = mode;
  setMetaTheme(mode);
  for (const button of modeButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  }
  if (sceneAPI) sceneAPI.setMode(mode);
  if (options.persist !== false) storeMode(mode);

  if (modeWash) {
    modeWash.classList.add('is-washing');
    window.setTimeout(() => modeWash.classList.remove('is-washing'), 100);
  }
}

function buildRail() {
  for (let index = 0; index < SECTIONS.length; index += 1) {
    const section = SECTIONS[index];
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Go to ${section.label}`);
    button.innerHTML = `<span class="qv__rail-dot" aria-hidden="true"></span><span class="qv__rail-label">${section.label}</span>`;
    button.addEventListener('click', () => {
      const fraction = sectionStart(index) + 0.01;
      window.scrollTo({
        top: fraction * getMaxScroll(),
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    });
    rail.append(button);
    railButtons.push(button);
  }
}

function renderSection(index, animate = true) {
  const section = SECTIONS[index];
  if (!section) return;

  eyebrow.textContent = section.eyebrow;
  title.textContent = section.title;
  body.textContent = section.body;
  tags.replaceChildren(
    ...section.tags.map((tag) => {
      const item = document.createElement('li');
      item.textContent = tag;
      return item;
    }),
  );
  cta.hidden = !section.cta;

  for (let i = 0; i < railButtons.length; i += 1) {
    railButtons[i].setAttribute('aria-current', i === index ? 'step' : 'false');
  }

  if (animate && !reduceMotion && copy.animate) {
    copy.getAnimations().forEach((animation) => animation.cancel());
    copy.animate(
      [
        { opacity: 0.35, transform: 'translateY(8px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 360, easing: 'cubic-bezier(.2,.7,.2,1)' },
    );
  }

  lastSection = index;
}

function updateUI(progress) {
  const { index } = sectionAt(progress);
  if (index !== lastSection) renderSection(index);
  if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
  if (hint) hint.classList.toggle('is-hidden', progress > 0.015);
}

function drawQrPlaceholder(message) {
  const context = qrCanvas.getContext('2d');
  if (!context) return;
  context.save();
  context.fillStyle = '#fffdf8';
  context.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
  context.fillStyle = '#8f2f25';
  context.font = '600 26px "Segoe UI", sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(message, qrCanvas.width / 2, qrCanvas.height / 2);
  context.restore();
}

function setPresetState(value) {
  for (const button of presetButtons) {
    const preset = PRESETS[button.dataset.preset];
    button.classList.toggle('is-active', preset?.value === value);
  }
}

function getArtOptions(overrides = {}) {
  return {
    styleId: artStyleId,
    name: artName,
    caption: artCaption,
    paletteId: customPaletteId,
    motifId: customMotifId,
    text: previewQR?.text ?? qrInput.value,
    ...overrides,
  };
}

function persistArtState() {
  try {
    window.localStorage.setItem('qrvolde-art', JSON.stringify({
      styleId: artStyleId,
      name: artName,
      caption: artCaption,
      paletteId: customPaletteId,
      motifId: customMotifId,
    }));
  } catch {
    // Private browsing or storage limits should never break the Studio.
  }
}

function loadArtState() {
  try {
    const saved = JSON.parse(window.localStorage.getItem('qrvolde-art') ?? 'null');
    if (!saved || typeof saved !== 'object') return;
    if (ART_STYLES.some((style) => style.id === saved.styleId)) artStyleId = saved.styleId;
    if (typeof saved.name === 'string') artName = saved.name.slice(0, 24);
    if (typeof saved.caption === 'string') artCaption = saved.caption.slice(0, 36);
    if (ART_PALETTES.some((palette) => palette.id === saved.paletteId)) customPaletteId = saved.paletteId;
    if (ART_MOTIFS.some((motif) => motif.id === saved.motifId)) customMotifId = saved.motifId;
  } catch {
    // Ignore malformed local preferences.
  }
}

function refreshArtPreview() {
  if (!previewQR) return;
  renderQRArt(qrCanvas, previewQR.qr, getArtOptions());
}

function renderStyleThumbs() {
  if (!previewQR) return;
  for (const item of styleButtons) {
    renderQRArt(item.canvas, previewQR.qr, getArtOptions({
      styleId: item.style.id,
      compact: true,
    }));
  }
}

function clearStyleThumbs() {
  for (const item of styleButtons) {
    const context = item.canvas.getContext('2d');
    if (!context) continue;
    context.save();
    context.fillStyle = item.style.palette.bg;
    context.fillRect(0, 0, item.canvas.width, item.canvas.height);
    context.fillStyle = item.style.palette.accent;
    context.font = '600 22px "Segoe UI", sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('—', item.canvas.width / 2, item.canvas.height / 2);
    context.restore();
  }
}

function updateArtControls() {
  const selected = ART_STYLES.find((style) => style.id === artStyleId) ?? ART_STYLES[0];
  qrStyleName.textContent = selected.name;
  qrCustomPanel.hidden = selected.id !== 'custom';

  for (const item of styleButtons) {
    const active = item.style.id === selected.id;
    item.button.classList.toggle('is-active', active);
    item.button.setAttribute('aria-pressed', String(active));
  }
  for (const item of paletteButtons) {
    const active = item.palette.id === customPaletteId;
    item.button.classList.toggle('is-active', active);
    item.button.setAttribute('aria-pressed', String(active));
  }
  for (const item of motifButtons) {
    const active = item.motif.id === customMotifId;
    item.button.classList.toggle('is-active', active);
    item.button.setAttribute('aria-pressed', String(active));
  }
}

function setArtStyle(styleId) {
  if (!ART_STYLES.some((style) => style.id === styleId)) return;
  artStyleId = styleId;
  updateArtControls();
  refreshArtPreview();
  persistArtState();
}

function setCustomPalette(paletteId) {
  if (!ART_PALETTES.some((palette) => palette.id === paletteId)) return;
  customPaletteId = paletteId;
  updateArtControls();
  refreshArtPreview();
  renderStyleThumbs();
  persistArtState();
}

function setCustomMotif(motifId) {
  if (!ART_MOTIFS.some((motif) => motif.id === motifId)) return;
  customMotifId = motifId;
  updateArtControls();
  refreshArtPreview();
  renderStyleThumbs();
  persistArtState();
}

function buildArtControls() {
  styleButtons = ART_STYLES.map((style) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'studio__style';
    button.dataset.style = style.id;
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `${style.name}: ${style.blurb}`);
    button.title = style.blurb;

    const canvas = document.createElement('canvas');
    canvas.width = 144;
    canvas.height = 180;
    canvas.className = 'studio__style-thumb';
    canvas.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'studio__style-label';
    label.textContent = style.name;

    button.append(canvas, label);
    button.addEventListener('click', () => setArtStyle(style.id));
    qrStyleList.append(button);
    return { button, canvas, style };
  });

  paletteButtons = ART_PALETTES.map((palette) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'studio__swatch';
    button.dataset.palette = palette.id;
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `${palette.name} palette`);
    button.title = palette.name;

    const chip = document.createElement('span');
    chip.className = 'studio__swatch-chip';
    chip.style.background = `linear-gradient(135deg, ${palette.palette.bg} 0 38%, ${palette.palette.accent} 38% 64%, ${palette.palette.accent2} 64%)`;
    chip.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'studio__swatch-label';
    label.textContent = palette.name;

    button.append(chip, label);
    button.addEventListener('click', () => setCustomPalette(palette.id));
    qrPaletteList.append(button);
    return { button, palette };
  });

  motifButtons = ART_MOTIFS.map((motif) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'studio__motif';
    button.dataset.motif = motif.id;
    button.setAttribute('aria-pressed', 'false');
    button.textContent = motif.name;
    button.addEventListener('click', () => setCustomMotif(motif.id));
    qrMotifList.append(button);
    return { button, motif };
  });

  updateArtControls();
}

function updatePreview(text, options = {}) {
  try {
    const result = createQR(text);
    previewQR = result;
    refreshArtPreview();
    renderStyleThumbs();
    qrNote.classList.remove('is-error');
    qrNote.textContent = options.note ?? 'This code is generated locally. Nothing leaves your browser.';
    applyQrButton.disabled = false;
    downloadQrButton.disabled = false;
    downloadPlainButton.disabled = false;
    setPresetState(result.text);
    return result;
  } catch (error) {
    previewQR = null;
    drawQrPlaceholder('Check the input');
    clearStyleThumbs();
    qrNote.classList.add('is-error');
    qrNote.textContent = error instanceof Error ? error.message : 'Could not build that QR.';
    applyQrButton.disabled = true;
    downloadQrButton.disabled = true;
    downloadPlainButton.disabled = true;
    setPresetState(null);
    return null;
  }
}

function ensureCurrentPreview() {
  const value = qrInput.value;
  if (previewQR && previewQR.text === value.trim()) return previewQR;
  return updatePreview(value);
}

function openStudio() {
  if (!studio) return;
  lastFocus = document.activeElement;
  const value = currentQR?.text ?? QR_DEFAULT;
  qrInput.value = value;
  qrNameInput.value = artName;
  qrCaptionInput.value = artCaption;
  updateArtControls();
  updatePreview(value, {
    note: sceneAPI
      ? 'This is the code currently in the world. Edit it to make a new one.'
      : 'The 3D world is unavailable, but this QR still works.',
  });
  if (!studio.open) studio.showModal();
  document.body.classList.add('has-dialog');
  document.documentElement.style.overflow = 'hidden';
  window.setTimeout(() => {
    qrInput.focus();
    qrInput.select();
  }, 30);
}

function closeStudio() {
  if (studio?.open) studio.close();
}

function applyStudioQR() {
  if (!ensureCurrentPreview()) return;
  currentQR = previewQR;
  if (sceneAPI) sceneAPI.setQR(currentQR);
  closeStudio();
  if (sceneAPI) {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    targetProgress = 0;
    if (reduceMotion) {
      smoothProgress = 0;
      sceneAPI.update(0, (performance.now() - startTime) / 1000, true);
      updateUI(0);
    }
  }
}

function initStudio() {
  if (!studio) return;

  loadArtState();
  buildArtControls();
  qrNameInput.value = artName;
  qrCaptionInput.value = artCaption;

  openStudioButton?.addEventListener('click', openStudio);
  cta.addEventListener('click', (event) => {
    event.preventDefault();
    openStudio();
  });
  closeStudioButton?.addEventListener('click', closeStudio);
  studio.addEventListener('click', (event) => {
    if (event.target === studio) closeStudio();
  });
  studio.addEventListener('close', () => {
    document.body.classList.remove('has-dialog');
    document.documentElement.style.overflow = '';
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  });

  qrInput.addEventListener('input', () => {
    window.clearTimeout(previewTimer);
    previewTimer = window.setTimeout(() => updatePreview(qrInput.value), 180);
  });

  const updateArtFields = () => {
    artName = qrNameInput.value.slice(0, 24);
    artCaption = qrCaptionInput.value.slice(0, 36);
    refreshArtPreview();
    window.clearTimeout(artTimer);
    artTimer = window.setTimeout(() => {
      renderStyleThumbs();
      persistArtState();
    }, 120);
  };
  qrNameInput.addEventListener('input', updateArtFields);
  qrCaptionInput.addEventListener('input', updateArtFields);

  for (const button of presetButtons) {
    button.addEventListener('click', () => {
      const preset = PRESETS[button.dataset.preset];
      if (!preset) return;
      qrInput.value = preset.value;
      updatePreview(preset.value, { note: preset.note });
    });
  }

  applyQrButton.addEventListener('click', applyStudioQR);

  downloadQrButton.addEventListener('click', async () => {
    if (!ensureCurrentPreview()) return;
    try {
      qrNote.classList.remove('is-error');
      qrNote.textContent = 'Preparing your art PNG...';
      const options = getArtOptions({ text: previewQR.text });
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 2048;
      exportCanvas.height = 2560;
      const result = renderQRArt(exportCanvas, previewQR.qr, options);
      await downloadCanvas(exportCanvas, artFileName(options, previewQR.text));
      qrNote.classList.remove('is-error');
      qrNote.textContent = `Art PNG downloaded${result?.edition ? ` (edition ${result.edition})` : ''}. Scan it with your phone before printing or minting.`;
    } catch (error) {
      qrNote.classList.add('is-error');
      qrNote.textContent = error instanceof Error ? error.message : 'Could not download the art PNG.';
    }
  });

  downloadPlainButton.addEventListener('click', async () => {
    if (!ensureCurrentPreview()) return;
    try {
      qrNote.classList.remove('is-error');
      qrNote.textContent = 'Preparing your plain QR...';
      const plainCanvas = document.createElement('canvas');
      plainCanvas.width = 1024;
      plainCanvas.height = 1024;
      drawQR(plainCanvas, previewQR.qr, { quiet: 4 });
      await downloadCanvas(plainCanvas, 'qr-volde-plain.png');
      qrNote.classList.remove('is-error');
      qrNote.textContent = 'Plain QR downloaded. Use it when a printer or scanner needs the simplest code.';
    } catch (error) {
      qrNote.classList.add('is-error');
      qrNote.textContent = error instanceof Error ? error.message : 'Could not download the plain QR.';
    }
  });

  const initial = currentQR?.text ?? QR_DEFAULT;
  qrInput.value = initial;
  updatePreview(initial);
}

function initModes() {
  for (const button of modeButtons) {
    button.addEventListener('click', () => setMode(button.dataset.mode));
  }
  setMode(currentMode, { persist: false });
}

function boot() {
  currentMode = savedMode();
  document.documentElement.dataset.mode = currentMode;
  setMetaTheme(currentMode);
  window.scrollTo(0, 0);

  try {
    currentQR = createQR(QR_DEFAULT);
  } catch {
    currentQR = null;
  }

  buildRail();
  initStudio();
  initModes();
  updateUI(readProgress());

  try {
    if (!currentQR) throw new Error('The initial QR could not be generated.');
    sceneAPI = initScene(canvas, currentQR);
    sceneAPI.setMode(currentMode);
  } catch (error) {
    console.error('QR Volde: 3D scene unavailable.', error);
    sceneAPI = null;
    document.body.classList.add('no-webgl');
    if (fallback) fallback.hidden = false;
  }

  targetProgress = readProgress();
  smoothProgress = targetProgress;
  maxScroll = getMaxScroll();
  updateUI(smoothProgress);

  const loop = (now) => {
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    const time = (now - startTime) / 1000;
    if (!frozen) {
      if (reduceMotion) {
        smoothProgress = targetProgress;
      } else {
        smoothProgress += (targetProgress - smoothProgress) * (1 - Math.exp(-dt * 7));
      }
      smoothProgress = clamp(smoothProgress, 0, 1);
    }
    sceneAPI.update(smoothProgress, time, reduceMotion);
    updateUI(smoothProgress);
    window.requestAnimationFrame(loop);
  };

  if (sceneAPI) window.requestAnimationFrame(loop);

  window.addEventListener(
    'scroll',
    () => {
      targetProgress = readProgress();
      if (!sceneAPI) {
        smoothProgress = targetProgress;
        updateUI(smoothProgress);
      }
    },
    { passive: true },
  );

  window.addEventListener('resize', () => {
    maxScroll = getMaxScroll();
    sceneAPI?.resize();
    targetProgress = readProgress();
    if (reduceMotion || !sceneAPI) {
      smoothProgress = targetProgress;
      updateUI(smoothProgress);
    }
  });

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', (event) => {
    reduceMotion = event.matches;
  });

  window.__qrVolde = {
    jumpTo(fraction) {
      const value = clamp(Number(fraction) || 0, 0, 1);
      window.scrollTo(0, value * getMaxScroll());
      targetProgress = value;
      smoothProgress = value;
      sceneAPI?.update(value, (performance.now() - startTime) / 1000, reduceMotion);
      updateUI(value);
    },
    state() {
      const { index, local } = sectionAt(smoothProgress);
      return {
        progress: smoothProgress,
        target: targetProgress,
        section: index,
        sectionId: SECTIONS[index]?.id,
        local,
        mode: currentMode,
        qr: currentQR?.text ?? null,
        artStyle: artStyleId,
        artName,
        artCaption,
        webgl: Boolean(sceneAPI),
        reduceMotion,
        scrollY: window.scrollY,
        maxScroll: getMaxScroll(),
      };
    },
    renderArt(options = {}) {
      if (!previewQR) return null;
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2560;
      renderQRArt(canvas, previewQR.qr, getArtOptions({
        ...options,
        text: previewQR.text,
      }));
      return canvas.toDataURL('image/png');
    },
    freeze(fraction) {
      const value = clamp(Number(fraction) || 0, 0, 1);
      frozen = true;
      window.scrollTo(0, value * getMaxScroll());
      targetProgress = value;
      smoothProgress = value;
      sceneAPI?.update(value, (performance.now() - startTime) / 1000, reduceMotion);
      updateUI(value);
    },
    unfreeze() {
      frozen = false;
      targetProgress = readProgress();
      smoothProgress = targetProgress;
    },
    setMode: (mode) => setMode(mode),
    openStudio,
    closeStudio,
    applyStudioQR,
    getScene: () => sceneAPI,
  };
}

boot();

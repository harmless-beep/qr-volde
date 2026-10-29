/*
 * QR Volde - QR Atelier
 * Original, procedural art-QR renderer. No external images, fonts, or APIs.
 *
 * The QR itself is always drawn on an opaque, high-contrast paper panel with a
 * four-module quiet zone. Artwork lives outside that panel (and in a small
 * central seal) so the code stays readable while the piece stays collectible.
 */

const TAU = Math.PI * 2;
const SANS = '"Segoe UI", "Avenir Next", Arial, sans-serif';
const DISPLAY = '"Palatino Linotype", "Book Antiqua", Georgia, "Times New Roman", serif';

export const ART_PALETTES = [
  {
    id: 'ivory',
    name: 'Ivory & Ink',
    palette: {
      bg: '#e9dfcf',
      bg2: '#d4c3aa',
      paper: '#fffdf8',
      ink: '#1f2422',
      finder: '#1f2422',
      accent: '#a77b4a',
      accent2: '#2f6f6a',
      text: '#241f1a',
      subtext: '#6f6659',
      shadow: 'rgba(40, 26, 12, 0.28)',
    },
  },
  {
    id: 'emerald',
    name: 'Sand & Emerald',
    palette: {
      bg: '#d9d2bd',
      bg2: '#b9c1a6',
      paper: '#fffdf5',
      ink: '#15251d',
      finder: '#15251d',
      accent: '#9b7a43',
      accent2: '#2f6f5d',
      text: '#1d2a21',
      subtext: '#5d6a5e',
      shadow: 'rgba(25, 45, 33, 0.25)',
    },
  },
  {
    id: 'rose',
    name: 'Rose & Gold',
    palette: {
      bg: '#ead6d2',
      bg2: '#d9b8b3',
      paper: '#fff8f1',
      ink: '#2c1d23',
      finder: '#2c1d23',
      accent: '#b67a61',
      accent2: '#7b3f4b',
      text: '#332229',
      subtext: '#7b5e63',
      shadow: 'rgba(60, 30, 38, 0.25)',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight & Neon',
    palette: {
      bg: '#071b1e',
      bg2: '#123038',
      paper: '#f8f3e7',
      ink: '#082326',
      finder: '#082326',
      accent: '#ff5a9e',
      accent2: '#57e6e2',
      text: '#f7f2e8',
      subtext: '#a9c1bd',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
  },
];

export const ART_MOTIFS = [
  { id: 'monogram', name: 'Monogram' },
  { id: 'lotus', name: 'Lotus' },
  { id: 'peaks', name: 'Peaks' },
  { id: 'pagoda', name: 'Pagoda' },
  { id: 'tiger', name: 'Tiger' },
];

export const ART_STYLES = [
  {
    id: 'everest',
    name: 'Everest Nocturne',
    short: 'Everest',
    kicker: 'MOONLIT SUMMIT',
    motif: 'peaks',
    palette: {
      bg: '#09131f',
      bg2: '#14283b',
      paper: '#f2e6d2',
      ink: '#0b1a24',
      finder: '#0b1a24',
      accent: '#d8b36a',
      accent2: '#7fa5b4',
      text: '#f2e6d2',
      subtext: '#b7a78f',
      shadow: 'rgba(0, 0, 0, 0.48)',
    },
    blurb: 'Moonlit peaks and a gold horizon.',
  },
  {
    id: 'newari',
    name: 'Newari Heirloom',
    short: 'Newari',
    kicker: 'KATHMANDU / 01',
    motif: 'pagoda',
    palette: {
      bg: '#3b1d1a',
      bg2: '#6e3428',
      paper: '#f6ead7',
      ink: '#2a1712',
      finder: '#2a1712',
      accent: '#d19a57',
      accent2: '#8d3c2e',
      text: '#f6ead7',
      subtext: '#d4b89b',
      shadow: 'rgba(0, 0, 0, 0.45)',
    },
    blurb: 'Terracotta, carved timber, and temple gold.',
  },
  {
    id: 'lotus',
    name: 'Lotus Rosé',
    short: 'Lotus',
    kicker: 'SOFT POWER / 02',
    motif: 'lotus',
    palette: {
      bg: '#3a1f2b',
      bg2: '#6d3545',
      paper: '#fff4ea',
      ink: '#2b1a22',
      finder: '#2b1a22',
      accent: '#e2a3a0',
      accent2: '#a85a68',
      text: '#fff4ea',
      subtext: '#d8b7b2',
      shadow: 'rgba(0, 0, 0, 0.42)',
    },
    blurb: 'Rose-gold petals around a quiet centre.',
  },
  {
    id: 'neon',
    name: 'Neon Bazaar',
    short: 'Neon',
    kicker: 'AFTER HOURS / 03',
    motif: 'neon',
    palette: {
      bg: '#041619',
      bg2: '#0d2b32',
      paper: '#f7f3e8',
      ink: '#082326',
      finder: '#082326',
      accent: '#ff5a9e',
      accent2: '#57e6e2',
      text: '#f7f3e8',
      subtext: '#a6c9c4',
      shadow: 'rgba(0, 0, 0, 0.55)',
    },
    blurb: 'Midnight streets, magenta signs, electric rain.',
  },
  {
    id: 'pashmina',
    name: 'Pashmina Light',
    short: 'Pashmina',
    kicker: 'QUIET LUXURY / 04',
    motif: 'pashmina',
    palette: {
      bg: '#e8dfd0',
      bg2: '#d7cbb8',
      paper: '#fffdf8',
      ink: '#28312c',
      finder: '#28312c',
      accent: '#b08a58',
      accent2: '#6d8a78',
      text: '#26312b',
      subtext: '#6f776e',
      shadow: 'rgba(50, 42, 30, 0.22)',
    },
    blurb: 'Woven arcs, warm paper, and a single gold line.',
  },
  {
    id: 'tiger',
    name: 'Tiger Guardian',
    short: 'Tiger',
    kicker: 'KEEP THE DOOR / 05',
    motif: 'tiger',
    palette: {
      bg: '#17281f',
      bg2: '#2f3c24',
      paper: '#f7efdf',
      ink: '#18231c',
      finder: '#18231c',
      accent: '#e0a13a',
      accent2: '#b45a2a',
      text: '#f7efdf',
      subtext: '#c8b99b',
      shadow: 'rgba(0, 0, 0, 0.48)',
    },
    blurb: 'A geometric guardian for the everyday.',
  },
  {
    id: 'custom',
    name: 'Custom Atelier',
    short: 'Custom',
    kicker: 'YOUR EDITION / 06',
    motif: 'monogram',
    palette: ART_PALETTES[0].palette,
    blurb: 'Your name, caption, palette, and motif.',
  },
];

export const DEFAULT_ART_OPTIONS = {
  styleId: 'everest',
  name: '',
  caption: 'SCAN TO ENTER',
  paletteId: 'ivory',
  motifId: 'monogram',
};

const FALLBACK_NAME = 'YOUR NAME';
const FALLBACK_CAPTION = 'SCAN TO ENTER';

export function resolveArtStyle(options = {}) {
  const style = ART_STYLES.find((item) => item.id === options.styleId) ?? ART_STYLES[0];
  if (style.id !== 'custom') {
    return { ...style, palette: { ...style.palette } };
  }
  const selected = ART_PALETTES.find((item) => item.id === options.paletteId) ?? ART_PALETTES[0];
  const motif = ART_MOTIFS.some((item) => item.id === options.motifId) ? options.motifId : 'monogram';
  return {
    ...style,
    palette: { ...selected.palette },
    motif,
    kicker: `CUSTOM / ${motif.toUpperCase()}`,
  };
}

export function artEdition(options = {}, text = '') {
  const style = resolveArtStyle(options);
  const custom = style.id === 'custom';
  const input = `${text}|${style.id}|${options.name ?? ''}|${options.caption ?? ''}|${custom ? options.paletteId ?? '' : ''}|${custom ? options.motifId ?? '' : ''}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, '0').slice(-4);
}

export function artFileName(options = {}, text = '') {
  const style = resolveArtStyle(options);
  const slug = style.name
    .normalize('NFKD')
    .replace(/[^\x00-\x7F]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `qr-volde-${slug}-${artEdition(options, text)}.png`;
}

/**
 * Draw a collectible, scannable art QR.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {object} qr - qrcode-generator instance
 * @param {object} options - styleId, name, caption, paletteId, motifId, compact
 */
export function renderQRArt(canvas, qr, options = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx || !qr) return null;

  const W = canvas.width;
  const H = canvas.height;
  const compact = Boolean(options.compact);
  const style = resolveArtStyle(options);
  const p = style.palette;
  const count = qr.getModuleCount();
  const name = cleanText(options.name, 24) || FALLBACK_NAME;
  const caption = (cleanText(options.caption, 36) || FALLBACK_CAPTION).toUpperCase();
  const edition = artEdition(options, options.text ?? '');
  const rng = makeRng(hashString(`${style.id}|${options.text ?? ''}|${name}|${caption}`));

  ctx.save();
  ctx.clearRect(0, 0, W, H);
  ctx.textBaseline = 'middle';

  drawBackground(ctx, style, W, H, rng, compact);
  drawBackdropMotif(ctx, style, W, H, name, compact);
  drawFrame(ctx, style, W, H, compact);

  const panelSize = W * (compact ? 0.72 : 0.64);
  const panelX = (W - panelSize) / 2;
  const panelY = H * (compact ? 0.145 : 0.165);
  const radius = panelSize * 0.035;

  drawPanel(ctx, style, panelX, panelY, panelSize, radius, compact);
  drawStyledQR(ctx, qr, {
    x: panelX + panelSize * 0.075,
    y: panelY + panelSize * 0.075,
    size: panelSize * 0.85,
  }, style, count, name, compact);
  drawPanelOrnaments(ctx, style, panelX, panelY, panelSize, compact);

  const plinthY = panelY + panelSize + H * (compact ? 0.012 : 0.018);
  drawPlinth(ctx, style, W, plinthY, panelSize, compact);

  if (compact) {
    drawCompactFooter(ctx, style, W, H, name, caption, plinthY);
  } else {
    drawHeader(ctx, style, W, H, name);
    drawFooter(ctx, style, W, H, name, caption, edition, plinthY);
  }

  ctx.restore();
  return { style, edition, name, caption };
}

function drawBackground(ctx, style, W, H, rng, compact) {
  const p = style.palette;
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, p.bg);
  grad.addColorStop(0.58, p.bg2);
  grad.addColorStop(1, p.bg);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.5, H * 0.31, W * 0.02, W * 0.5, H * 0.31, W * 0.64);
  glow.addColorStop(0, withAlpha(p.accent, 0.2));
  glow.addColorStop(0.55, withAlpha(p.accent, 0.06));
  glow.addColorStop(1, withAlpha(p.accent, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.globalAlpha = compact ? 0.18 : 0.12;
  ctx.strokeStyle = p.paper;
  ctx.lineWidth = Math.max(1, W * 0.0008);
  const lines = compact ? 22 : 80;
  for (let i = 0; i < lines; i += 1) {
    const y = rng() * H;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y + (rng() - 0.5) * H * 0.015);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.fillStyle = p.paper;
  ctx.globalAlpha = compact ? 0.16 : 0.11;
  const dots = compact ? 100 : 900;
  for (let i = 0; i < dots; i += 1) {
    const r = Math.max(0.5, W * (0.0005 + rng() * 0.0015));
    ctx.fillRect(rng() * W, rng() * H, r, r);
  }
  ctx.restore();
}

function drawFrame(ctx, style, W, H, compact) {
  const p = style.palette;
  const inset = W * 0.045;
  ctx.save();
  ctx.strokeStyle = withAlpha(p.accent, 0.72);
  ctx.lineWidth = Math.max(1, W * 0.0016);
  roundedRect(ctx, inset, inset, W - inset * 2, H - inset * 2, W * 0.018);
  ctx.stroke();

  ctx.strokeStyle = withAlpha(p.accent, 0.25);
  ctx.lineWidth = Math.max(1, W * 0.0008);
  roundedRect(ctx, inset + W * 0.012, inset + W * 0.012, W - (inset + W * 0.012) * 2, H - (inset + W * 0.012) * 2, W * 0.012);
  ctx.stroke();

  if (!compact) {
    ctx.strokeStyle = withAlpha(p.text, 0.28);
    ctx.lineWidth = Math.max(1, W * 0.0008);
    line(ctx, inset + W * 0.026, H * 0.086, W - inset - W * 0.026, H * 0.086);
    line(ctx, inset + W * 0.026, H * 0.925, W - inset - W * 0.026, H * 0.925);
  }

  drawCornerMark(ctx, inset + W * 0.022, inset + W * 0.022, W * 0.027, p.accent, 1);
  drawCornerMark(ctx, W - inset - W * 0.022, inset + W * 0.022, W * 0.027, p.accent, -1);
  drawCornerMark(ctx, inset + W * 0.022, H - inset - W * 0.022, W * 0.027, p.accent, 1);
  drawCornerMark(ctx, W - inset - W * 0.022, H - inset - W * 0.022, W * 0.027, p.accent, -1);
  ctx.restore();
}

function drawHeader(ctx, style, W, H, name) {
  const p = style.palette;
  const x = W * 0.075;
  const y = H * 0.056;
  const mark = W * 0.026;

  drawQRGlyph(ctx, x, y, mark, p.accent, p.bg);
  ctx.fillStyle = p.text;
  ctx.font = `700 ${W * 0.016}px ${SANS}`;
  drawTracked(ctx, 'QR VOLDE', x + mark + W * 0.012, y, W * 0.0042, 'left');
  ctx.fillStyle = p.subtext;
  ctx.font = `600 ${W * 0.0105}px ${SANS}`;
  drawTracked(ctx, 'ATELIER / COLLECTOR EDITION', W - x, y, W * 0.0048, 'right');

  ctx.fillStyle = p.accent;
  ctx.font = `500 ${W * 0.025}px ${DISPLAY}`;
  drawTracked(ctx, style.name.toUpperCase(), x, H * 0.116, W * 0.0028, 'left');

  ctx.fillStyle = withAlpha(p.subtext, 0.82);
  ctx.font = `600 ${W * 0.0095}px ${SANS}`;
  drawTracked(ctx, style.kicker, W - x, H * 0.116, W * 0.0045, 'right');

  ctx.fillStyle = withAlpha(p.text, 0.42);
  ctx.font = `500 ${W * 0.0105}px ${SANS}`;
  const personalLine = name === FALLBACK_NAME ? 'A PERSONAL EDITION' : `PERSONALISED FOR ${name.toUpperCase()}`;
  drawTracked(ctx, personalLine, x, H * 0.137, W * 0.0034, 'left');
}

function drawFooter(ctx, style, W, H, name, caption, edition, plinthY) {
  const p = style.palette;
  const x = W * 0.075;
  const center = W / 2;
  const nameSize = fitFont(ctx, name.toUpperCase(), DISPLAY, 500, W * 0.052, W * 0.76);
  ctx.fillStyle = p.text;
  ctx.font = `500 ${nameSize}px ${DISPLAY}`;
  ctx.textAlign = 'center';
  ctx.fillText(name.toUpperCase(), center, plinthY + H * 0.068);
  ctx.textAlign = 'left';

  ctx.fillStyle = p.accent;
  ctx.font = `700 ${W * 0.012}px ${SANS}`;
  drawTracked(ctx, caption, center, plinthY + H * 0.12, W * 0.007, 'center');

  ctx.fillStyle = withAlpha(p.subtext, 0.78);
  ctx.font = `600 ${W * 0.0092}px ${SANS}`;
  drawTracked(ctx, `ORIGINAL EDITION  ·  NO. ${edition}`, center, plinthY + H * 0.158, W * 0.0045, 'center');

  ctx.fillStyle = withAlpha(p.text, 0.68);
  ctx.font = `500 ${W * 0.0115}px ${DISPLAY}`;
  drawTracked(ctx, 'EVERY SQUARE IS A DOOR.', center, H * 0.91, W * 0.0055, 'center');

  ctx.fillStyle = withAlpha(p.subtext, 0.62);
  ctx.font = `600 ${W * 0.0085}px ${SANS}`;
  drawTracked(ctx, 'KATHMANDU  ·  NEPAL  ·  QR VOLDE', center, H * 0.958, W * 0.005, 'center');

  ctx.strokeStyle = withAlpha(p.accent, 0.55);
  ctx.lineWidth = Math.max(1, W * 0.0011);
  line(ctx, x, H * 0.885, W - x, H * 0.885);
}

function drawCompactFooter(ctx, style, W, H, name, caption, plinthY) {
  const p = style.palette;
  const center = W / 2;
  ctx.fillStyle = p.text;
  ctx.font = `500 ${fitFont(ctx, name.toUpperCase(), DISPLAY, 500, W * 0.07, W * 0.8)}px ${DISPLAY}`;
  ctx.textAlign = 'center';
  ctx.fillText(name.toUpperCase(), center, plinthY + H * 0.055);
  ctx.fillStyle = p.accent;
  ctx.font = `700 ${W * 0.018}px ${SANS}`;
  drawTracked(ctx, caption, center, plinthY + H * 0.095, W * 0.008, 'center');
  ctx.textAlign = 'left';
}

function drawPanel(ctx, style, x, y, size, radius, compact) {
  const p = style.palette;
  ctx.save();
  ctx.shadowColor = p.shadow;
  ctx.shadowBlur = size * (compact ? 0.035 : 0.07);
  ctx.shadowOffsetY = size * 0.018;
  ctx.fillStyle = p.paper;
  roundedRect(ctx, x, y, size, size, radius);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = withAlpha(p.accent, 0.95);
  ctx.lineWidth = Math.max(1, size * 0.0045);
  roundedRect(ctx, x, y, size, size, radius);
  ctx.stroke();
  ctx.strokeStyle = withAlpha(p.ink, 0.12);
  ctx.lineWidth = Math.max(1, size * 0.0012);
  roundedRect(ctx, x + size * 0.018, y + size * 0.018, size * 0.964, size * 0.964, radius * 0.72);
  ctx.stroke();
  ctx.restore();
}

function drawPanelOrnaments(ctx, style, x, y, size, compact) {
  const p = style.palette;
  const arm = size * 0.055;
  const inset = size * 0.018;
  const gap = size * 0.012;
  ctx.save();
  ctx.strokeStyle = withAlpha(p.accent, 0.9);
  ctx.lineWidth = Math.max(1, size * 0.0032);
  const corners = [
    [x - inset - gap, y - inset - gap, 1, 1],
    [x + size + inset + gap, y - inset - gap, -1, 1],
    [x - inset - gap, y + size + inset + gap, 1, -1],
    [x + size + inset + gap, y + size + inset + gap, -1, -1],
  ];
  for (const [cx, cy, sx, sy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx + sx * arm, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + sy * arm);
    ctx.stroke();
  }
  if (!compact) {
    ctx.fillStyle = withAlpha(p.accent, 0.8);
    const dot = size * 0.0045;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size + inset + gap * 1.6, dot, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawPlinth(ctx, style, W, y, panelSize, compact) {
  const p = style.palette;
  const center = W / 2;
  const width = panelSize * 0.74;
  const height = compact ? W * 0.008 : W * 0.014;
  ctx.save();
  ctx.fillStyle = withAlpha(p.accent, compact ? 0.32 : 0.24);
  ctx.beginPath();
  ctx.moveTo(center - width / 2, y);
  ctx.lineTo(center + width / 2, y);
  ctx.lineTo(center + width * 0.42, y + height);
  ctx.lineTo(center - width * 0.42, y + height);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = withAlpha(p.accent, 0.7);
  ctx.lineWidth = Math.max(1, W * 0.0012);
  ctx.beginPath();
  ctx.moveTo(center - width / 2, y);
  ctx.lineTo(center + width / 2, y);
  ctx.stroke();
  ctx.restore();
}

function drawStyledQR(ctx, qr, rect, style, count, name, compact) {
  const p = style.palette;
  const quiet = 4;
  const cell = rect.size / (count + quiet * 2);
  const ox = rect.x + quiet * cell;
  const oy = rect.y + quiet * cell;
  const content = cell * count;

  ctx.save();
  ctx.fillStyle = p.paper;
  ctx.fillRect(rect.x, rect.y, rect.size, rect.size);

  // Data modules. Finder areas are drawn separately so they can keep the
  // characteristic nested-square silhouette scanners expect.
  ctx.fillStyle = p.ink;
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (isFinder(row, col, count)) continue;
      if (!qr.isDark(row, col)) continue;
      const x = ox + col * cell;
      const y = oy + row * cell;
      roundedRect(ctx, x, y, cell, cell, cell * 0.17);
      ctx.fill();
    }
  }

  drawFinder(ctx, ox, oy, cell, p.finder);
  drawFinder(ctx, ox + (count - 7) * cell, oy, cell, p.finder);
  drawFinder(ctx, ox, oy + (count - 7) * cell, cell, p.finder);

  // A small seal gives the piece a signature without taking over the code.
  const sealR = cell * Math.min(4.1, Math.max(2.7, count * 0.105));
  drawSeal(ctx, style, ox + content / 2, oy + content / 2, sealR, name, compact);

  ctx.restore();
}

function drawFinder(ctx, x, y, cell, ink) {
  ctx.save();
  ctx.fillStyle = ink;
  roundedRect(ctx, x, y, cell * 7, cell * 7, cell * 1.35);
  ctx.fill();
  ctx.fillStyle = '#fffdf8';
  roundedRect(ctx, x + cell, y + cell, cell * 5, cell * 5, cell * 1.05);
  ctx.fill();
  ctx.fillStyle = ink;
  roundedRect(ctx, x + cell * 2, y + cell * 2, cell * 3, cell * 3, cell * 0.72);
  ctx.fill();
  ctx.restore();
}

function drawSeal(ctx, style, cx, cy, r, name, compact) {
  const p = style.palette;
  ctx.save();
  ctx.fillStyle = p.paper;
  ctx.strokeStyle = p.accent;
  ctx.lineWidth = Math.max(1, r * 0.11);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, TAU);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = withAlpha(p.accent, 0.42);
  ctx.lineWidth = Math.max(1, r * 0.04);
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.84, 0, TAU);
  ctx.stroke();

  const initials = name.replace(/[^\p{L}\p{N}]/gu, '');
  if (initials.length > 0 && initials.length <= 3) {
    ctx.fillStyle = p.ink;
    ctx.font = `500 ${fitFont(ctx, initials.toUpperCase(), DISPLAY, 500, r * 1.05, r * 1.35)}px ${DISPLAY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials.toUpperCase(), cx, cy + r * 0.02);
  } else {
    drawSealIcon(ctx, style, cx, cy, r, compact);
  }
  ctx.restore();
}

function drawSealIcon(ctx, style, cx, cy, r, compact) {
  const p = style.palette;
  ctx.save();
  ctx.strokeStyle = p.ink;
  ctx.fillStyle = p.ink;
  ctx.lineWidth = Math.max(1, r * 0.08);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (style.motif === 'peaks') {
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.55, cy + r * 0.34);
    ctx.lineTo(cx - r * 0.12, cy - r * 0.42);
    ctx.lineTo(cx + r * 0.16, cy + r * 0.02);
    ctx.lineTo(cx + r * 0.34, cy - r * 0.22);
    ctx.lineTo(cx + r * 0.6, cy + r * 0.34);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + r * 0.46, cy - r * 0.48, r * 0.1, 0, TAU);
    ctx.fill();
  } else if (style.motif === 'pagoda') {
    for (let i = 0; i < 3; i += 1) {
      const w = r * (0.78 - i * 0.16);
      const y = cy - r * 0.3 + i * r * 0.24;
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, y);
      ctx.quadraticCurveTo(cx, y - r * 0.2, cx + w / 2, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.7);
    ctx.lineTo(cx, cy + r * 0.45);
    ctx.stroke();
  } else if (style.motif === 'lotus') {
    for (let i = 0; i < 5; i += 1) {
      const angle = -Math.PI / 2 + (i * TAU) / 5;
      ctx.save();
      ctx.translate(cx, cy + r * 0.08);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, r * 0.1);
      ctx.bezierCurveTo(-r * 0.2, -r * 0.06, -r * 0.12, -r * 0.44, 0, -r * 0.58);
      ctx.bezierCurveTo(r * 0.12, -r * 0.44, r * 0.2, -r * 0.06, 0, r * 0.1);
      ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.08, r * 0.07, 0, TAU);
    ctx.fill();
  } else if (style.motif === 'neon') {
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.3, cy - r * 0.58);
    ctx.lineTo(cx + r * 0.12, cy - r * 0.1);
    ctx.lineTo(cx - r * 0.08, cy - r * 0.1);
    ctx.lineTo(cx + r * 0.34, cy + r * 0.58);
    ctx.stroke();
  } else if (style.motif === 'tiger') {
    // A small geometric tiger mask: ears, forehead stripes, eyes, muzzle.
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.04, r * 0.46, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.42, cy - r * 0.24);
    ctx.lineTo(cx - r * 0.3, cy - r * 0.58);
    ctx.lineTo(cx - r * 0.08, cy - r * 0.38);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.42, cy - r * 0.24);
    ctx.lineTo(cx + r * 0.3, cy - r * 0.58);
    ctx.lineTo(cx + r * 0.08, cy - r * 0.38);
    ctx.closePath();
    ctx.stroke();
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.moveTo(cx + i * r * 0.18, cy - r * 0.3);
      ctx.lineTo(cx + i * r * 0.13, cy - r * 0.12);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cx - r * 0.2, cy + r * 0.02, r * 0.055, 0, TAU);
    ctx.arc(cx + r * 0.2, cy + r * 0.02, r * 0.055, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.08, cy + r * 0.26);
    ctx.lineTo(cx, cy + r * 0.34);
    ctx.lineTo(cx + r * 0.08, cy + r * 0.26);
    ctx.stroke();
  } else if (style.motif === 'pashmina') {
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.55, cy + r * 0.2);
    ctx.bezierCurveTo(cx - r * 0.25, cy - r * 0.5, cx + r * 0.2, cy + r * 0.45, cx + r * 0.55, cy - r * 0.2);
    ctx.stroke();
  } else {
    // A tiny door: the QR Volde mark.
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.32, cy + r * 0.46);
    ctx.lineTo(cx - r * 0.32, cy - r * 0.18);
    ctx.quadraticCurveTo(cx, cy - r * 0.62, cx + r * 0.32, cy - r * 0.18);
    ctx.lineTo(cx + r * 0.32, cy + r * 0.46);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + r * 0.1, cy + r * 0.1, r * 0.045, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawBackdropMotif(ctx, style, W, H, name, compact) {
  const p = style.palette;
  const rng = makeRng(hashString(style.id));
  ctx.save();
  if (style.motif === 'peaks') {
    drawPeaks(ctx, p, W, H, rng, compact);
  } else if (style.motif === 'pagoda') {
    drawPagoda(ctx, p, W, H, compact);
  } else if (style.motif === 'lotus') {
    drawLotus(ctx, p, W, H, compact);
  } else if (style.motif === 'neon') {
    drawNeon(ctx, p, W, H, compact);
  } else if (style.motif === 'pashmina') {
    drawPashmina(ctx, p, W, H, compact);
  } else if (style.motif === 'tiger') {
    drawTiger(ctx, p, W, H, compact);
  } else {
    drawMonogramBackdrop(ctx, p, W, H, name, compact);
  }
  ctx.restore();
}

function drawPeaks(ctx, p, W, H, rng, compact) {
  ctx.save();
  const moonX = W * 0.79;
  const moonY = H * 0.135;
  const moonR = W * 0.075;
  const glow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 2.3);
  glow.addColorStop(0, withAlpha(p.accent, 0.28));
  glow.addColorStop(1, withAlpha(p.accent, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = withAlpha(p.accent, 0.8);
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, TAU);
  ctx.fill();
  ctx.fillStyle = withAlpha(p.bg, 0.25);
  ctx.beginPath();
  ctx.arc(moonX + moonR * 0.35, moonY - moonR * 0.18, moonR * 0.9, 0, TAU);
  ctx.fill();

  ctx.fillStyle = withAlpha(p.paper, 0.45);
  const stars = compact ? 22 : 90;
  for (let i = 0; i < stars; i += 1) {
    const x = rng() * W;
    const y = rng() * H * 0.42;
    const r = W * (0.0008 + rng() * 0.0018);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }

  const layers = [
    { y: H * 0.63, color: withAlpha(p.accent2, 0.18), peaks: 7 },
    { y: H * 0.72, color: withAlpha(p.accent, 0.16), peaks: 6 },
    { y: H * 0.84, color: withAlpha(p.bg, 0.65), peaks: 5 },
  ];
  for (const layer of layers) {
    ctx.fillStyle = layer.color;
    ctx.beginPath();
    ctx.moveTo(-W * 0.05, H);
    ctx.lineTo(-W * 0.05, layer.y);
    const step = W / layer.peaks;
    for (let i = 0; i < layer.peaks; i += 1) {
      const x = i * step;
      const peak = layer.y - H * (0.08 + rng() * 0.16);
      ctx.lineTo(x + step * 0.5, peak);
      ctx.lineTo(x + step, layer.y + H * (rng() * 0.03));
    }
    ctx.lineTo(W * 1.05, H);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = withAlpha(p.accent, 0.38);
  ctx.lineWidth = Math.max(1, W * 0.0012);
  line(ctx, W * 0.075, H * 0.575, W * 0.925, H * 0.575);
  ctx.restore();
}

function drawPagoda(ctx, p, W, H, compact) {
  ctx.save();
  ctx.strokeStyle = withAlpha(p.accent, 0.25);
  ctx.lineWidth = Math.max(1, W * 0.0012);
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.arc(W / 2, H * 0.36, W * (0.16 + i * 0.085), 0, TAU);
    ctx.stroke();
  }

  const baseY = H * 0.79;
  const tiers = [
    { y: baseY, w: 0.48 },
    { y: baseY - H * 0.075, w: 0.37 },
    { y: baseY - H * 0.15, w: 0.27 },
  ];
  ctx.fillStyle = withAlpha(p.accent, 0.18);
  for (const tier of tiers) {
    ctx.beginPath();
    ctx.moveTo(W / 2 - W * tier.w / 2, tier.y);
    ctx.quadraticCurveTo(W / 2, tier.y - H * 0.055, W / 2 + W * tier.w / 2, tier.y);
    ctx.lineTo(W / 2 + W * tier.w * 0.38, tier.y + H * 0.012);
    ctx.lineTo(W / 2 - W * tier.w * 0.38, tier.y + H * 0.012);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = withAlpha(p.accent, 0.28);
  ctx.fillRect(W / 2 - W * 0.018, baseY - H * 0.28, W * 0.036, H * 0.16);
  ctx.beginPath();
  ctx.arc(W / 2, baseY - H * 0.285, W * 0.024, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = withAlpha(p.paper, 0.24);
  ctx.lineWidth = Math.max(1, W * 0.001);
  const inset = W * 0.075;
  for (let x = inset; x < W - inset; x += W * 0.075) {
    line(ctx, x, H * 0.18, x + W * 0.12, H * 0.36);
  }
  ctx.restore();
}

function drawLotus(ctx, p, W, H, compact) {
  ctx.save();
  const cx = W / 2;
  const cy = H * 0.42;
  ctx.strokeStyle = withAlpha(p.accent, 0.26);
  ctx.lineWidth = Math.max(1, W * 0.0012);
  for (let ring = 0; ring < 3; ring += 1) {
    ctx.beginPath();
    ctx.arc(cx, cy, W * (0.2 + ring * 0.095), 0, TAU);
    ctx.stroke();
  }
  for (let i = 0; i < 16; i += 1) {
    const angle = (i / 16) * TAU;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -W * 0.34, W * 0.06, W * 0.2, 0, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = withAlpha(p.accent, 0.16);
  ctx.beginPath();
  ctx.arc(cx, cy, W * 0.38, 0, TAU);
  ctx.fill();
  ctx.restore();
}

function drawNeon(ctx, p, W, H, compact) {
  ctx.save();
  const horizon = H * 0.68;
  ctx.strokeStyle = withAlpha(p.accent2, 0.28);
  ctx.lineWidth = Math.max(1, W * 0.001);
  for (let i = 0; i < 8; i += 1) {
    const x = W * (0.08 + i * 0.12);
    line(ctx, W / 2, horizon, x, H);
  }
  for (let i = 0; i < 5; i += 1) {
    const y = horizon + (H - horizon) * (i / 5);
    line(ctx, 0, y, W, y);
  }

  const buildings = [
    [0.04, 0.2, 0.16], [0.2, 0.28, 0.24], [0.35, 0.13, 0.18],
    [0.62, 0.24, 0.22], [0.78, 0.18, 0.16], [0.9, 0.3, 0.12],
  ];
  for (const [x, w, h] of buildings) {
    ctx.fillStyle = withAlpha(p.accent2, 0.12);
    ctx.fillRect(W * x, horizon - H * h, W * w, H * h);
    ctx.strokeStyle = withAlpha(p.accent2, 0.25);
    ctx.strokeRect(W * x, horizon - H * h, W * w, H * h);
    ctx.fillStyle = withAlpha(p.accent, 0.45);
    for (let i = 0; i < 8; i += 1) {
      if ((i + Math.floor(x * 10)) % 3 === 0) continue;
      ctx.fillRect(W * (x + 0.02 + (i % 3) * 0.04), horizon - H * h + H * (0.03 + Math.floor(i / 3) * 0.055), W * 0.012, H * 0.016);
    }
  }

  ctx.globalAlpha = compact ? 0.16 : 0.1;
  ctx.fillStyle = p.paper;
  for (let y = 0; y < H; y += Math.max(2, H * 0.012)) {
    ctx.fillRect(0, y, W, Math.max(1, H * 0.0015));
  }
  ctx.restore();
}

function drawPashmina(ctx, p, W, H, compact) {
  ctx.save();
  ctx.strokeStyle = withAlpha(p.accent2, 0.22);
  ctx.lineWidth = Math.max(1, W * 0.0014);
  for (let i = 0; i < 7; i += 1) {
    const offset = i * H * 0.085;
    ctx.beginPath();
    ctx.moveTo(-W * 0.05, H * 0.16 + offset);
    ctx.bezierCurveTo(W * 0.28, H * 0.05 + offset, W * 0.68, H * 0.4 + offset, W * 1.05, H * 0.22 + offset);
    ctx.stroke();
  }
  ctx.strokeStyle = withAlpha(p.accent, 0.16);
  for (let x = W * 0.08; x < W; x += W * 0.065) {
    line(ctx, x, H * 0.12, x + W * 0.12, H * 0.88);
  }
  ctx.restore();
}

function drawTiger(ctx, p, W, H, compact) {
  ctx.save();
  const cx = W / 2;
  const cy = H * 0.35;

  // Guardian eyes at the edges of the composition.
  ctx.fillStyle = withAlpha(p.accent, 0.24);
  for (const side of [-1, 1]) {
    const ex = cx + side * W * 0.38;
    const ey = H * 0.34;
    ctx.beginPath();
    ctx.ellipse(ex, ey, W * 0.045, W * 0.022, side * 0.18, 0, TAU);
    ctx.fill();
    ctx.fillStyle = withAlpha(p.bg, 0.85);
    ctx.beginPath();
    ctx.arc(ex, ey, W * 0.011, 0, TAU);
    ctx.fill();
    ctx.fillStyle = withAlpha(p.accent, 0.24);
  }

  // Stripes frame the code without touching its quiet zone.
  ctx.strokeStyle = withAlpha(p.accent, 0.3);
  ctx.lineWidth = Math.max(1, W * 0.004);
  ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    for (let i = 0; i < 5; i += 1) {
      const y = H * (0.22 + i * 0.105);
      const x = cx + side * W * 0.39;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + side * W * 0.06, y + H * 0.01, x + side * W * 0.1, y - H * 0.018);
      ctx.stroke();
    }
  }

  // A faint paw print beneath the QR panel.
  ctx.fillStyle = withAlpha(p.accent, 0.18);
  const pawY = H * 0.82;
  ctx.beginPath();
  ctx.ellipse(cx, pawY, W * 0.035, W * 0.026, 0, 0, TAU);
  ctx.fill();
  for (const [dx, dy] of [[-0.06, -0.05], [-0.02, -0.07], [0.02, -0.07], [0.06, -0.05]]) {
    ctx.beginPath();
    ctx.ellipse(cx + W * dx, pawY + H * dy, W * 0.012, W * 0.017, 0, 0, TAU);
    ctx.fill();
  }

  // A barely visible guardian face behind the panel, for texture.
  ctx.strokeStyle = withAlpha(p.accent, 0.16);
  ctx.lineWidth = Math.max(1, W * 0.0014);
  ctx.beginPath();
  ctx.arc(cx, cy, W * 0.25, 0, TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx - W * 0.22, cy - W * 0.2, W * 0.1, 0, TAU);
  ctx.arc(cx + W * 0.22, cy - W * 0.2, W * 0.1, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

function drawMonogramBackdrop(ctx, p, W, H, name, compact) {
  ctx.save();
  const initial = (name.replace(/[^\p{L}\p{N}]/gu, '')[0] ?? 'Q').toUpperCase();
  ctx.fillStyle = withAlpha(p.accent, compact ? 0.08 : 0.07);
  ctx.font = `500 ${W * 0.78}px ${DISPLAY}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initial, W / 2, H * 0.42);
  ctx.strokeStyle = withAlpha(p.accent, 0.18);
  ctx.lineWidth = Math.max(1, W * 0.001);
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(W / 2, H * 0.42, W * (0.3 + i * 0.08), 0, TAU);
    ctx.stroke();
  }
  ctx.restore();
}

function drawQRGlyph(ctx, x, y, size, color, background) {
  ctx.save();
  const u = size / 7;
  for (const [r, c] of [[0, 0], [0, 4], [4, 0]]) {
    ctx.fillStyle = color;
    ctx.fillRect(x + c * u, y + r * u, u * 3, u * 3);
    ctx.fillStyle = background;
    ctx.fillRect(x + c * u + u, y + r * u + u, u, u);
  }
  ctx.fillStyle = color;
  ctx.fillRect(x + u * 4.5, y + u * 4.5, u, u);
  ctx.fillRect(x + u * 5.5, y + u * 5.5, u * 1.5, u * 1.5);
  ctx.fillRect(x + u * 4.5, y + u * 6, u, u);
  ctx.restore();
}

function drawCornerMark(ctx, x, y, size, color, direction) {
  ctx.save();
  ctx.strokeStyle = withAlpha(color, 0.65);
  ctx.lineWidth = Math.max(1, size * 0.07);
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.5);
  ctx.lineTo(x, y);
  ctx.lineTo(x + size * 0.5 * direction, y);
  ctx.stroke();
  ctx.restore();
}

function drawTracked(ctx, text, x, y, spacing, align = 'left') {
  const chars = [...String(text)];
  const widths = chars.map((char) => ctx.measureText(char).width);
  const total = widths.reduce((sum, width) => sum + width, 0) + Math.max(0, chars.length - 1) * spacing;
  let cursor = x;
  if (align === 'center') cursor = x - total / 2;
  if (align === 'right') cursor = x - total;
  ctx.textAlign = 'left';
  for (let i = 0; i < chars.length; i += 1) {
    ctx.fillText(chars[i], cursor, y);
    cursor += widths[i] + spacing;
  }
  return total;
}

function fitFont(ctx, text, family, weight, startSize, maxWidth) {
  let size = startSize;
  while (size > 8) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= Math.max(1, startSize * 0.025);
  }
  return size;
}

function cleanText(value, maxLength) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function isFinder(row, col, count) {
  return (row < 7 && col < 7)
    || (row < 7 && col >= count - 7)
    || (row >= count - 7 && col < 7);
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function withAlpha(hex, alpha) {
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((char) => char + char).join('') : value;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeRng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

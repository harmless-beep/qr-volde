import { qrcode } from './vendor/qrcode.mjs';
import { stringToBytes } from './vendor/qrcode_UTF8.mjs';

// The QR generator is MIT licensed. The UTF-8 helper keeps Devanagari and
// other non-Latin text intact instead of falling back to byte soup.
qrcode.stringToBytes = stringToBytes;

export const QR_MAX_LENGTH = 160;
export const QR_DEFAULT = 'https://example.com/qr-volde';

/**
 * Build a QR code. The flat art export uses error correction H (30%) so the
 * central seal and the decorative panel have more recovery room. The 3D wall
 * uses the same matrix, which keeps the art and the functional code in sync.
 */
export function createQR(text, options = {}) {
  const value = String(text ?? '').trim();
  if (!value) {
    throw new Error('Enter a destination or some text first.');
  }
  if (value.length > QR_MAX_LENGTH) {
    throw new Error(`Keep it under ${QR_MAX_LENGTH} characters so the 3D code stays readable.`);
  }

  const errorCorrection = options.errorCorrection ?? 'H';
  const qr = qrcode(0, errorCorrection);
  qr.addData(value);
  qr.make();

  return {
    qr,
    text: value,
    count: qr.getModuleCount(),
  };
}

/**
 * Draw a high-contrast, scannable QR on a canvas. This is deliberately not
 * themed with neon colors: the 2D preview is the code a phone should read.
 */
export function drawQR(canvas, qr, options = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = canvas.width;
  const count = qr.getModuleCount();
  const quiet = options.quiet ?? 4;
  const cell = Math.max(1, Math.floor(size / (count + quiet * 2)));
  const content = cell * count;
  const offset = Math.round((size - content) / 2);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = options.background ?? '#fffdf8';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = options.foreground ?? '#15130f';

  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (!qr.isDark(row, col)) continue;
      ctx.fillRect(
        offset + col * cell,
        offset + row * cell,
        cell,
        cell,
      );
    }
  }

  ctx.restore();
  return { cell, offset, count, quiet };
}

/**
 * A square QR texture for the city plaza. It includes a four-module quiet
 * zone, so the 3D wall modules can land exactly on the dark cells.
 */
export function drawQRTexture(canvas, qr, palette) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const size = canvas.width;
  const count = qr.getModuleCount();
  const quiet = 4;
  // Use a fractional cell so the texture's quiet zone and the 3D wall's
  // landing positions share exactly the same grid.
  const cell = size / (count + quiet * 2);
  const offset = cell * quiet;

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = palette.qrBg ?? '#fffdf8';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = palette.qrDark ?? '#15130f';

  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (!qr.isDark(row, col)) continue;
      ctx.fillRect(
        offset + col * cell,
        offset + row * cell,
        cell + 0.25,
        cell + 0.25,
      );
    }
  }

  ctx.restore();
  return { cell, offset, count, quiet };
}

export function downloadCanvas(canvas, filename = 'qr-volde.png') {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Could not create the PNG.'));
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      resolve();
    }, 'image/png');
  });
}

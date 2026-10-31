const TAU = Math.PI * 2;

/**
 * A small, dependency-free pointer playground for the Atelier preview.
 *
 * The overlay canvas draws gold dust, a pointer glow, and seal ripples around
 * the QR panel. The QR itself is kept clear: every frame the exclusion rect is
 * erased after drawing, so the preview stays readable while the card plays.
 */
export function createArtPlayground({
  stage,
  canvas,
  reducedMotion = () => false,
  onSeal = () => {},
} = {}) {
  if (!stage || !canvas) return null;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const W = canvas.width;
  const H = canvas.height;
  let exclusion = { x: W * 0.2, y: H * 0.18, w: W * 0.6, h: H * 0.46 };
  let colors = ['#d6aa5c', '#f3d9a4', '#8f2f25'];
  let particles = [];
  let rings = [];
  let flashes = [];
  let running = false;
  let lastFrame = 0;
  const pointer = {
    x: W / 2,
    y: H / 2,
    active: false,
    lastX: W / 2,
    lastY: H / 2,
    lastTime: 0,
  };

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (list) => list[Math.floor(Math.random() * list.length)] ?? list[0];

  function setExclusion(rect) {
    if (!rect) return;
    const w = rect.w ?? rect.size ?? rect.width;
    const h = rect.h ?? rect.size ?? rect.height;
    if (![rect.x, rect.y, w, h].every(Number.isFinite)) return;
    exclusion = { x: rect.x, y: rect.y, w, h };
  }

  function setColors(next) {
    if (!Array.isArray(next)) return;
    const clean = next.filter((color) => typeof color === 'string' && color.length > 0);
    if (clean.length) colors = clean;
  }

  function toCanvas(event) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return { x: W / 2, y: H / 2 };
    return {
      x: ((event.clientX - rect.left) / rect.width) * W,
      y: ((event.clientY - rect.top) / rect.height) * H,
    };
  }

  // The QR panel is the one part of the card that must stay untouched. When the
  // pointer is over it, the dust and glow gather at the nearest panel edge
  // instead of disappearing under the clear zone.
  function visiblePoint(x, y) {
    const pad = 10;
    const left = exclusion.x - pad;
    const top = exclusion.y - pad;
    const right = exclusion.x + exclusion.w + pad;
    const bottom = exclusion.y + exclusion.h + pad;
    if (x < left || x > right || y < top || y > bottom) return { x, y };

    const edges = [
      { distance: x - left, axis: 'x', value: left - 6 },
      { distance: right - x, axis: 'x', value: right + 6 },
      { distance: y - top, axis: 'y', value: top - 6 },
      { distance: bottom - y, axis: 'y', value: bottom + 6 },
    ].sort((a, b) => a.distance - b.distance);

    const nearest = edges[0];
    return nearest.axis === 'x'
      ? { x: nearest.value, y }
      : { x, y: nearest.value };
  }

  function spawn(x, y, count = 1, burst = false) {
    if (reducedMotion()) return;
    for (let i = 0; i < count; i += 1) {
      if (particles.length >= 220) break;
      const angle = burst ? rand(0, TAU) : -Math.PI / 2 + rand(-0.85, 0.85);
      const speed = burst ? rand(0.9, 3.1) : rand(0.14, 0.68);
      const life = burst ? rand(42, 84) : rand(26, 56);
      particles.push({
        x: x + rand(-3, 3),
        y: y + rand(-3, 3),
        vx: Math.cos(angle) * speed + rand(-0.18, 0.18),
        vy: Math.sin(angle) * speed + rand(-0.16, 0.16),
        life,
        maxLife: life,
        size: burst ? rand(4.2, 9.2) : rand(2.4, 4.6),
        star: burst || Math.random() < 0.22,
        color: pick(colors),
        wobble: rand(0, TAU),
      });
    }
  }

  function pointerMove(event) {
    if (reducedMotion()) return;
    const raw = toCanvas(event);
    const point = visiblePoint(raw.x, raw.y);
    const now = performance.now();
    pointer.active = true;
    pointer.x = point.x;
    pointer.y = point.y;

    const distance = Math.hypot(point.x - pointer.lastX, point.y - pointer.lastY);
    if (now - pointer.lastTime > 14 && distance > 3) {
      pointer.lastX = point.x;
      pointer.lastY = point.y;
      pointer.lastTime = now;
      spawn(point.x, point.y, distance > 28 ? 3 : 2);
    }
    ensureLoop();
  }

  function pointerLeave() {
    pointer.active = false;
    ensureLoop();
  }

  function seal(event) {
    const isPointer = event && event.detail > 0 && Number.isFinite(event.clientX);
    const raw = isPointer
      ? toCanvas(event)
      : {
          x: W / 2,
          y: Math.min(H - 36, exclusion.y + exclusion.h + 28),
        };
    const point = visiblePoint(raw.x, raw.y);

    if (!reducedMotion()) {
      rings.push({ x: point.x, y: point.y, radius: 7, life: 1, width: 4.5 });
      rings.push({ x: point.x, y: point.y, radius: 2, life: 1, width: 2.2 });
      flashes.push({ x: point.x, y: point.y, life: 1 });
      spawn(point.x, point.y, 42, true);
      ensureLoop();
    }
    onSeal();
  }

  function reset() {
    particles = [];
    rings = [];
    flashes = [];
    pointer.active = false;
    ctx.clearRect(0, 0, W, H);
  }

  function update(dt) {
    for (const particle of particles) {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= 0.994;
      particle.vy -= 0.006 * dt;
      particle.wobble += 0.045 * dt;
    }
    particles = particles.filter((particle) => particle.life > 0);

    for (const ring of rings) {
      ring.life -= 0.028 * dt;
      ring.radius += 2.6 * dt;
    }
    rings = rings.filter((ring) => ring.life > 0);

    for (const flash of flashes) {
      flash.life -= 0.05 * dt;
    }
    flashes = flashes.filter((flash) => flash.life > 0);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.save();

    if (pointer.active && !reducedMotion()) {
      const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 168);
      glow.addColorStop(0, withAlpha(colors[0], 0.24));
      glow.addColorStop(0.55, withAlpha(colors[1], 0.09));
      glow.addColorStop(1, withAlpha(colors[1], 0));
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
    }

    for (const flash of flashes) {
      const radius = 30 + (1 - flash.life) * 170;
      const burst = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, radius);
      burst.addColorStop(0, withAlpha(colors[0], flash.life * 0.24));
      burst.addColorStop(0.55, withAlpha(colors[0], flash.life * 0.09));
      burst.addColorStop(1, withAlpha(colors[0], 0));
      ctx.fillStyle = burst;
      ctx.fillRect(0, 0, W, H);
    }

    for (const ring of rings) {
      ctx.beginPath();
      ctx.strokeStyle = withAlpha(colors[0], Math.max(0, ring.life) * 0.66);
      ctx.lineWidth = Math.max(0.6, ring.width * ring.life);
      ctx.arc(ring.x, ring.y, ring.radius, 0, TAU);
      ctx.stroke();
    }

    for (const particle of particles) {
      const alpha = Math.max(0, particle.life / particle.maxLife);
      const wobble = Math.sin(particle.wobble) * 0.6;
      const x = particle.x + wobble;
      const y = particle.y;
      ctx.globalAlpha = alpha * 0.9;
      ctx.fillStyle = particle.color;
      if (particle.star) {
        const r = particle.size;
        ctx.beginPath();
        ctx.moveTo(x, y - r * 1.7);
        ctx.quadraticCurveTo(x + r * 0.12, y - r * 0.12, x + r * 1.7, y);
        ctx.quadraticCurveTo(x + r * 0.12, y + r * 0.12, x, y + r * 1.7);
        ctx.quadraticCurveTo(x - r * 0.12, y + r * 0.12, x - r * 1.7, y);
        ctx.quadraticCurveTo(x - r * 0.12, y - r * 0.12, x, y - r * 1.7);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, particle.size * 0.62, 0, TAU);
        ctx.fill();
      }
    }

    ctx.restore();

    // Keep the code itself clear. The overlay is independent of the art PNG,
    // so this only affects the live preview, never the exported card.
    const pad = 5;
    ctx.clearRect(
      exclusion.x - pad,
      exclusion.y - pad,
      exclusion.w + pad * 2,
      exclusion.h + pad * 2,
    );
  }

  function frame(now) {
    const dt = Math.min(3, (now - lastFrame) / 16.667);
    lastFrame = now;
    update(dt);
    draw();

    if (particles.length || rings.length || flashes.length || (pointer.active && !reducedMotion())) {
      requestAnimationFrame(frame);
    } else {
      running = false;
      ctx.clearRect(0, 0, W, H);
    }
  }

  function ensureLoop() {
    if (running) return;
    running = true;
    lastFrame = performance.now();
    requestAnimationFrame(frame);
  }

  return {
    setExclusion,
    setColors,
    pointerMove,
    pointerLeave,
    seal,
    reset,
  };
}

function withAlpha(hex, alpha) {
  const value = String(hex ?? '').replace('#', '');
  if (value.length !== 6) return `rgba(214, 170, 92, ${alpha})`;
  const number = Number.parseInt(value, 16);
  if (!Number.isFinite(number)) return `rgba(214, 170, 92, ${alpha})`;
  const r = (number >> 16) & 255;
  const g = (number >> 8) & 255;
  const b = number & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

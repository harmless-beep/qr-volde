import * as THREE from 'three';
import {
  ctx,
  addBox,
  addCylinder,
  addCone,
  addSphere,
  addLine,
  getMaterial,
  makeGlowTexture,
  makeRng,
  smoothstep,
  clamp,
  GROUND_Y,
} from './scene-world.js';
import { makePerson } from './city-life.js';

/* -------------------------------------------------------------------------
   Mithila courtyard — a second, separate city for the Mithila visual mode.
   White domes, painted walls, a sacred pond, oil lamps, mango groves, and a
   painting pavilion. Everything is original procedural geometry and Canvas 2D
   line art. No photos, external textures, or models.
   ------------------------------------------------------------------------- */

const rng = makeRng(0x4d697468);
const props = [];
const people = [];
const flags = [];
const kites = [];
const flames = [];
const floaters = [];
const herons = [];
const panelTextures = new Map();
let mithilaGroup = null;
let cow = null;
let glowTexture = null;

const INK = '#2b1b2e';
const RED = '#b23a48';
const YELLOW = '#d99a2b';
const TEAL = '#2f6f6a';
const CREAM = '#f7efe0';
const GREEN = '#4f7a45';

function makeCanvasTexture(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = Math.min(4, ctx.renderer?.capabilities.getMaxAnisotropy() ?? 1);
  return texture;
}

function drawLotus(g, cx, cy, radius, petals = 8) {
  g.save();
  g.translate(cx, cy);
  for (let i = 0; i < petals; i += 1) {
    g.save();
    g.rotate((i / petals) * Math.PI * 2);
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(radius * 0.34, -radius * 0.2, radius * 0.34, -radius * 0.78, 0, -radius);
    g.bezierCurveTo(-radius * 0.34, -radius * 0.78, -radius * 0.34, -radius * 0.2, 0, 0);
    g.fillStyle = i % 2 ? RED : YELLOW;
    g.fill();
    g.lineWidth = 4;
    g.strokeStyle = INK;
    g.stroke();
    g.beginPath();
    g.moveTo(0, -radius * 0.12);
    g.lineTo(0, -radius * 0.78);
    g.strokeStyle = CREAM;
    g.lineWidth = 2;
    g.stroke();
    g.restore();
  }
  g.beginPath();
  g.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
  g.fillStyle = YELLOW;
  g.fill();
  g.lineWidth = 4;
  g.strokeStyle = INK;
  g.stroke();
  g.beginPath();
  g.arc(0, 0, radius * 0.13, 0, Math.PI * 2);
  g.fillStyle = RED;
  g.fill();
  g.restore();
}

function drawFishBody(g, x, y, scale, flip, color) {
  g.save();
  g.translate(x, y);
  g.scale(flip * scale, scale);
  g.beginPath();
  g.moveTo(0, 0);
  g.bezierCurveTo(-35, -55, -105, -52, -128, 0);
  g.bezierCurveTo(-105, 52, -35, 55, 0, 0);
  g.fillStyle = color;
  g.fill();
  g.lineWidth = 5;
  g.strokeStyle = INK;
  g.stroke();

  g.beginPath();
  g.moveTo(-128, 0);
  g.lineTo(-178, -38);
  g.lineTo(-160, 0);
  g.lineTo(-178, 38);
  g.closePath();
  g.fillStyle = YELLOW;
  g.fill();
  g.stroke();

  g.beginPath();
  g.moveTo(-52, -48);
  g.lineTo(-72, -86);
  g.lineTo(-20, -55);
  g.closePath();
  g.fillStyle = CREAM;
  g.fill();
  g.stroke();

  g.beginPath();
  g.moveTo(-52, 48);
  g.lineTo(-72, 84);
  g.lineTo(-20, 55);
  g.closePath();
  g.fillStyle = CREAM;
  g.fill();
  g.stroke();

  g.beginPath();
  g.arc(-16, -8, 9, 0, Math.PI * 2);
  g.fillStyle = CREAM;
  g.fill();
  g.lineWidth = 3;
  g.stroke();
  g.beginPath();
  g.arc(-15, -8, 4, 0, Math.PI * 2);
  g.fillStyle = INK;
  g.fill();

  g.strokeStyle = CREAM;
  g.lineWidth = 3;
  for (let i = 0; i < 4; i += 1) {
    g.beginPath();
    g.arc(-34 - i * 20, 0, 20 + i * 4, -0.7, 0.7);
    g.stroke();
  }
  g.restore();
}

function drawPanelMotif(g, motif) {
  g.save();
  g.translate(256, 290);

  if (motif === 'lotus') {
    drawLotus(g, 0, -40, 170, 10);
    g.strokeStyle = INK;
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(-30, 110);
    g.bezierCurveTo(-80, 160, -100, 200, -30, 230);
    g.stroke();
    g.beginPath();
    g.moveTo(30, 110);
    g.bezierCurveTo(80, 160, 100, 200, 30, 230);
    g.stroke();
    drawLotus(g, -118, 190, 46, 6);
    drawLotus(g, 118, 190, 46, 6);
  } else if (motif === 'fish') {
    drawFishBody(g, -104, 0, 1.1, 1, RED);
    drawFishBody(g, 104, 0, 1.1, -1, TEAL);
    drawLotus(g, 0, 0, 58, 8);
    g.strokeStyle = TEAL;
    g.lineWidth = 4;
    for (let i = -2; i <= 2; i += 1) {
      g.beginPath();
      g.arc(0, 170, 40 + i * 14, Math.PI * 0.15, Math.PI * 0.85);
      g.stroke();
    }
    g.fillStyle = YELLOW;
    for (let i = 0; i < 9; i += 1) {
      g.beginPath();
      g.arc(-180 + i * 45, 226, 5, 0, Math.PI * 2);
      g.fill();
    }
  } else if (motif === 'peacock') {
    g.strokeStyle = INK;
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(-130, 190);
    g.lineTo(130, 190);
    g.stroke();
    g.strokeStyle = GREEN;
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(-70, 190);
    g.lineTo(-70, 150);
    g.moveTo(70, 190);
    g.lineTo(70, 150);
    g.stroke();
    g.beginPath();
    g.ellipse(0, 105, 44, 68, 0, 0, Math.PI * 2);
    g.fillStyle = TEAL;
    g.fill();
    g.lineWidth = 5;
    g.strokeStyle = INK;
    g.stroke();
    g.beginPath();
    g.moveTo(-6, 45);
    g.bezierCurveTo(-60, -5, -45, -80, -16, -106);
    g.strokeStyle = INK;
    g.lineWidth = 10;
    g.stroke();
    g.beginPath();
    g.arc(-22, -112, 17, 0, Math.PI * 2);
    g.fillStyle = TEAL;
    g.fill();
    g.strokeStyle = INK;
    g.lineWidth = 4;
    g.stroke();
    g.beginPath();
    g.moveTo(-38, -112);
    g.lineTo(-66, -104);
    g.lineTo(-38, -98);
    g.closePath();
    g.fillStyle = RED;
    g.fill();
    g.stroke();
    for (let i = 0; i < 3; i += 1) {
      g.beginPath();
      g.moveTo(-22, -128);
      g.lineTo(-30 + i * 8, -152);
      g.strokeStyle = INK;
      g.lineWidth = 3;
      g.stroke();
      g.beginPath();
      g.arc(-30 + i * 8, -154, 3, 0, Math.PI * 2);
      g.fillStyle = RED;
      g.fill();
    }
    for (let i = 0; i < 7; i += 1) {
      const a = -Math.PI * 0.92 + (i / 6) * Math.PI * 0.84;
      const r0 = 55;
      const r1 = 210;
      g.beginPath();
      g.moveTo(0, 90);
      g.quadraticCurveTo(Math.cos(a) * r0, 90 + Math.sin(a) * r0, Math.cos(a) * r1, 90 + Math.sin(a) * r1);
      g.strokeStyle = i % 2 ? TEAL : GREEN;
      g.lineWidth = 4;
      g.stroke();
      const ex = Math.cos(a) * r1;
      const ey = 90 + Math.sin(a) * r1;
      g.beginPath();
      g.arc(ex, ey, 15, 0, Math.PI * 2);
      g.fillStyle = YELLOW;
      g.fill();
      g.strokeStyle = INK;
      g.lineWidth = 3;
      g.stroke();
      g.beginPath();
      g.arc(ex, ey, 6, 0, Math.PI * 2);
      g.fillStyle = RED;
      g.fill();
    }
  } else if (motif === 'sun') {
    for (let i = 0; i < 16; i += 1) {
      const a = (i / 16) * Math.PI * 2;
      g.save();
      g.rotate(a);
      g.beginPath();
      g.moveTo(-18, -150);
      g.lineTo(0, -224);
      g.lineTo(18, -150);
      g.closePath();
      g.fillStyle = i % 2 ? RED : YELLOW;
      g.fill();
      g.strokeStyle = INK;
      g.lineWidth = 4;
      g.stroke();
      g.restore();
    }
    g.beginPath();
    g.arc(0, 0, 142, 0, Math.PI * 2);
    g.fillStyle = YELLOW;
    g.fill();
    g.lineWidth = 7;
    g.strokeStyle = INK;
    g.stroke();
    g.beginPath();
    g.arc(0, 0, 104, 0, Math.PI * 2);
    g.fillStyle = CREAM;
    g.fill();
    g.lineWidth = 4;
    g.strokeStyle = RED;
    g.stroke();
    drawLotus(g, 0, 0, 82, 8);
    g.strokeStyle = TEAL;
    g.lineWidth = 4;
    for (let i = 0; i < 4; i += 1) {
      g.save();
      g.rotate((i / 4) * Math.PI * 2);
      g.beginPath();
      g.moveTo(-24, -176);
      g.lineTo(0, -154);
      g.lineTo(24, -176);
      g.stroke();
      g.restore();
    }
  } else if (motif === 'bamboo') {
    for (let i = 0; i < 3; i += 1) {
      const x = -78 + i * 78;
      g.strokeStyle = GREEN;
      g.lineWidth = 16;
      g.beginPath();
      g.moveTo(x, -210);
      g.bezierCurveTo(x + 10, -80, x - 12, 40, x + 4, 220);
      g.stroke();
      g.strokeStyle = INK;
      g.lineWidth = 3;
      for (let n = -170; n < 210; n += 52) {
        g.beginPath();
        g.moveTo(x - 13, n);
        g.lineTo(x + 13, n + 2);
        g.stroke();
      }
      for (let l = 0; l < 5; l += 1) {
        const y = -150 + l * 74;
        const side = (l + i) % 2 ? 1 : -1;
        g.beginPath();
        g.moveTo(x, y);
        g.quadraticCurveTo(x + side * 42, y - 22, x + side * 74, y - 6);
        g.quadraticCurveTo(x + side * 40, y + 10, x, y);
        g.fillStyle = l % 2 ? GREEN : TEAL;
        g.fill();
        g.strokeStyle = INK;
        g.lineWidth = 3;
        g.stroke();
      }
    }
    g.strokeStyle = INK;
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(-160, 120);
    g.lineTo(-40, 120);
    g.stroke();
    g.beginPath();
    g.arc(-110, 102, 20, 0, Math.PI * 2);
    g.fillStyle = RED;
    g.fill();
    g.stroke();
    g.beginPath();
    g.moveTo(-128, 102);
    g.lineTo(-152, 96);
    g.lineTo(-128, 92);
    g.closePath();
    g.fillStyle = YELLOW;
    g.fill();
    g.stroke();
  } else {
    g.strokeStyle = INK;
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(-170, 130);
    g.bezierCurveTo(-90, 105, 80, 150, 170, 120);
    g.stroke();
    g.strokeStyle = '#7a4a30';
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(-170, 130);
    g.bezierCurveTo(-90, 105, 80, 150, 170, 120);
    g.stroke();
    for (const side of [-1, 1]) {
      g.save();
      g.scale(side, 1);
      g.beginPath();
      g.ellipse(78, 48, 38, 54, -0.25, 0, Math.PI * 2);
      g.fillStyle = side < 0 ? TEAL : GREEN;
      g.fill();
      g.lineWidth = 5;
      g.strokeStyle = INK;
      g.stroke();
      g.beginPath();
      g.arc(92, 6, 18, 0, Math.PI * 2);
      g.fillStyle = side < 0 ? GREEN : TEAL;
      g.fill();
      g.stroke();
      g.beginPath();
      g.moveTo(108, 4);
      g.lineTo(132, 12);
      g.lineTo(108, 18);
      g.closePath();
      g.fillStyle = RED;
      g.fill();
      g.stroke();
      g.beginPath();
      g.arc(96, 2, 3.5, 0, Math.PI * 2);
      g.fillStyle = CREAM;
      g.fill();
      g.beginPath();
      g.arc(96, 2, 1.8, 0, Math.PI * 2);
      g.fillStyle = INK;
      g.fill();
      for (let t = 0; t < 3; t += 1) {
        g.beginPath();
        g.moveTo(58, 82);
        g.quadraticCurveTo(30 - t * 12, 140 + t * 12, 10 - t * 10, 190 + t * 10);
        g.strokeStyle = side < 0 ? RED : YELLOW;
        g.lineWidth = 7;
        g.stroke();
      }
      g.restore();
    }
    for (let i = 0; i < 5; i += 1) {
      g.beginPath();
      g.arc(-130 + i * 54, 160, 8, 0, Math.PI * 2);
      g.fillStyle = i % 2 ? YELLOW : RED;
      g.fill();
    }
  }

  g.restore();
}

function makeMithilaPanelTexture(motif, seed = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const g = canvas.getContext('2d');
  if (!g) return null;

  const local = makeRng(seed >>> 0);
  g.fillStyle = '#f2dfbe';
  g.fillRect(0, 0, 512, 640);

  for (let i = 0; i < 420; i += 1) {
    g.fillStyle = `rgba(112, 74, 42, ${0.02 + local() * 0.045})`;
    const size = 1 + local() * 2.4;
    g.fillRect(local() * 512, local() * 640, size, size);
  }

  g.strokeStyle = INK;
  g.lineWidth = 7;
  g.strokeRect(18, 18, 476, 604);
  g.strokeStyle = RED;
  g.lineWidth = 3;
  g.strokeRect(31, 31, 450, 578);
  g.strokeStyle = INK;
  g.lineWidth = 1.5;
  g.strokeRect(43, 43, 426, 554);

  for (let x = 62; x <= 450; x += 32) {
    for (const y of [24, 616]) {
      g.beginPath();
      g.arc(x, y, 4.5, 0, Math.PI * 2);
      g.fillStyle = (x / 32) % 3 < 1 ? RED : (x / 32) % 3 < 2 ? YELLOW : TEAL;
      g.fill();
    }
  }
  for (let y = 62; y <= 578; y += 32) {
    for (const x of [24, 488]) {
      g.beginPath();
      g.arc(x, y, 4.5, 0, Math.PI * 2);
      g.fillStyle = (y / 32) % 3 < 1 ? TEAL : (y / 32) % 3 < 2 ? RED : YELLOW;
      g.fill();
    }
  }

  for (const [x, y, flip] of [[70, 70, 1], [442, 70, -1], [70, 570, 1], [442, 570, -1]]) {
    g.save();
    g.translate(x, y);
    g.scale(flip, 1);
    g.beginPath();
    g.moveTo(0, 0);
    g.quadraticCurveTo(20, -18, 38, 0);
    g.quadraticCurveTo(20, 18, 0, 0);
    g.fillStyle = RED;
    g.fill();
    g.strokeStyle = INK;
    g.lineWidth = 3;
    g.stroke();
    g.restore();
  }

  drawPanelMotif(g, motif);

  g.fillStyle = INK;
  g.fillRect(52, 548, 408, 3);
  for (let i = 0; i < 12; i += 1) {
    const x = 62 + i * 33;
    g.beginPath();
    g.moveTo(x, 556);
    g.lineTo(x + 12, 582);
    g.lineTo(x + 24, 556);
    g.closePath();
    g.fillStyle = i % 2 ? RED : YELLOW;
    g.fill();
    g.strokeStyle = INK;
    g.lineWidth = 1.5;
    g.stroke();
  }

  return makeCanvasTexture(canvas);
}

function getPanelTexture(motif, seed = 1) {
  const key = `${motif}:${seed}`;
  if (!panelTextures.has(key)) panelTextures.set(key, makeMithilaPanelTexture(motif, seed));
  return panelTextures.get(key);
}

function makeAripanaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const g = canvas.getContext('2d');
  if (!g) return null;
  g.clearRect(0, 0, 1024, 1024);
  g.save();
  g.translate(512, 512);
  g.lineCap = 'round';
  g.lineJoin = 'round';

  g.strokeStyle = CREAM;
  g.lineWidth = 12;
  g.beginPath();
  g.arc(0, 0, 474, 0, Math.PI * 2);
  g.stroke();
  g.strokeStyle = RED;
  g.lineWidth = 5;
  g.beginPath();
  g.arc(0, 0, 452, 0, Math.PI * 2);
  g.stroke();
  g.strokeStyle = YELLOW;
  g.lineWidth = 3;
  g.beginPath();
  g.arc(0, 0, 430, 0, Math.PI * 2);
  g.stroke();

  for (let i = 0; i < 24; i += 1) {
    const a = (i / 24) * Math.PI * 2;
    g.beginPath();
    g.arc(Math.cos(a) * 462, Math.sin(a) * 462, 5, 0, Math.PI * 2);
    g.fillStyle = i % 2 ? CREAM : YELLOW;
    g.fill();
  }

  for (let i = 0; i < 12; i += 1) {
    g.save();
    g.rotate((i / 12) * Math.PI * 2);
    g.beginPath();
    g.moveTo(0, -292);
    g.bezierCurveTo(46, -330, 64, -402, 0, -424);
    g.bezierCurveTo(-64, -402, -46, -330, 0, -292);
    g.fillStyle = i % 2 ? RED : CREAM;
    g.fill();
    g.strokeStyle = INK;
    g.lineWidth = 5;
    g.stroke();
    g.beginPath();
    g.moveTo(0, -310);
    g.lineTo(0, -400);
    g.strokeStyle = i % 2 ? CREAM : RED;
    g.lineWidth = 3;
    g.stroke();
    g.restore();
  }

  g.strokeStyle = CREAM;
  g.lineWidth = 6;
  g.beginPath();
  g.arc(0, 0, 286, 0, Math.PI * 2);
  g.stroke();
  g.strokeStyle = TEAL;
  g.lineWidth = 4;
  g.beginPath();
  g.arc(0, 0, 266, 0, Math.PI * 2);
  g.stroke();

  for (let i = 0; i < 8; i += 1) {
    g.save();
    g.rotate((i / 8) * Math.PI * 2);
    g.translate(0, -214);
    drawLotus(g, 0, 0, 42, 6);
    g.restore();
  }

  g.strokeStyle = YELLOW;
  g.lineWidth = 5;
  g.beginPath();
  g.arc(0, 0, 154, 0, Math.PI * 2);
  g.stroke();
  drawLotus(g, 0, 0, 128, 10);

  for (let i = 0; i < 16; i += 1) {
    const a = (i / 16) * Math.PI * 2;
    g.beginPath();
    g.arc(Math.cos(a) * 330, Math.sin(a) * 330, 4, 0, Math.PI * 2);
    g.fillStyle = i % 2 ? RED : CREAM;
    g.fill();
  }

  g.restore();
  return makeCanvasTexture(canvas);
}

function addPaintedPanel(parent, motif, width, height, x, y, z, rotY = 0, seed = 1) {
  const texture = getPanelTexture(motif, seed);
  if (!texture) return null;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  plane.position.set(x, y, z);
  plane.rotation.y = rotY;
  parent.add(plane);
  return plane;
}

function addMithilaProp(group, delay = 0) {
  mithilaGroup.add(group);
  const baseScale = group.scale.clone();
  group.scale.copy(baseScale).multiplyScalar(0.001);
  group.visible = false;
  props.push({
    group,
    baseScale,
    delay,
    baseY: group.position.y,
    baseRotY: group.rotation.y,
  });
  return group;
}

function addGable(parent, width, rise, baseY, z, rotY = 0, key = 'mud') {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([
    -width / 2, 0, 0,
    width / 2, 0, 0,
    0, rise, 0,
  ], 3));
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, getMaterial(key));
  mesh.position.set(0, baseY, z);
  mesh.rotation.y = rotY;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addThatchRoof(parent, width, depth, eaveY, angle = 0.5, options = {}) {
  const overhang = options.overhang ?? 0.28;
  const halfSpan = width / 2 + overhang;
  const roofLen = halfSpan / Math.cos(angle);
  const centerX = halfSpan / 2;
  const rise = halfSpan * Math.tan(angle);
  const centerY = eaveY + rise / 2;

  addBox(parent, roofLen, 0.12, depth, -centerX, centerY, 0, 'thatch', { rotZ: angle });
  addBox(parent, roofLen, 0.12, depth, centerX, centerY, 0, 'thatch', { rotZ: -angle });
  addBox(parent, width + overhang * 2 + 0.12, 0.1, 0.15, 0, eaveY + rise + 0.02, 0, 'thatchDark');

  if (options.gables !== false) {
    addGable(parent, width, rise, eaveY, depth / 2 + 0.01, 0, options.gableKey ?? 'mud');
    addGable(parent, width, rise, eaveY, -depth / 2 - 0.01, Math.PI, options.gableKey ?? 'mud');
  }

  addBox(parent, width + overhang * 2, 0.07, 0.1, 0, eaveY + 0.01, depth / 2 - 0.02, 'thatchDark', { castShadow: false });
  addBox(parent, width + overhang * 2, 0.07, 0.1, 0, eaveY + 0.01, -depth / 2 + 0.02, 'thatchDark', { castShadow: false });
  return { rise, centerY };
}

function makeGarland(parent, start, end, count = 12, sag = 0.3, radius = 0.05) {
  const points = [];
  for (let i = 0; i <= 20; i += 1) {
    const t = i / 20;
    const point = new THREE.Vector3().lerpVectors(start, end, t);
    point.y -= Math.sin(t * Math.PI) * sag;
    points.push(point);
  }
  addLine(parent, points, 'dark', 0.32);

  for (let i = 0; i < count; i += 1) {
    const t = (i + 0.5) / count;
    const point = new THREE.Vector3().lerpVectors(start, end, t);
    point.y -= Math.sin(t * Math.PI) * sag;
    addSphere(parent, radius, point.x, point.y, point.z, i % 4 === 0 ? 'leaf' : 'marigold', {
      widthSegments: 5,
      heightSegments: 4,
      castShadow: false,
    });
  }
}

function getGlowTexture() {
  if (!glowTexture) {
    glowTexture = makeGlowTexture('rgba(255,226,160,0.95)', 'rgba(255,170,60,0)');
  }
  return glowTexture;
}

function makeDiya(parent, x, y, z, scale = 1) {
  addCylinder(parent, 0.085 * scale, 0.06 * scale, 0.05 * scale, 8, x, y, z, 'brick', { castShadow: false });
  addCone(parent, 0.026 * scale, 0.09 * scale, 5, x, y + 0.07 * scale, z, 'window', { castShadow: false });
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: getGlowTexture(),
    color: 0xffc46a,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    toneMapped: false,
  }));
  sprite.position.set(x, y + 0.09 * scale, z);
  sprite.scale.set(0.38 * scale, 0.38 * scale, 1);
  parent.add(sprite);
  flames.push({ sprite, phase: rng() * Math.PI * 2, base: 0.38 * scale });
  return sprite;
}

function makeFloatingDiya(parent, x, y, z, scale = 0.9) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  makeDiya(group, 0, 0, 0, scale);
  parent.add(group);
  floaters.push({ group, baseY: y, phase: rng() * Math.PI * 2 });
  return group;
}

function addDome(parent, radius, height, x, baseY, z, key = 'plaster') {
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    getMaterial(key),
  );
  dome.scale.y = height / radius;
  dome.position.set(x, baseY, z);
  dome.castShadow = true;
  dome.receiveShadow = true;
  parent.add(dome);
  addCylinder(parent, radius + 0.045, radius + 0.045, 0.07, 16, x, baseY, z, 'gold', { castShadow: false });
  return dome;
}

function addFinial(parent, x, baseY, z, scale = 1) {
  addCylinder(parent, 0.055 * scale, 0.09 * scale, 0.5 * scale, 8, x, baseY + 0.25 * scale, z, 'gold');
  addSphere(parent, 0.13 * scale, x, baseY + 0.55 * scale, z, 'gold', { widthSegments: 8, heightSegments: 6 });
  addSphere(parent, 0.075 * scale, x, baseY + 0.72 * scale, z, 'gold', { widthSegments: 6, heightSegments: 4 });
  addCone(parent, 0.085 * scale, 0.28 * scale, 6, x, baseY + 0.9 * scale, z, 'gold');
}

function addArch(parent, x, y, z, width, height, frameKey = 'brick', fillKey = 'indigo', rotY = 0) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;

  const r = width / 2;
  const straight = height - r;

  addBox(group, width, straight, 0.06, 0, straight / 2, 0, fillKey, { castShadow: false });
  const top = new THREE.Mesh(new THREE.CircleGeometry(r, 16, 0, Math.PI), getMaterial(fillKey));
  top.position.set(0, straight, 0.035);
  group.add(top);

  addBox(group, 0.1, straight, 0.13, -r, straight / 2, 0.055, frameKey);
  addBox(group, 0.1, straight, 0.13, r, straight / 2, 0.055, frameKey);

  const arch = new THREE.Mesh(new THREE.TorusGeometry(r, 0.06, 6, 16, Math.PI), getMaterial(frameKey));
  arch.position.set(0, straight, 0.06);
  arch.castShadow = true;
  group.add(arch);

  const trim = new THREE.Mesh(new THREE.TorusGeometry(r - 0.095, 0.022, 5, 14, Math.PI), getMaterial('gold'));
  trim.position.set(0, straight, 0.09);
  group.add(trim);

  addBox(group, width + 0.16, 0.08, 0.2, 0, 0, 0.06, 'stone');
  parent.add(group);
  return group;
}

function addJaali(parent, x, y, z, width, height, rotY = 0) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;
  addBox(group, width, height, 0.04, 0, 0, 0, 'indigo', { castShadow: false });
  for (let i = -2; i <= 2; i += 1) {
    addBox(group, 0.028, height, 0.05, (i * width) / 5, 0, 0.03, 'gold', { castShadow: false });
  }
  for (let i = -2; i <= 2; i += 1) {
    addBox(group, width, 0.028, 0.05, 0, (i * height) / 5, 0.03, 'gold', { castShadow: false });
  }
  parent.add(group);
  return group;
}

function makePennant(key = 'accent') {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0, 0,
    0.62, -0.14, 0,
    0, -0.38, 0,
  ], 3));
  geometry.computeVertexNormals();
  const material = new THREE.MeshBasicMaterial({
    color: ctx.palette[key] ?? ctx.palette.accent,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  ctx.flagMaterials.push({ material, key });
  return new THREE.Mesh(geometry, material);
}

function makeElephant(scale = 1) {
  const group = new THREE.Group();
  group.scale.setScalar(scale);

  addBox(group, 0.62, 0.58, 1.05, 0, 0.62, 0, 'plaster');
  addBox(group, 0.5, 0.5, 0.5, 0, 0.78, 0.65, 'plaster');
  addBox(group, 0.34, 0.26, 0.3, 0, 0.62, 0.92, 'plaster');

  addCylinder(group, 0.07, 0.1, 0.42, 6, 0, 0.45, 1.0, 'plaster', { rotX: 0.3 });
  addCylinder(group, 0.05, 0.07, 0.3, 6, 0, 0.25, 1.12, 'plaster', { rotX: 0.6 });

  for (const sx of [-1, 1]) {
    addSphere(group, 0.26, sx * 0.3, 0.82, 0.6, 'plaster', {
      widthSegments: 7,
      heightSegments: 5,
      scale: [0.18, 1, 0.8],
    });
    addCone(group, 0.05, 0.3, 6, sx * 0.14, 0.55, 1.0, 'white', { rotX: Math.PI / 2 + 0.2 });
    addSphere(group, 0.035, sx * 0.18, 0.86, 0.9, 'dark', {
      widthSegments: 5,
      heightSegments: 4,
      castShadow: false,
    });
  }

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      addBox(group, 0.2, 0.42, 0.2, sx * 0.22, 0.22, sz * 0.36, 'plaster');
    }
  }

  addBox(group, 0.7, 0.08, 0.8, 0, 0.94, 0, 'accent');
  addBox(group, 0.74, 0.03, 0.84, 0, 0.99, 0, 'gold', { castShadow: false });
  addBox(group, 0.05, 0.05, 0.4, 0, 0.6, -0.65, 'plaster');
  return group;
}

function makeBovine(options = {}) {
  const group = new THREE.Group();
  const scale = options.scale ?? 1;
  const color = options.color ?? 'white';
  group.scale.setScalar(scale);

  addBox(group, 0.5, 0.5, 1.1, 0, 0.65, 0, color);
  const head = addBox(group, 0.4, 0.42, 0.42, 0, 0.82, 0.68, color);
  addBox(group, 0.28, 0.22, 0.24, 0, 0.68, 0.92, color);

  for (const sx of [-1, 1]) {
    addBox(group, 0.22, 0.06, 0.12, sx * 0.28, 0.9, 0.66, color, { rotZ: sx * 0.3 });
    addCone(group, 0.05, 0.28, 5, sx * 0.18, 1.05, 0.68, 'gold', { rotZ: sx * 0.5 });
    addSphere(group, 0.035, sx * 0.14, 0.88, 0.88, 'dark', {
      widthSegments: 5,
      heightSegments: 4,
      castShadow: false,
    });
    for (const sz of [-1, 1]) {
      addBox(group, 0.12, 0.55, 0.12, sx * 0.18, 0.28, sz * 0.36, color);
    }
  }

  const tail = addBox(group, 0.06, 0.06, 0.5, 0, 0.65, -0.62, color, { rotX: 0.35 });
  addCylinder(group, 0.08, 0.1, 0.12, 7, 0, 0.55, 0.95, 'gold');
  addBox(group, 0.03, 0.3, 0.03, 0, 0.75, 0.95, 'dark');

  if (options.hump) {
    addSphere(group, 0.25, 0, 0.98, 0.1, color, {
      widthSegments: 6,
      heightSegments: 5,
      scale: [0.7, 0.6, 0.8],
    });
  }
  if (options.blanket) {
    addBox(group, 0.54, 0.08, 0.7, 0, 0.92, 0, 'accent');
    addBox(group, 0.58, 0.03, 0.74, 0, 0.97, 0, 'gold', { castShadow: false });
  }

  group.userData.tail = tail;
  group.userData.head = head;
  return group;
}

function makeCart() {
  const group = new THREE.Group();

  addBox(group, 1.8, 0.15, 0.95, 0, 0.68, 0, 'wood');
  addBox(group, 1.8, 0.3, 0.08, 0, 0.82, 0.44, 'woodDark');
  addBox(group, 1.8, 0.3, 0.08, 0, 0.82, -0.44, 'woodDark');

  for (const sx of [-1, 1]) {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.06, 6, 14), getMaterial('woodDark'));
    wheel.position.set(sx * 0.72, 0.5, 0);
    wheel.rotation.y = Math.PI / 2;
    wheel.castShadow = true;
    group.add(wheel);
    for (let i = 0; i < 6; i += 1) {
      addBox(group, 0.04, 0.8, 0.04, sx * 0.72, 0.5, 0, 'wood', {
        rotX: (i * Math.PI) / 6,
        castShadow: false,
      });
    }
  }

  addBox(group, 0.08, 0.08, 2.1, -0.35, 0.62, 1.35, 'woodDark');
  addBox(group, 0.08, 0.08, 2.1, 0.35, 0.62, 1.35, 'woodDark');
  addBox(group, 0.95, 0.08, 0.14, 0, 0.92, 2.32, 'woodDark');

  for (let i = 0; i < 3; i += 1) {
    addSphere(group, 0.22, -0.45 + i * 0.42, 0.88, -0.12 + (i % 2) * 0.18, 'cloth3', {
      widthSegments: 6,
      heightSegments: 5,
      scale: [1, 0.8, 0.9],
    });
  }

  const ox = makeBovine({ scale: 0.95, color: 'white', hump: true, blanket: true });
  ox.position.set(0, 0, 2.65);
  group.add(ox);
  group.userData.ox = ox;

  return group;
}

function makeKite(key = 'accent') {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color: ctx.palette[key] ?? ctx.palette.accent,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  ctx.flagMaterials.push({ material, key });

  const diamond = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.92), material);
  diamond.rotation.z = Math.PI / 4;
  group.add(diamond);
  addBox(group, 0.02, 1.0, 0.02, 0, 0, 0, 'woodDark', { castShadow: false });
  addBox(group, 1.0, 0.02, 0.02, 0, 0, 0, 'woodDark', { castShadow: false });
  for (let i = 0; i < 4; i += 1) {
    addBox(group, 0.08, 0.1, 0.01, Math.sin(i * 1.7) * 0.09, -0.58 - i * 0.18, 0, i % 2 ? 'marigold' : 'accent', {
      castShadow: false,
    });
  }
  group.userData.phase = rng() * Math.PI * 2;
  return group;
}

function makeHeron() {
  const group = new THREE.Group();
  addSphere(group, 0.22, 0, 0.55, 0, 'white', {
    widthSegments: 7,
    heightSegments: 5,
    scale: [0.8, 0.7, 1.4],
  });
  addCylinder(group, 0.035, 0.045, 0.5, 6, 0, 0.85, 0.1, 'white', { rotX: -0.2 });
  const head = new THREE.Group();
  head.position.set(0, 1.1, 0.15);
  addSphere(head, 0.09, 0, 0, 0, 'white', { widthSegments: 6, heightSegments: 4 });
  addCone(head, 0.03, 0.22, 5, 0, 0, 0.16, 'gold', { rotX: Math.PI / 2 });
  group.add(head);
  for (const sx of [-1, 1]) {
    addCylinder(group, 0.02, 0.02, 0.5, 5, sx * 0.08, 0.25, -0.1, 'dark');
  }
  addBox(group, 0.12, 0.06, 0.25, 0, 0.55, -0.3, 'white');
  group.userData.head = head;
  return group;
}

function makeTemple() {
  const group = new THREE.Group();

  addBox(group, 7.4, 0.22, 5.8, 0, 0.11, 0, 'stoneDark');
  addBox(group, 6.8, 0.2, 5.2, 0, 0.31, 0, 'stone');
  addBox(group, 6.2, 0.18, 4.6, 0, 0.49, 0, 'plaster');

  for (let i = 0; i < 4; i += 1) {
    addBox(group, 3.0 - i * 0.18, 0.14, 0.6, 0, 0.42 - i * 0.12, 2.65 + i * 0.4, i % 2 ? 'stone' : 'plaster', {
      castShadow: false,
    });
  }

  addBox(group, 4.8, 2.5, 3.6, 0, 1.75, 0, 'plaster');
  addBox(group, 4.9, 0.12, 3.7, 0, 0.56, 0, 'brick');
  addBox(group, 5.0, 0.14, 3.8, 0, 3.02, 0, 'brick');

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      addBox(group, 0.28, 2.5, 0.28, sx * 2.28, 1.75, sz * 1.68, 'white');
      addCylinder(group, 0.16, 0.2, 0.12, 8, sx * 2.28, 3.06, sz * 1.68, 'gold', { castShadow: false });
    }
  }

  addArch(group, 0, 0.6, 1.82, 1.5, 2.2, 'brick', 'indigo');
  addArch(group, -1.65, 0.75, 1.82, 0.85, 1.55, 'brick', 'indigo');
  addArch(group, 1.65, 0.75, 1.82, 0.85, 1.55, 'brick', 'indigo');
  addJaali(group, -1.65, 1.35, 1.9, 0.66, 0.95);
  addJaali(group, 1.65, 1.35, 1.9, 0.66, 0.95);
  addArch(group, -2.42, 0.8, 0, 0.9, 1.5, 'brick', 'indigo', -Math.PI / 2);
  addArch(group, 2.42, 0.8, 0, 0.9, 1.5, 'brick', 'indigo', Math.PI / 2);

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      addSphere(group, 0.035, -0.3 + col * 0.3, 1.0 + row * 0.36, 1.9, 'gold', {
        widthSegments: 5,
        heightSegments: 4,
        castShadow: false,
      });
    }
  }
  addSphere(group, 0.055, 0.42, 1.25, 1.91, 'gold', {
    widthSegments: 6,
    heightSegments: 4,
    castShadow: false,
  });

  for (const sx of [-1, 1]) {
    addCylinder(group, 0.025, 0.025, 0.38, 5, sx * 0.9, 2.9, 1.98, 'gold', { castShadow: false });
    addCone(group, 0.12, 0.22, 7, sx * 0.9, 2.66, 1.98, 'gold', { castShadow: false });
    addSphere(group, 0.05, sx * 0.9, 2.5, 1.98, 'gold', { widthSegments: 5, heightSegments: 4, castShadow: false });
  }

  makeGarland(
    group,
    new THREE.Vector3(-1.55, 2.58, 2.02),
    new THREE.Vector3(1.55, 2.58, 2.02),
    16,
    0.36,
  );

  addBox(group, 3.8, 1.3, 2.8, 0, 3.65, 0, 'plaster');
  addBox(group, 4.0, 0.12, 3.0, 0, 4.32, 0, 'brick');
  addArch(group, 0, 3.15, 1.42, 0.9, 1.05, 'brick', 'indigo');
  addArch(group, -1.42, 3.2, 0, 0.72, 0.92, 'brick', 'indigo', -Math.PI / 2);
  addArch(group, 1.42, 3.2, 0, 0.72, 0.92, 'brick', 'indigo', Math.PI / 2);

  addCylinder(group, 1.5, 1.6, 0.9, 16, 0, 4.78, 0, 'plaster');
  addCylinder(group, 1.62, 1.62, 0.1, 16, 0, 5.22, 0, 'brick', { castShadow: false });
  addDome(group, 1.7, 1.5, 0, 5.23, 0, 'plaster');
  addFinial(group, 0, 6.73, 0, 1.0);

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const cx = sx * 1.55;
      const cz = sz * 1.15;
      addBox(group, 0.9, 0.12, 0.9, cx, 4.38, cz, 'brick');
      for (const px of [-0.28, 0.28]) {
        for (const pz of [-0.28, 0.28]) {
          addCylinder(group, 0.055, 0.065, 0.5, 6, cx + px, 4.65, cz + pz, 'white');
        }
      }
      addCylinder(group, 0.5, 0.5, 0.16, 12, cx, 4.93, cz, 'plaster');
      addDome(group, 0.55, 0.5, cx, 5.01, cz, 'plaster');
      addFinial(group, cx, 5.51, cz, 0.45);
    }
  }

  for (const sx of [-1, 1]) {
    const x = sx * 2.75;
    addCylinder(group, 0.32, 0.42, 3.2, 8, x, 1.6, 1.45, 'plaster');
    addCylinder(group, 0.43, 0.43, 0.1, 8, x, 0.9, 1.45, 'brick', { castShadow: false });
    addCylinder(group, 0.43, 0.43, 0.1, 8, x, 1.8, 1.45, 'brick', { castShadow: false });
    addCylinder(group, 0.43, 0.43, 0.1, 8, x, 2.7, 1.45, 'brick', { castShadow: false });
    addCylinder(group, 0.46, 0.46, 0.14, 8, x, 3.27, 1.45, 'plaster');
    addDome(group, 0.5, 0.45, x, 3.34, 1.45, 'plaster');
    addFinial(group, x, 3.79, 1.45, 0.4);
    addArch(group, x, 1.35, 1.87, 0.38, 0.8, 'brick', 'indigo');
  }

  const flag = makePennant('accent');
  flag.position.set(0.12, 7.34, 0);
  group.add(flag);
  flags.push({ mesh: flag, baseRotation: flag.rotation.z, phase: rng() * Math.PI * 2 });

  for (const sx of [-1, 1]) {
    const elephant = makeElephant(0.8);
    elephant.position.set(sx * 3.95, 0.02, 2.75);
    group.add(elephant);
  }

  makeDiya(group, -1.1, 0.6, 2.9, 1.1);
  makeDiya(group, 1.1, 0.6, 2.9, 1.1);

  return group;
}

function makeMithilaHouses() {
  const group = new THREE.Group();
  const units = [
    { x: -2.4, motif: 'fish', seed: 11 },
    { x: 0, motif: 'lotus', seed: 22 },
    { x: 2.4, motif: 'peacock', seed: 33 },
  ];

  for (const unit of units) {
    const { x, motif, seed } = unit;
    const width = 2.25;

    addBox(group, width, 0.3, 2.4, x, 0.15, 0, 'stoneDark');
    addBox(group, width, 1.9, 2.2, x, 1.25, 0, 'mud');
    addBox(group, width + 0.02, 0.1, 2.22, x, 2.15, 0, 'white');
    addBox(group, width + 0.04, 0.1, 2.24, x, 0.42, 0, 'brick');

    addThatchRoof(group, width, 3.2, 2.2, 0.5, { overhang: 0.3, gableKey: 'mud' });

    addBox(group, 0.55, 1.0, 0.08, x - 0.5, 0.82, 1.12, 'woodDark');
    addBox(group, 0.42, 0.86, 0.03, x - 0.5, 0.82, 1.17, 'indigo');
    addSphere(group, 0.035, x - 0.3, 0.82, 1.2, 'gold', { widthSegments: 5, heightSegments: 4, castShadow: false });

    addBox(group, 0.98, 1.28, 0.05, x + 0.5, 1.36, 1.09, 'woodDark', { castShadow: false });
    addPaintedPanel(group, motif, 0.86, 1.16, x + 0.5, 1.36, 1.13, 0, seed);

    for (const px of [-width / 2 + 0.16, width / 2 - 0.16]) {
      addCylinder(group, 0.05, 0.06, 1.85, 6, x + px, 1.22, 1.48, 'wood');
    }
    addBox(group, width, 0.09, 0.12, x, 2.14, 1.48, 'wood');
    addBox(group, 1.0, 0.08, 0.36, x, 0.42, 1.55, 'wood');
    addBox(group, 0.08, 0.35, 0.08, x - 0.42, 0.22, 1.55, 'woodDark');
    addBox(group, 0.08, 0.35, 0.08, x + 0.42, 0.22, 1.55, 'woodDark');

    addCylinder(group, 0.13, 0.17, 0.28, 7, x + 0.78, 0.56, 1.55, 'brick');
    addCylinder(group, 0.1, 0.14, 0.22, 7, x + 0.98, 0.53, 1.65, 'brick');
    addCylinder(group, 0.04, 0.06, 0.4, 5, x + 0.78, 0.9, 1.55, 'leafDark', { castShadow: false });

    for (let i = 0; i < 5; i += 1) {
      addCone(group, 0.035, 0.12, 4, x - 0.86, 1.98 - i * 0.14, 1.38, 'accent', { rotZ: 0.2, castShadow: false });
    }

    makeGarland(
      group,
      new THREE.Vector3(x - 0.8, 2.08, 1.34),
      new THREE.Vector3(x + 0.8, 2.08, 1.34),
      9,
      0.13,
      0.04,
    );
  }

  const charpai = new THREE.Group();
  charpai.position.set(-2.4, 0.02, 2.2);
  charpai.rotation.y = 0.16;
  addBox(charpai, 1.3, 0.07, 0.72, 0, 0.42, 0, 'wood');
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      addBox(charpai, 0.07, 0.4, 0.07, sx * 0.55, 0.2, sz * 0.28, 'woodDark');
    }
  }
  for (let i = 0; i < 5; i += 1) {
    addBox(charpai, 0.04, 0.03, 0.68, -0.5 + i * 0.25, 0.47, 0, 'cloth3', { castShadow: false });
  }
  addBox(charpai, 0.34, 0.1, 0.26, -0.2, 0.52, 0, 'accent', { castShadow: false });
  group.add(charpai);

  return group;
}

function makeSeatedPainter() {
  const group = new THREE.Group();
  addCylinder(group, 0.34, 0.46, 0.28, 8, 0, 0.18, 0, 'cloth');
  addSphere(group, 0.17, 0, 0.43, 0, 'skin', { widthSegments: 6, heightSegments: 5 });
  addCylinder(group, 0.18, 0.25, 0.42, 6, 0, 0.62, 0, 'cloth3');
  addSphere(group, 0.17, 0, 0.94, 0, 'skin', { widthSegments: 7, heightSegments: 5 });
  addSphere(group, 0.12, 0, 0.97, -0.13, 'dark', { widthSegments: 6, heightSegments: 4 });
  addBox(group, 0.14, 0.58, 0.05, -0.21, 0.68, 0.13, 'cloth3', { rotZ: 0.1, castShadow: false });
  addBox(group, 0.035, 0.58, 0.02, -0.27, 0.68, 0.16, 'gold', { rotZ: 0.1, castShadow: false });
  addBox(group, 0.075, 0.42, 0.075, -0.22, 0.62, 0.2, 'skin', { rotX: -0.75, rotZ: 0.18 });
  addBox(group, 0.075, 0.42, 0.075, 0.22, 0.62, 0.2, 'skin', { rotX: -0.75, rotZ: -0.18 });
  addCylinder(group, 0.018, 0.018, 0.32, 5, 0.12, 0.62, 0.38, 'woodDark', { rotX: 1.1, castShadow: false });
  addSphere(group, 0.022, 0, 0.97, 0.16, 'accent', { widthSegments: 5, heightSegments: 4, castShadow: false });
  return group;
}

function makePaintingPavilion() {
  const group = new THREE.Group();

  addBox(group, 3.5, 0.2, 2.9, 0, 0.1, 0, 'stone');
  addBox(group, 3.3, 0.1, 2.7, 0, 0.24, 0, 'stoneDark');

  for (const sx of [-1.5, 1.5]) {
    for (const sz of [-1.2, 1.2]) {
      addCylinder(group, 0.07, 0.09, 2.2, 6, sx, 1.34, sz, 'wood');
    }
  }
  addThatchRoof(group, 3.8, 3.2, 2.42, 0.46, { overhang: 0.3, gables: false });

  addBox(group, 3.0, 1.7, 0.1, 0, 1.2, -1.2, 'mud');
  addPaintedPanel(group, 'sun', 1.1, 1.35, -0.72, 1.32, -1.13, 0, 44);
  addPaintedPanel(group, 'parrot', 1.1, 1.35, 0.72, 1.32, -1.13, 0, 55);

  for (const x of [-1.0, 0, 1.0]) {
    addPaintedPanel(group, x < 0 ? 'bamboo' : x > 0 ? 'fish' : 'lotus', 0.6, 0.86, x, 1.55, 1.22, 0, 66 + x * 10);
    addCylinder(group, 0.012, 0.012, 0.18, 4, x - 0.24, 2.07, 1.22, 'dark', { castShadow: false });
    addCylinder(group, 0.012, 0.012, 0.18, 4, x + 0.24, 2.07, 1.22, 'dark', { castShadow: false });
  }

  addBox(group, 1.5, 0.1, 0.75, 0, 0.58, 0.55, 'wood');
  for (const sx of [-0.62, 0.62]) {
    addBox(group, 0.08, 0.4, 0.08, sx, 0.38, 0.55, 'woodDark');
  }
  const pigments = ['brick', 'marigold', 'indigo', 'white', 'leaf'];
  for (let i = 0; i < pigments.length; i += 1) {
    addCylinder(group, 0.055, 0.065, 0.08, 7, -0.52 + i * 0.26, 0.67, 0.46, pigments[i], { castShadow: false });
  }
  for (let i = 0; i < 3; i += 1) {
    addCylinder(group, 0.014, 0.014, 0.4, 4, -0.3 + i * 0.24, 0.64, 0.68, 'woodDark', {
      rotX: Math.PI / 2,
      rotZ: 0.2 - i * 0.16,
      castShadow: false,
    });
    addCone(group, 0.018, 0.07, 4, -0.08 + i * 0.24, 0.64, 0.86, 'dark', {
      rotX: Math.PI / 2,
      castShadow: false,
    });
  }

  const painter = makeSeatedPainter();
  painter.position.set(0, 0.2, -0.22);
  group.add(painter);

  makeDiya(group, 1.25, 0.3, 0.6, 1.0);
  makeGarland(
    group,
    new THREE.Vector3(-1.45, 2.24, 1.26),
    new THREE.Vector3(1.45, 2.24, 1.26),
    12,
    0.28,
  );

  return group;
}

function makePond() {
  const group = new THREE.Group();

  addBox(group, 5.4, 0.16, 3.8, 0, 0.08, 0, 'stoneDark');
  addBox(group, 4.8, 0.06, 3.2, 0, 0.19, 0, 'water', { castShadow: false });
  addBox(group, 5.8, 0.2, 0.32, 0, 0.18, 1.9, 'stone');
  addBox(group, 5.8, 0.2, 0.32, 0, 0.18, -1.9, 'stone');
  addBox(group, 0.32, 0.2, 3.8, 2.7, 0.18, 0, 'stone');
  addBox(group, 0.32, 0.2, 3.8, -2.7, 0.18, 0, 'stone');

  for (let i = 0; i < 3; i += 1) {
    addBox(group, 2.4 - i * 0.2, 0.12, 0.3, 0, 0.36 - i * 0.1, 2.15 + i * 0.26, i % 2 ? 'stoneDark' : 'stone', {
      castShadow: false,
    });
    addBox(group, 0.3, 0.12, 2.2 - i * 0.2, 2.95 + i * 0.26, 0.36 - i * 0.1, 0, i % 2 ? 'stoneDark' : 'stone', {
      castShadow: false,
    });
  }

  addBox(group, 0.5, 0.75, 0.5, -1.7, 0.38, -1.45, 'stone');
  addBox(group, 0.6, 0.14, 0.6, -1.7, 0.82, -1.45, 'stoneDark');
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.07, 18), getMaterial('gold'));
  disc.position.set(-1.7, 1.12, -1.45);
  disc.rotation.x = Math.PI / 2;
  disc.castShadow = false;
  group.add(disc);
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    addCone(group, 0.035, 0.2, 4, -1.7 + Math.cos(a) * 0.52, 1.12 + Math.sin(a) * 0.52, -1.45, 'gold', {
      rotZ: -a + Math.PI / 2,
      castShadow: false,
    });
  }
  addSphere(group, 0.09, -1.7, 1.12, -1.38, 'gold', { widthSegments: 6, heightSegments: 4, castShadow: false });

  for (let i = 0; i < 14; i += 1) {
    const x = (rng() - 0.5) * 4.2;
    const z = (rng() - 0.5) * 2.7;
    addCylinder(group, 0.12 + rng() * 0.1, 0.12 + rng() * 0.1, 0.02, 8, x, 0.225, z, i % 3 ? 'leaf' : 'leafDark', {
      castShadow: false,
    });
    if (i % 4 === 0) {
      addSphere(group, 0.07, x, 0.28, z, 'lotus', { widthSegments: 6, heightSegments: 4, castShadow: false });
      addCone(group, 0.045, 0.14, 5, x, 0.35, z, 'lotus', { castShadow: false });
    }
  }

  for (let i = 0; i < 4; i += 1) {
    const x = -1.6 + i * 1.05;
    makeFloatingDiya(group, x, 0.24, 0.55 - (i % 2) * 0.9, 0.8);
  }

  for (const [x, z, rot] of [[-2.2, 1.3, 0.3], [2.1, -1.2, -0.4]]) {
    const heron = makeHeron();
    heron.position.set(x, 0.2, z);
    heron.rotation.y = rot;
    group.add(heron);
    herons.push({ group: heron, phase: rng() * Math.PI * 2 });
  }

  makeDiya(group, 2.35, 0.3, 1.7, 1.1);
  makeDiya(group, -2.35, 0.3, 1.7, 1.1);
  makeDiya(group, 2.35, 0.3, -1.7, 1.1);
  makeDiya(group, -2.35, 0.3, -1.7, 1.1);

  return group;
}

function makeTulsiShrine() {
  const group = new THREE.Group();

  addBox(group, 1.4, 0.18, 1.4, 0, 0.09, 0, 'stoneDark');
  addBox(group, 1.2, 0.18, 1.2, 0, 0.27, 0, 'stone');
  addBox(group, 0.92, 0.8, 0.92, 0, 0.76, 0, 'plaster');
  addBox(group, 0.96, 0.09, 0.96, 0, 0.4, 0, 'brick');
  addBox(group, 0.46, 0.46, 0.05, 0, 0.85, 0.47, 'indigo');
  const arch = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.025, 5, 12, Math.PI), getMaterial('gold'));
  arch.position.set(0, 1.08, 0.5);
  group.add(arch);

  addCylinder(group, 0.27, 0.3, 0.3, 8, 0, 1.31, 0, 'brick');
  addCylinder(group, 0.29, 0.29, 0.06, 8, 0, 1.47, 0, 'gold', { castShadow: false });
  addCylinder(group, 0.035, 0.045, 0.75, 5, 0, 1.82, 0, 'leafDark');
  for (let i = 0; i < 14; i += 1) {
    const a = rng() * Math.PI * 2;
    const r = 0.08 + rng() * 0.22;
    addSphere(group, 0.07 + rng() * 0.04, Math.cos(a) * r, 1.65 + rng() * 0.5, Math.sin(a) * r, i % 2 ? 'leaf' : 'leafDark', {
      widthSegments: 5,
      heightSegments: 4,
      scale: [0.7, 1.4, 0.7],
      castShadow: false,
    });
  }
  for (let i = 0; i < 10; i += 1) {
    const a = (i / 10) * Math.PI * 2;
    addSphere(group, 0.045, Math.cos(a) * 0.32, 1.35, Math.sin(a) * 0.32, i % 3 ? 'marigold' : 'leaf', {
      widthSegments: 5,
      heightSegments: 4,
      castShadow: false,
    });
  }
  makeDiya(group, 0, 0.38, 0.72, 1.0);
  return group;
}

function makeMangoTree(scale = 1, variant = 0) {
  const group = new THREE.Group();
  const height = (2.8 + rng() * 0.8) * scale;
  addCylinder(group, 0.14 * scale, 0.24 * scale, height, 7, 0, height / 2, 0, 'wood');
  addCylinder(group, 0.17 * scale, 0.17 * scale, 0.06 * scale, 7, 0, 0.5 * scale, 0, 'accent', { castShadow: false });

  for (let i = 0; i < 3; i += 1) {
    const a = (i / 3) * Math.PI * 2 + variant;
    const branch = addCylinder(
      group,
      0.06 * scale,
      0.09 * scale,
      1.2 * scale,
      5,
      Math.cos(a) * 0.28 * scale,
      height * 0.72,
      Math.sin(a) * 0.28 * scale,
      'wood',
      { rotZ: Math.cos(a) * 0.55, rotX: Math.sin(a) * 0.55 },
    );
    branch.castShadow = true;
  }

  const canopyCount = 5 + (variant % 2);
  for (let i = 0; i < canopyCount; i += 1) {
    const a = (i / canopyCount) * Math.PI * 2 + rng();
    const radius = (0.5 + rng() * 0.45) * scale;
    const canopy = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 0),
      getMaterial(i % 2 ? 'leaf' : 'leafDark'),
    );
    canopy.position.set(
      Math.cos(a) * radius,
      height - 0.15 * scale + i * 0.26 * scale,
      Math.sin(a) * radius,
    );
    canopy.scale.set((0.75 + rng() * 0.3) * scale, (0.62 + rng() * 0.3) * scale, (0.75 + rng() * 0.3) * scale);
    canopy.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
    canopy.castShadow = true;
    canopy.receiveShadow = true;
    group.add(canopy);
  }

  for (let i = 0; i < 7; i += 1) {
    const a = rng() * Math.PI * 2;
    const r = (0.35 + rng() * 0.45) * scale;
    addSphere(group, 0.09 * scale, Math.cos(a) * r, height - 0.3 * scale + rng() * 0.4, Math.sin(a) * r, 'marigold', {
      widthSegments: 5,
      heightSegments: 4,
      castShadow: false,
    });
  }

  addBox(group, 0.55, 0.3, 0.45, 0.45, 0.15, 0.3, 'stone');
  addCone(group, 0.22, 0.2, 4, 0.45, 0.4, 0.3, 'gold');
  return group;
}

function makeBanana(scale = 1) {
  const group = new THREE.Group();
  addCylinder(group, 0.07 * scale, 0.12 * scale, 1.65 * scale, 6, 0, 0.82 * scale, 0, 'leafDark');
  for (let i = 0; i < 6; i += 1) {
    const pivot = new THREE.Group();
    pivot.position.set(0, 1.55 * scale, 0);
    pivot.rotation.y = (i / 6) * Math.PI * 2 + 0.2;
    const leaf = addBox(pivot, 0.055, 0.07, 1.15 * scale, 0, 0, 0.55 * scale, i % 2 ? 'leaf' : 'leafDark', {
      castShadow: false,
    });
    leaf.rotation.x = -0.55;
    group.add(pivot);
  }
  addCone(group, 0.05, 0.2, 5, 0, 1.58 * scale, 0, 'accent', { castShadow: false });
  return group;
}

function makeAripanaGroup() {
  const group = new THREE.Group();
  const texture = makeAripanaTexture();
  if (!texture) return group;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), material);
  plane.rotation.x = -Math.PI / 2;
  // The QR modules rise 12cm off the plaza. Keep the rangoli just above them
  // so the courtyard keeps both patterns instead of hiding one under the other.
  plane.position.y = 0.14;
  plane.renderOrder = 3;
  group.add(plane);
  return group;
}

export function buildMithila() {
  mithilaGroup = new THREE.Group();
  mithilaGroup.name = 'mithila';
  mithilaGroup.visible = false;
  ctx.scene.add(mithilaGroup);

  const temple = makeTemple();
  temple.position.set(0, GROUND_Y, -4.6);
  temple.rotation.y = 0.02;
  addMithilaProp(temple, 0);

  const houses = makeMithilaHouses();
  houses.position.set(5.7, GROUND_Y, -1.1);
  houses.rotation.y = -0.32;
  addMithilaProp(houses, 0.06);

  const pavilion = makePaintingPavilion();
  pavilion.position.set(-6.3, GROUND_Y, -1.8);
  pavilion.rotation.y = 0.38;
  addMithilaProp(pavilion, 0.1);

  const pond = makePond();
  pond.position.set(-4.3, GROUND_Y, 3.5);
  pond.rotation.y = 0.04;
  addMithilaProp(pond, 0.12);

  const tulsi = makeTulsiShrine();
  tulsi.position.set(3.7, GROUND_Y, 4.4);
  tulsi.rotation.y = -0.25;
  addMithilaProp(tulsi, 0.16);

  const aripana = makeAripanaGroup();
  aripana.position.set(0.8, GROUND_Y, 0.8);
  addMithilaProp(aripana, 0.18);

  const cart = makeCart();
  cart.position.set(7.0, GROUND_Y, 4.4);
  cart.rotation.y = -0.55;
  addMithilaProp(cart, 0.2);

  cow = makeBovine({ scale: 0.9, color: 'white', blanket: false });
  cow.position.set(-7.2, GROUND_Y, 1.2);
  cow.rotation.y = 0.6;
  addMithilaProp(cow, 0.22);

  const treeData = [
    [-8.8, -4.6, 1.15, 0.18],
    [8.9, -5.2, 1.05, 0.2],
    [-8.4, 6.4, 1.0, 0.22],
    [8.4, 6.8, 0.95, 0.24],
    [10.6, 1.2, 0.8, 0.26],
    [-10.4, 0.4, 0.85, 0.24],
  ];
  for (const [x, z, scale, delay] of treeData) {
    const tree = makeMangoTree(scale, x + z > 0 ? 1 : 0);
    tree.position.set(x, GROUND_Y, z);
    tree.rotation.y = (x + z) * 0.17;
    addMithilaProp(tree, delay);
  }

  const bananaData = [
    [8.2, 1.6, 1.0],
    [-6.9, 4.8, 0.85],
    [6.6, -3.4, 0.8],
  ];
  for (const [x, z, scale] of bananaData) {
    const banana = makeBanana(scale);
    banana.position.set(x, GROUND_Y, z);
    banana.rotation.y = (x - z) * 0.3;
    addMithilaProp(banana, 0.24);
  }

  const peopleData = [
    [-3.2, 5.9, Math.PI, { sari: true, bun: true, tika: true, tray: true, shirt: 'cloth3', pants: 'dark' }],
    [1.7, 1.3, 0.7, { sari: true, bun: true, tika: true, shirt: 'cloth', pants: 'dark' }],
    [0.9, -0.9, 0.05, { dhoti: true, shawl: 'cloth3', shirt: 'white', pants: 'white', tika: true }],
    [4.2, 5.3, 0.3, { shirt: 'cloth2', pants: 'dark', scale: 0.72 }],
    [-6.6, 4.0, 1.4, { sari: true, bun: true, basket: true, shirt: 'cloth2', pants: 'dark' }],
    [5.9, 1.2, -0.6, { shirt: 'cloth', pants: 'white', dhoti: true, hat: true }],
    [-1.6, 3.4, Math.PI * 0.8, { sari: true, bun: true, tika: true, tray: true, shirt: 'cloth2', pants: 'dark' }],
  ];

  for (const [x, z, rotY, options] of peopleData) {
    const person = makePerson(options);
    person.position.set(x, GROUND_Y, z);
    person.rotation.y = rotY;
    addMithilaProp(person, 0.14 + rng() * 0.1);
    people.push({
      group: person,
      baseY: GROUND_Y,
      baseRotY: rotY,
      phase: person.userData.phase ?? rng() * Math.PI * 2,
    });
  }

  const waterCarrier = makePerson({ sari: true, bun: true, tika: true, shirt: 'cloth', pants: 'dark' });
  waterCarrier.position.set(-5.4, GROUND_Y, 2.0);
  waterCarrier.rotation.y = 0.9;
  addCylinder(waterCarrier, 0.16, 0.2, 0.3, 7, 0.33, 0.82, 0.02, 'brick');
  addMithilaProp(waterCarrier, 0.2);
  people.push({
    group: waterCarrier,
    baseY: GROUND_Y,
    baseRotY: 0.9,
    phase: rng() * Math.PI * 2,
  });

  const kiteA = makeKite('accent');
  kiteA.position.set(-4.8, 8.6, -3.5);
  kiteA.rotation.z = 0.08;
  addMithilaProp(kiteA, 0.24);
  kiteA.userData.baseX = kiteA.position.x;
  kiteA.userData.baseY = kiteA.position.y;
  kites.push(kiteA);

  const kiteB = makeKite('accent2');
  kiteB.position.set(4.2, 9.4, -5.6);
  kiteB.rotation.z = -0.12;
  addMithilaProp(kiteB, 0.26);
  kiteB.userData.baseX = kiteB.position.x;
  kiteB.userData.baseY = kiteB.position.y;
  kites.push(kiteB);

  const templeLight = new THREE.PointLight(0xffb347, 10, 11, 2);
  templeLight.position.set(0, GROUND_Y + 3.2, -2.0);
  mithilaGroup.add(templeLight);

  const pondLight = new THREE.PointLight(0xffb347, 6, 8, 2);
  pondLight.position.set(-4.3, GROUND_Y + 1.8, 3.5);
  mithilaGroup.add(pondLight);

  const pavilionLight = new THREE.PointLight(0xffc06a, 4, 6, 2);
  pavilionLight.position.set(-6.3, GROUND_Y + 2.4, -1.8);
  mithilaGroup.add(pavilionLight);
}

export function setMithilaVisible(visible) {
  if (mithilaGroup) mithilaGroup.visible = visible;
}

export function updateMithila(progress, time, reduceMotion = false) {
  if (!mithilaGroup || !mithilaGroup.visible) return;

  const reveal = smoothstep(0.22, 0.55, progress);

  for (const prop of props) {
    const t = smoothstep(0, 1, clamp((reveal - prop.delay) / 0.38, 0, 1));
    prop.group.visible = t > 0.01;
    prop.group.scale.copy(prop.baseScale).multiplyScalar(t);
  }

  if (reduceMotion) return;

  for (const person of people) {
    if (!person.group.visible) continue;
    person.group.position.y = person.baseY + Math.sin(time * 1.15 + person.phase) * 0.012;
    person.group.rotation.y = person.baseRotY + Math.sin(time * 0.35 + person.phase) * 0.035;
    const arms = person.group.userData.arms;
    if (arms) {
      arms.leftArm.rotation.z = 0.12 + Math.sin(time * 1.1 + person.phase) * 0.035;
      arms.rightArm.rotation.z = -0.12 - Math.sin(time * 1.1 + person.phase) * 0.035;
    }
  }

  if (cow) {
    const tail = cow.userData.tail;
    if (tail) tail.rotation.x = 0.35 + Math.sin(time * 2.6 + 1.2) * 0.18;
    const head = cow.userData.head;
    if (head) head.rotation.x = Math.sin(time * 0.9 + 0.4) * 0.05;
  }

  for (const flag of flags) {
    flag.mesh.rotation.z = flag.baseRotation + Math.sin(time * 1.7 + flag.phase) * 0.14;
  }

  for (const kite of kites) {
    if (!kite.visible) continue;
    kite.position.x = kite.userData.baseX + Math.sin(time * 0.55 + kite.userData.phase) * 0.5;
    kite.position.y = kite.userData.baseY + Math.sin(time * 0.9 + kite.userData.phase) * 0.35;
    kite.rotation.z = Math.sin(time * 0.8 + kite.userData.phase) * 0.14;
  }

  for (const flame of flames) {
    const s = 0.88 + Math.sin(time * 6.4 + flame.phase) * 0.12;
    flame.sprite.scale.set(flame.base * s, flame.base * s, 1);
    flame.sprite.material.opacity = 0.68 + Math.sin(time * 5.1 + flame.phase) * 0.12;
  }

  for (const floater of floaters) {
    floater.group.position.y = floater.baseY + Math.sin(time * 0.9 + floater.phase) * 0.018;
    floater.group.rotation.y += 0.0012;
  }

  for (const heron of herons) {
    if (!heron.group.visible) continue;
    const head = heron.group.userData.head;
    if (head) {
      head.rotation.y = Math.sin(time * 0.5 + heron.phase) * 0.35;
      head.rotation.x = Math.sin(time * 0.7 + heron.phase) * 0.08;
    }
  }
}

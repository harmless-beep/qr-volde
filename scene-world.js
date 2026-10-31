import * as THREE from 'three';

/* -------------------------------------------------------------------------
   QR Volde — shared world foundation
   Renderer, camera, light, island, mountains, cloud sea, and the semantic
   material system that lets one scene switch between three art modes.
------------------------------------------------------------------------- */

export const ISLAND_RADIUS = 17;
export const ISLAND_TOP = 0.55;
export const GROUND_Y = 0.63;
export const GROUND_SPAN = 18;
export const WALL_SPAN = 11.8;
export const WALL_CENTER_Y = 7.2;

export const PALETTES = {
  dawn: {
    grass: '#8fbf7a', grassDark: '#6f9f62', soil: '#7d5238', rock: '#c7a17a', rockDark: '#9e7657',
    stone: '#c9b69b', stoneDark: '#a18b72', road: '#8b7560',
    wall: '#f3e4c8', wallWarm: '#e5c49b', brick: '#b9684d', brickDark: '#8f4b39',
    roof: '#c65b45', roofDark: '#9e4233', wood: '#7a4a30', woodDark: '#523121',
    gold: '#e1a45a', glass: '#547f9e', window: '#f3c87a', accent: '#c96f4a', accent2: '#2f6f6a',
    neon: '#ffb36b', white: '#fff8ec', cloud: '#fff9ef', cloudShade: '#eadcc8',
    mountainFar: '#d7c5b6', mountainMid: '#c0a99a', mountainNear: '#a58b7b', snow: '#fffaf0',
    qrDark: '#241f1a', qrBg: '#f7ead8', qrPanel: '#f3e4c8', qrGlow: '#c96f4a', label: '#fff8ec',
    water: '#6e9eae', sky: '#f4e6d2', fog: '#eedcc6', sun: '#ffe6c2',
    hemiSky: '#fff6e8', hemiGround: '#9a7558', fill: '#dbe8ff',
    skin: '#c98e68', cloth: '#c96f4a', cloth2: '#2f6f6a', cloth3: '#e1a45a', dark: '#241f1a',
    plaster: '#f3e4c8', mud: '#c98e63', thatch: '#c9a24a', thatchDark: '#9a7634',
    indigo: '#2f6f6a', marigold: '#e1a45a', lotus: '#e8a0a0', leaf: '#8fbf7a', leafDark: '#6f9f62',
    exposure: 1.08, sunIntensity: 2.35, hemiIntensity: 1.5, fillIntensity: 0.5,
    fogNear: 36, fogFar: 110, neonIntensity: 0.08, windowIntensity: 0.35,
    qrGlowIntensity: 0.25, qrDarkIntensity: 0,
  },
  neon: {
    grass: '#15352f', grassDark: '#0d2624', soil: '#101827', rock: '#26324c', rockDark: '#161f34',
    stone: '#2a3348', stoneDark: '#1a2234', road: '#101524',
    wall: '#1a2740', wallWarm: '#263552', brick: '#3a2748', brickDark: '#24152f',
    roof: '#6e1f4f', roofDark: '#3d1133', wood: '#2b2038', woodDark: '#160f22',
    gold: '#ffb347', glass: '#1b4058', window: '#56e0ff', accent: '#ff4fa3', accent2: '#56e0ff',
    neon: '#ff4fa3', white: '#f4f1ff', cloud: '#141b33', cloudShade: '#0a0f20',
    mountainFar: '#1c2542', mountainMid: '#151d36', mountainNear: '#0d1428', snow: '#6d7fa8',
    qrDark: '#56e0ff', qrBg: '#0c1424', qrPanel: '#0a1020', qrGlow: '#ff4fa3', label: '#f4f1ff',
    water: '#1d6a7a', sky: '#070b16', fog: '#0a1020', sun: '#9fe9ff',
    hemiSky: '#30406a', hemiGround: '#070b16', fill: '#ff4fa3',
    skin: '#d7a07e', cloth: '#ff4fa3', cloth2: '#56e0ff', cloth3: '#ffb347', dark: '#070b16',
    plaster: '#2a3348', mud: '#2b2038', thatch: '#6e4a2a', thatchDark: '#3d2a1a',
    indigo: '#56e0ff', marigold: '#ffb347', lotus: '#ff4fa3', leaf: '#15352f', leafDark: '#0d2624',
    exposure: 0.94, sunIntensity: 1.15, hemiIntensity: 1.15, fillIntensity: 0.8,
    fogNear: 24, fogFar: 85, neonIntensity: 2.6, windowIntensity: 2.2,
    qrGlowIntensity: 1.4, qrDarkIntensity: 1.6,
  },
  minimal: {
    grass: '#c9c6b6', grassDark: '#aaa895', soil: '#9b9183', rock: '#b8b0a2', rockDark: '#968d7f',
    stone: '#d6d0c3', stoneDark: '#b5ad9e', road: '#b2aa9c',
    wall: '#f7f3ea', wallWarm: '#e6dfd2', brick: '#c8b8a3', brickDark: '#a99a86',
    roof: '#b8ae9e', roofDark: '#8f8779', wood: '#8d806f', woodDark: '#655b4f',
    gold: '#b9975f', glass: '#9fb1ae', window: '#e5dcc9', accent: '#2f6f6a', accent2: '#a98b62',
    neon: '#2f6f6a', white: '#fffdf8', cloud: '#f6f2ea', cloudShade: '#e1dacf',
    mountainFar: '#ddd6ca', mountainMid: '#c8c0b3', mountainNear: '#afa697', snow: '#fffdf8',
    qrDark: '#2f3330', qrBg: '#f7f3ea', qrPanel: '#eee9df', qrGlow: '#2f6f6a', label: '#fffdf8',
    water: '#9bb9b5', sky: '#f3f0e9', fog: '#eeeae1', sun: '#fff8e8',
    hemiSky: '#fffdf8', hemiGround: '#b9b1a3', fill: '#e7f0ee',
    skin: '#b99b86', cloth: '#7b8f8b', cloth2: '#b6a58e', cloth3: '#d3c9b9', dark: '#1f2222',
    plaster: '#f7f3ea', mud: '#c8b8a3', thatch: '#b8ae9e', thatchDark: '#8f8779',
    indigo: '#2f6f6a', marigold: '#b9975f', lotus: '#d3c9b9', leaf: '#c9c6b6', leafDark: '#aaa895',
    exposure: 1.02, sunIntensity: 1.9, hemiIntensity: 1.45, fillIntensity: 0.45,
    fogNear: 38, fogFar: 115, neonIntensity: 0.05, windowIntensity: 0.15,
    qrGlowIntensity: 0.05, qrDarkIntensity: 0,
  },
  mithila: {
    grass: '#8aa85e', grassDark: '#6d8a4a', soil: '#8a5a3c', rock: '#c9a07a', rockDark: '#9e7657',
    stone: '#e8dcc8', stoneDark: '#c9b49a', road: '#c9a98a',
    wall: '#f2e2c8', wallWarm: '#e8c79a', brick: '#b5543f', brickDark: '#8a3a2e',
    roof: '#c9a24a', roofDark: '#9a7634', wood: '#7a4a30', woodDark: '#4a2b1e',
    gold: '#e8b04a', glass: '#3f6f6a', window: '#ffcf7a', accent: '#b23a48', accent2: '#2f6f6a',
    neon: '#ffb347', white: '#fff7e8', cloud: '#ffe9d2', cloudShade: '#e8c9b0',
    mountainFar: '#f2dccd', mountainMid: '#ecd0c0', mountainNear: '#e2c1b0', snow: '#fff6ea',
    qrDark: '#3a2438', qrBg: '#fbf0dd', qrPanel: '#f6e7cf', qrGlow: '#b23a48', label: '#fff7e8',
    water: '#3f8a8a', sky: '#f7e3cd', fog: '#f0d2b8', sun: '#ffd9a0',
    hemiSky: '#fff0dc', hemiGround: '#9a6a50', fill: '#ffd0b0',
    skin: '#b97a55', cloth: '#b23a48', cloth2: '#2f6f6a', cloth3: '#e8b04a', dark: '#2a1c2e',
    plaster: '#f7ead6', mud: '#d9a86f', thatch: '#c9a24a', thatchDark: '#9a7634',
    indigo: '#2f4a6a', marigold: '#e89a2b', lotus: '#e08a8a', leaf: '#6f8f45', leafDark: '#4f6f35',
    exposure: 1.05, sunIntensity: 2.2, hemiIntensity: 1.4, fillIntensity: 0.6,
    fogNear: 34, fogFar: 108, neonIntensity: 0.8, windowIntensity: 0.9,
    qrGlowIntensity: 0.3, qrDarkIntensity: 0,
  },
};

export const ctx = {
  scene: null,
  camera: null,
  renderer: null,
  palette: PALETTES.dawn,
  mode: 'dawn',
  materials: new Map(),
  lineMaterials: new Map(),
  signMaterials: [],
  labelMaterials: [],
  flagMaterials: [],
  neonLights: [],
  qrHalo: null,
  groundQR: null,
  baseAnim: { clouds: [], floaters: [], birds: [] },
  rng: null,
  narrow: false,
};

const MAT_DEFS = {
  grass: { roughness: 1, flatShading: true },
  grassDark: { roughness: 1, flatShading: true },
  soil: { roughness: 1, flatShading: true },
  rock: { roughness: 1, flatShading: true },
  rockDark: { roughness: 1, flatShading: true },
  stone: { roughness: 0.95, flatShading: true },
  stoneDark: { roughness: 0.95, flatShading: true },
  road: { roughness: 1 },
  wall: { roughness: 0.9 },
  wallWarm: { roughness: 0.9 },
  brick: { roughness: 0.95 },
  brickDark: { roughness: 0.95 },
  roof: { roughness: 0.86, flatShading: true },
  roofDark: { roughness: 0.86, flatShading: true },
  wood: { roughness: 0.9 },
  woodDark: { roughness: 0.9 },
  gold: { roughness: 0.42, metalness: 0.28 },
  glass: { roughness: 0.24, metalness: 0.08 },
  window: { roughness: 0.3, emissiveIntensity: 0.35 },
  accent: { roughness: 0.62 },
  accent2: { roughness: 0.62 },
  neon: { roughness: 0.28, emissiveIntensity: 1.8 },
  white: { roughness: 0.88, flatShading: true },
  cloud: { roughness: 1, transparent: true, opacity: 0.9, flatShading: true },
  cloudShade: { roughness: 1, transparent: true, opacity: 0.72, flatShading: true },
  mountainFar: { roughness: 1, flatShading: true },
  mountainMid: { roughness: 1, flatShading: true },
  mountainNear: { roughness: 1, flatShading: true },
  snow: { roughness: 0.92, flatShading: true },
  qrDark: { roughness: 0.5, emissiveIntensity: 0 },
  qrPanel: { roughness: 0.82, transparent: true, opacity: 1 },
  qrGlow: { roughness: 0.3, emissiveIntensity: 0.25 },
  water: { roughness: 0.16, metalness: 0.12, transparent: true, opacity: 0.82 },
  skin: { roughness: 0.9 },
  cloth: { roughness: 0.95 },
  cloth2: { roughness: 0.95 },
  cloth3: { roughness: 0.95 },
  dark: { roughness: 0.92 },
  plaster: { roughness: 0.88 },
  mud: { roughness: 1 },
  thatch: { roughness: 1, flatShading: true },
  thatchDark: { roughness: 1, flatShading: true },
  indigo: { roughness: 0.74 },
  marigold: { roughness: 0.62 },
  lotus: { roughness: 0.8 },
  leaf: { roughness: 0.96, flatShading: true },
  leafDark: { roughness: 0.96, flatShading: true },
};

const GLOW_KEYS = new Set(['neon', 'window', 'qrGlow', 'qrDark']);
const GLOW_INTENSITY_KEYS = {
  neon: 'neonIntensity',
  window: 'windowIntensity',
  qrGlow: 'qrGlowIntensity',
  qrDark: 'qrDarkIntensity',
};

const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
const ROCK_GEO = new THREE.IcosahedronGeometry(1, 0);
const TUFT_GEO = new THREE.ConeGeometry(1, 1, 4);
const PEAK_GEO = new THREE.ConeGeometry(1, 1, 5);
const CLOUD_GEO = new THREE.SphereGeometry(1, 8, 6);

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function makeRng(seed = 1) {
  let a = seed >>> 0;
  return function random() {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getMaterial(key) {
  let material = ctx.materials.get(key);
  if (material) return material;

  const def = MAT_DEFS[key] ?? {};
  const color = ctx.palette[key] ?? ctx.palette.accent;
  material = new THREE.MeshStandardMaterial({ color, ...def });
  material.userData.key = key;

  if (GLOW_KEYS.has(key)) {
    material.emissive = new THREE.Color(ctx.palette[key] ?? ctx.palette.accent);
    material.emissiveIntensity = ctx.palette[GLOW_INTENSITY_KEYS[key]] ?? 0.3;
    material.userData.glow = true;
  }

  ctx.materials.set(key, material);
  return material;
}

export function getLineMaterial(key = 'dark', opacity = 0.6) {
  const cacheKey = `${key}:${opacity}`;
  let material = ctx.lineMaterials.get(cacheKey);
  if (material) return material;
  material = new THREE.LineBasicMaterial({
    color: ctx.palette[key] ?? ctx.palette.dark,
    transparent: opacity < 1,
    opacity,
    depthWrite: false,
  });
  material.userData.key = key;
  ctx.lineMaterials.set(cacheKey, material);
  return material;
}

export function addBox(parent, w, h, d, x, y, z, key, opts = {}) {
  const mesh = new THREE.Mesh(UNIT_BOX, getMaterial(key));
  mesh.scale.set(w, h, d);
  mesh.position.set(x, y, z);
  if (opts.rot) mesh.rotation.set(opts.rot[0], opts.rot[1], opts.rot[2]);
  if (opts.rotX !== undefined) mesh.rotation.x = opts.rotX;
  if (opts.rotY !== undefined) mesh.rotation.y = opts.rotY;
  if (opts.rotZ !== undefined) mesh.rotation.z = opts.rotZ;
  mesh.castShadow = opts.castShadow ?? true;
  mesh.receiveShadow = opts.receiveShadow ?? true;
  parent.add(mesh);
  return mesh;
}

export function addCylinder(parent, radiusTop, radiusBottom, height, segments, x, y, z, key, opts = {}) {
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
  const mesh = new THREE.Mesh(geometry, getMaterial(key));
  mesh.position.set(x, y, z);
  if (opts.rot) mesh.rotation.set(opts.rot[0], opts.rot[1], opts.rot[2]);
  if (opts.rotX !== undefined) mesh.rotation.x = opts.rotX;
  if (opts.rotY !== undefined) mesh.rotation.y = opts.rotY;
  if (opts.rotZ !== undefined) mesh.rotation.z = opts.rotZ;
  mesh.castShadow = opts.castShadow ?? true;
  mesh.receiveShadow = opts.receiveShadow ?? true;
  parent.add(mesh);
  return mesh;
}

export function addCone(parent, radius, height, segments, x, y, z, key, opts = {}) {
  const geometry = new THREE.ConeGeometry(radius, height, segments);
  const mesh = new THREE.Mesh(geometry, getMaterial(key));
  mesh.position.set(x, y, z);
  if (opts.rot) mesh.rotation.set(opts.rot[0], opts.rot[1], opts.rot[2]);
  if (opts.rotX !== undefined) mesh.rotation.x = opts.rotX;
  if (opts.rotY !== undefined) mesh.rotation.y = opts.rotY;
  if (opts.rotZ !== undefined) mesh.rotation.z = opts.rotZ;
  mesh.castShadow = opts.castShadow ?? true;
  mesh.receiveShadow = opts.receiveShadow ?? true;
  parent.add(mesh);
  return mesh;
}

export function addSphere(parent, radius, x, y, z, key, opts = {}) {
  const geometry = new THREE.SphereGeometry(radius, opts.widthSegments ?? 8, opts.heightSegments ?? 6);
  const mesh = new THREE.Mesh(geometry, getMaterial(key));
  mesh.position.set(x, y, z);
  if (opts.scale) mesh.scale.set(opts.scale[0], opts.scale[1], opts.scale[2]);
  mesh.castShadow = opts.castShadow ?? true;
  mesh.receiveShadow = opts.receiveShadow ?? true;
  parent.add(mesh);
  return mesh;
}

export function addLine(parent, points, key = 'dark', opacity = 0.6) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, getLineMaterial(key, opacity));
  parent.add(line);
  return line;
}

export function makeTextTexture(text, options = {}) {
  const width = options.width ?? 1024;
  const height = options.height ?? 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.clearRect(0, 0, width, height);
  context.fillStyle = options.color ?? '#ffffff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = options.font ?? '700 64px "Nirmala UI", "Noto Sans Devanagari", "Segoe UI", sans-serif';
  context.fillText(text, width / 2, height / 2 + (options.offsetY ?? 0));

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

export function makeGlowTexture(inner = 'rgba(255,255,255,0.95)', outer = 'rgba(255,255,255,0)') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.45, inner);
  gradient.addColorStop(1, outer);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/* -------------------------------------------------------------------------
   Base world
------------------------------------------------------------------------- */

function buildIsland() {
  const rng = ctx.rng;
  const group = new THREE.Group();

  addCylinder(group, ISLAND_RADIUS, ISLAND_RADIUS * 0.985, 0.7, 12, 0, 0.2, 0, 'grass', { receiveShadow: true });
  addCylinder(group, ISLAND_RADIUS * 1.004, ISLAND_RADIUS * 0.94, 0.55, 12, 0, -0.2, 0, 'soil');
  addCylinder(group, ISLAND_RADIUS * 0.94, ISLAND_RADIUS * 0.62, 3.6, 10, 0, -2.2, 0, 'rockDark');
  addCone(group, ISLAND_RADIUS * 0.62, 7.5, 9, 0, -7.2, 0, 'rock', { rotX: Math.PI });

  for (let i = 0; i < 24; i += 1) {
    const angle = (i / 24) * Math.PI * 2 + rng() * 0.12;
    const radius = ISLAND_RADIUS * (0.94 + rng() * 0.06);
    const rock = new THREE.Mesh(ROCK_GEO, getMaterial('rock'));
    rock.position.set(Math.cos(angle) * radius, 0.28 + rng() * 0.18, Math.sin(angle) * radius);
    const scale = 0.35 + rng() * 0.9;
    rock.scale.set(scale, scale * (0.5 + rng() * 0.5), scale);
    rock.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
    rock.castShadow = true;
    rock.receiveShadow = true;
    group.add(rock);
  }

  for (let i = 0; i < 42; i += 1) {
    const angle = rng() * Math.PI * 2;
    const radius = 8.8 + rng() * 7.5;
    if (radius < 13.8 && radius > 10.8) continue;
    const tuft = new THREE.Mesh(TUFT_GEO, getMaterial('grassDark'));
    const scale = 0.14 + rng() * 0.18;
    tuft.position.set(Math.cos(angle) * radius, 0.58 + scale * 0.4, Math.sin(angle) * radius);
    tuft.scale.set(scale, scale * 2.4, scale);
    tuft.castShadow = false;
    tuft.receiveShadow = true;
    group.add(tuft);
  }

  // Terraced fields on the far side of the island.
  for (let i = 0; i < 2; i += 1) {
    const inner = 13.8 + i * 1.25;
    const outer = inner + 1.15;
    const start = Math.PI * 0.72;
    const length = Math.PI * 0.56;
    const terrace = new THREE.Mesh(
      new THREE.RingGeometry(inner, outer, 32, 1, start, length),
      getMaterial('grassDark'),
    );
    terrace.rotation.x = -Math.PI / 2;
    terrace.position.y = 0.585 + i * 0.03;
    terrace.receiveShadow = true;
    group.add(terrace);

    const edge = new THREE.Mesh(
      new THREE.RingGeometry(outer, outer + 0.12, 32, 1, start, length),
      getMaterial('stoneDark'),
    );
    edge.rotation.x = -Math.PI / 2;
    edge.position.y = 0.59 + i * 0.03;
    edge.receiveShadow = true;
    group.add(edge);
  }

  // Front steps down from the plaza.
  for (let i = 0; i < 3; i += 1) {
    addBox(group, 4.9 - i * 0.55, 0.16, 0.55, 0, 0.56 - i * 0.15, 9.35 + i * 0.5, i % 2 ? 'stone' : 'stoneDark', {
      castShadow: false,
    });
  }

  ctx.scene.add(group);
  return group;
}

function addRidge(z, key, count, spread, baseY, heightMin, heightMax, snow) {
  const rng = ctx.rng;
  const group = new THREE.Group();
  for (let i = 0; i < count; i += 1) {
    const x = -spread / 2 + (i / Math.max(1, count - 1)) * spread + (rng() - 0.5) * (spread / count) * 0.8;
    const radius = 3.5 + rng() * 5.5;
    const height = heightMin + rng() * (heightMax - heightMin);
    const peak = new THREE.Mesh(PEAK_GEO, getMaterial(key));
    peak.position.set(x, baseY + height / 2, z + (rng() - 0.5) * 7);
    peak.scale.set(radius, height, radius);
    peak.rotation.y = rng() * Math.PI;
    peak.castShadow = false;
    peak.receiveShadow = false;
    group.add(peak);

    if (snow && height > heightMin + (heightMax - heightMin) * 0.35) {
      const cap = new THREE.Mesh(PEAK_GEO, getMaterial('snow'));
      cap.position.set(x, baseY + height * 0.86, z + (rng() - 0.5) * 7);
      cap.scale.set(radius * 0.38, height * 0.28, radius * 0.38);
      cap.rotation.y = peak.rotation.y;
      cap.castShadow = false;
      cap.receiveShadow = false;
      group.add(cap);
    }
  }
  ctx.scene.add(group);
  return group;
}

function buildMountains() {
  addRidge(-78, 'mountainFar', 16, 125, -9, 11, 25, true);
  addRidge(-61, 'mountainMid', 13, 105, -8, 9, 22, true);
  addRidge(-46, 'mountainNear', 10, 82, -7, 7, 17, true);

  // Two signature peaks, deliberately broad and low-poly.
  const rng = ctx.rng;
  const hero = new THREE.Mesh(PEAK_GEO, getMaterial('mountainMid'));
  hero.position.set(-16, 4.5, -56);
  hero.scale.set(9, 21, 9);
  hero.rotation.y = 0.35;
  hero.castShadow = false;
  hero.receiveShadow = false;
  ctx.scene.add(hero);
  const heroCap = new THREE.Mesh(PEAK_GEO, getMaterial('snow'));
  heroCap.position.set(-16, 14.2, -56);
  heroCap.scale.set(3.5, 6.2, 3.5);
  heroCap.rotation.y = 0.35;
  heroCap.castShadow = false;
  ctx.scene.add(heroCap);

  const hero2 = new THREE.Mesh(PEAK_GEO, getMaterial('mountainFar'));
  hero2.position.set(24, 3.2, -66);
  hero2.scale.set(8, 18, 8);
  hero2.rotation.y = rng() * Math.PI;
  hero2.castShadow = false;
  ctx.scene.add(hero2);
  const hero2Cap = new THREE.Mesh(PEAK_GEO, getMaterial('snow'));
  hero2Cap.position.set(24, 12.3, -66);
  hero2Cap.scale.set(3, 5.4, 3);
  hero2Cap.rotation.y = hero2.rotation.y;
  hero2Cap.castShadow = false;
  ctx.scene.add(hero2Cap);
}

function buildClouds() {
  const rng = ctx.rng;
  for (let i = 0; i < 18; i += 1) {
    const cloud = new THREE.Mesh(CLOUD_GEO, getMaterial(i % 3 === 0 ? 'cloudShade' : 'cloud'));
    const scale = 2.6 + rng() * 5.5;
    cloud.position.set((rng() - 0.5) * 48, -6.4 - rng() * 3.4, -8 - rng() * 34);
    cloud.scale.set(scale * 1.45, scale * 0.24, scale * 0.72);
    cloud.castShadow = false;
    cloud.receiveShadow = false;
    cloud.renderOrder = 1;
    ctx.scene.add(cloud);
    ctx.baseAnim.clouds.push({
      mesh: cloud,
      baseX: cloud.position.x,
      phase: rng() * Math.PI * 2,
      speed: 0.08 + rng() * 0.12,
      drift: 0.7 + rng() * 1.4,
    });
  }

  for (let i = 0; i < 6; i += 1) {
    const cloud = new THREE.Mesh(CLOUD_GEO, getMaterial('cloud'));
    const scale = 4.5 + rng() * 4;
    cloud.position.set((rng() - 0.5) * 70, 12 + rng() * 8, -36 - rng() * 24);
    cloud.scale.set(scale * 1.7, scale * 0.18, scale * 0.7);
    cloud.castShadow = false;
    cloud.receiveShadow = false;
    cloud.renderOrder = 1;
    ctx.scene.add(cloud);
    ctx.baseAnim.clouds.push({
      mesh: cloud,
      baseX: cloud.position.x,
      phase: rng() * Math.PI * 2,
      speed: 0.04 + rng() * 0.06,
      drift: 1.2 + rng() * 2,
    });
  }
}

function buildSky() {
  const spriteMaterial = new THREE.SpriteMaterial({
    map: makeGlowTexture('rgba(255,255,255,0.96)', 'rgba(255,255,255,0)'),
    color: ctx.palette.sun,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    toneMapped: false,
  });
  const sky = new THREE.Sprite(spriteMaterial);
  sky.position.set(-20, 18, -62);
  sky.scale.set(24, 24, 1);
  ctx.scene.add(sky);
  ctx.skySprite = sky;
}

function buildFloaters() {
  const rng = ctx.rng;
  for (let i = 0; i < 9; i += 1) {
    const angle = rng() * Math.PI * 2;
    const radius = 12 + rng() * 9;
    const floater = new THREE.Group();
    const rock = new THREE.Mesh(ROCK_GEO, getMaterial(i % 2 ? 'rockDark' : 'rock'));
    const scale = 0.45 + rng() * 1.15;
    rock.scale.set(scale * 1.2, scale, scale);
    rock.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
    rock.castShadow = true;
    rock.receiveShadow = true;
    floater.add(rock);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(scale * 1.05, scale * 0.88, 0.18, 7), getMaterial('grass'));
    cap.position.y = scale * 0.54;
    cap.castShadow = true;
    floater.add(cap);
    floater.position.set(Math.cos(angle) * radius, -1.2 - rng() * 6, Math.sin(angle) * radius);
    ctx.scene.add(floater);
    ctx.baseAnim.floaters.push({
      group: floater,
      baseY: floater.position.y,
      phase: rng() * Math.PI * 2,
      speed: 0.3 + rng() * 0.45,
    });
  }
}

function buildBirds() {
  const rng = ctx.rng;
  for (let i = 0; i < 8; i += 1) {
    const bird = new THREE.Group();
    const wingGeometry = new THREE.BoxGeometry(0.5, 0.035, 0.1);
    const left = new THREE.Mesh(wingGeometry, getMaterial('dark'));
    const right = new THREE.Mesh(wingGeometry, getMaterial('dark'));
    left.position.x = -0.22;
    right.position.x = 0.22;
    left.rotation.z = 0.28;
    right.rotation.z = -0.28;
    bird.add(left, right);
    const center = new THREE.Vector3((rng() - 0.5) * 40, 9 + rng() * 10, -26 - rng() * 18);
    bird.position.copy(center);
    ctx.scene.add(bird);
    ctx.baseAnim.birds.push({
      group: bird,
      center,
      radius: 3 + rng() * 7,
      phase: rng() * Math.PI * 2,
      speed: 0.08 + rng() * 0.08,
      left,
      right,
      flap: 1.4 + rng() * 1.8,
    });
  }
}

export function createWorldBase(canvas) {
  ctx.renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  ctx.renderer.setClearColor(0x000000, 0);
  ctx.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  ctx.renderer.setSize(window.innerWidth, window.innerHeight);
  ctx.renderer.outputColorSpace = THREE.SRGBColorSpace;
  ctx.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  ctx.renderer.toneMappingExposure = ctx.palette.exposure;
  ctx.renderer.shadowMap.enabled = true;
  ctx.renderer.shadowMap.type = THREE.PCFShadowMap;

  ctx.scene = new THREE.Scene();
  ctx.scene.fog = new THREE.Fog(ctx.palette.fog, ctx.palette.fogNear, ctx.palette.fogFar);

  ctx.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 220);
  ctx.camera.position.set(0, 7.5, 20);
  ctx.camera.lookAt(0, 7.2, 0);

  ctx.rng = makeRng(0x51a7);

  ctx.hemi = new THREE.HemisphereLight(ctx.palette.hemiSky, ctx.palette.hemiGround, ctx.palette.hemiIntensity);
  ctx.scene.add(ctx.hemi);

  ctx.sun = new THREE.DirectionalLight(ctx.palette.sun, ctx.palette.sunIntensity);
  ctx.sun.position.set(-18, 28, 18);
  ctx.sun.castShadow = true;
  ctx.sun.shadow.mapSize.set(2048, 2048);
  ctx.sun.shadow.camera.left = -42;
  ctx.sun.shadow.camera.right = 42;
  ctx.sun.shadow.camera.top = 42;
  ctx.sun.shadow.camera.bottom = -42;
  ctx.sun.shadow.camera.near = 0.5;
  ctx.sun.shadow.camera.far = 110;
  ctx.sun.shadow.bias = -0.0004;
  ctx.sun.shadow.normalBias = 0.025;
  ctx.sun.target.position.set(0, 3, 0);
  ctx.scene.add(ctx.sun);
  ctx.scene.add(ctx.sun.target);

  ctx.fill = new THREE.DirectionalLight(ctx.palette.fill, ctx.palette.fillIntensity);
  ctx.fill.position.set(18, 10, 16);
  ctx.scene.add(ctx.fill);

  ctx.rim = new THREE.DirectionalLight(ctx.palette.accent, 0.35);
  ctx.rim.position.set(0, 8, -20);
  ctx.scene.add(ctx.rim);

  buildIsland();
  buildMountains();
  buildClouds();
  buildSky();
  buildFloaters();
  buildBirds();

  resizeWorld();
  return ctx;
}

export function applyPalette(modeId) {
  const palette = PALETTES[modeId] ?? PALETTES.dawn;
  ctx.palette = palette;
  ctx.mode = modeId;

  if (!ctx.scene) return;

  ctx.scene.fog.color.set(palette.fog);
  ctx.scene.fog.near = palette.fogNear;
  ctx.scene.fog.far = palette.fogFar;
  ctx.renderer.toneMappingExposure = palette.exposure;

  ctx.hemi.color.set(palette.hemiSky);
  ctx.hemi.groundColor.set(palette.hemiGround);
  ctx.hemi.intensity = palette.hemiIntensity;
  ctx.sun.color.set(palette.sun);
  ctx.sun.intensity = palette.sunIntensity;
  ctx.sun.position.set(...(modeId === 'mithila' ? [-24, 16, 14] : [-18, 28, 18]));
  ctx.fill.color.set(palette.fill);
  ctx.fill.intensity = palette.fillIntensity;
  ctx.rim.color.set(palette.accent);
  ctx.rim.intensity = modeId === 'neon' ? 1.1 : modeId === 'mithila' ? 0.62 : 0.35;

  for (const [key, material] of ctx.materials) {
    const color = palette[key];
    if (color) material.color.set(color);
    if (material.userData.glow) {
      const glowKey = material.userData.key;
      material.emissive.set(palette[glowKey] ?? palette.accent);
      material.emissiveIntensity = palette[GLOW_INTENSITY_KEYS[glowKey]] ?? 0.3;
    }
  }

  for (const material of ctx.lineMaterials.values()) {
    const key = material.userData.key;
    if (palette[key]) material.color.set(palette[key]);
  }

  for (const entry of ctx.signMaterials) {
    entry.material.color.set(modeId === 'neon' ? palette.neon : palette.accent);
  }

  for (const entry of ctx.labelMaterials) {
    entry.material.color.set(entry.key === 'accent' ? palette.accent : palette.label);
  }

  for (const entry of ctx.flagMaterials) {
    entry.material.color.set(palette[entry.key] ?? palette.accent);
  }

  for (const light of ctx.neonLights) {
    light.color.set(light.userData.colorKey === 'accent2' ? palette.accent2 : palette.neon);
    light.intensity = modeId === 'neon' ? light.userData.baseIntensity : 0;
  }

  if (ctx.skySprite) {
    ctx.skySprite.material.color.set(palette.sun);
    ctx.skySprite.material.opacity = modeId === 'neon' ? 0.9 : modeId === 'minimal' ? 0.5 : modeId === 'mithila' ? 0.95 : 0.82;
    ctx.skySprite.position.set(...(modeId === 'mithila' ? [-26, 9, -64] : [-20, 18, -62]));
    const skyScale = modeId === 'mithila' ? 30 : 24;
    ctx.skySprite.scale.set(skyScale, skyScale, 1);
  }

  const cloudMaterial = ctx.materials.get('cloud');
  if (cloudMaterial) cloudMaterial.opacity = modeId === 'mithila' ? 0.52 : 0.9;
  const cloudShadeMaterial = ctx.materials.get('cloudShade');
  if (cloudShadeMaterial) cloudShadeMaterial.opacity = modeId === 'mithila' ? 0.38 : 0.72;

  // Janakpur sits on the plains. Keep the low cloud sea, but clear the high
  // cloud shelf so the dusk sky belongs to the temple and the kites.
  for (const cloud of ctx.baseAnim.clouds) {
    cloud.mesh.visible = modeId !== 'mithila' || cloud.mesh.position.y < 0;
  }

  if (ctx.qrHalo) {
    ctx.qrHalo.material.color.set(palette.qrGlow);
    ctx.qrHalo.material.opacity = modeId === 'neon' ? 0.34 : modeId === 'mithila' ? 0.24 : modeId === 'minimal' ? 0.06 : 0.12;
  }

  if (ctx.groundQR) {
    ctx.groundQR.material.needsUpdate = true;
  }
}

export function resizeWorld() {
  if (!ctx.renderer || !ctx.camera) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const narrow = width <= 760;
  const tablet = width > 760 && width <= 1100;
  ctx.narrow = narrow;
  ctx.camera.aspect = width / height;
  ctx.camera.fov = narrow ? 52 : tablet ? 46 : 42;
  ctx.camera.updateProjectionMatrix();
  ctx.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.4 : 1.75));
  ctx.renderer.setSize(width, height);
}

export function updateBase(time, reduceMotion = false) {
  if (reduceMotion) return;

  for (const cloud of ctx.baseAnim.clouds) {
    cloud.mesh.position.x = cloud.baseX + Math.sin(time * cloud.speed + cloud.phase) * cloud.drift;
  }

  for (const floater of ctx.baseAnim.floaters) {
    floater.group.position.y = floater.baseY + Math.sin(time * floater.speed + floater.phase) * 0.35;
    floater.group.rotation.y += 0.0012;
  }

  for (const bird of ctx.baseAnim.birds) {
    const angle = time * bird.speed + bird.phase;
    bird.group.position.x = bird.center.x + Math.cos(angle) * bird.radius;
    bird.group.position.z = bird.center.z + Math.sin(angle) * bird.radius;
    bird.group.position.y = bird.center.y + Math.sin(angle * 1.7) * 0.5;
    bird.group.rotation.y = -angle + Math.PI / 2;
    const flap = Math.sin(time * bird.flap + bird.phase) * 0.35;
    bird.left.rotation.z = 0.28 + flap;
    bird.right.rotation.z = -0.28 - flap;
  }
}

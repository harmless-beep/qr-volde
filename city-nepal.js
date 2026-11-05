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
import { makePrayerFlagLine } from './city-life.js';

/* -------------------------------------------------------------------------
   Nepal Atlas
   A raised relief map behind the QR plaza. Six landmark vignettes mark the
   country's greatest feats: Everest, Lumbini, Chitwan, Kathmandu, Pokhara,
   and Janakpur. All geometry and the map plate are original procedural work.
------------------------------------------------------------------------- */

const rng = makeRng(0x4e455041);
const props = [];
const landmarks = [];
const flags = [];
const bells = [];
const boats = [];
const paragliders = [];
const rhinos = [];
const lotuses = [];
const routeDots = [];

let nepalGroup = null;
let mapBoard = null;
let routeCurve = null;
let routeGlow = null;

const BOARD_WIDTH = 16;
const BOARD_DEPTH = 6.5;
const BOARD_Y = 0.6;
const BOARD_Z = -12.7;
const BOARD_TOP = 0.405;

// A simplified Natural Earth outline, reduced to 74 points. The map is a
// stylised atlas plate, not a survey.
const NEPAL_OUTLINE = [
  [88.10977, 27.87061], [88.14697, 27.74922], [87.98438, 27.13394], [88.15723, 26.80732],
  [88.05488, 26.43003], [87.99512, 26.38237], [87.84922, 26.43691], [87.6334, 26.39912],
  [87.41357, 26.42295], [87.2874, 26.3603], [87.08955, 26.4332], [87.01641, 26.55542],
  [86.70137, 26.43506], [86.36611, 26.57441], [86.00732, 26.64936], [85.79453, 26.60415],
  [85.64844, 26.829], [85.29297, 26.74102], [85.1918, 26.76655], [85.12539, 26.86099],
  [84.68535, 27.04102], [84.61016, 27.29868], [84.09102, 27.49136], [83.82881, 27.37783],
  [83.44717, 27.46533], [83.28975, 27.371], [82.7334, 27.51899], [82.67734, 27.67344],
  [82.45137, 27.67183], [81.9877, 27.91377], [81.85264, 27.86709], [81.31084, 28.17637],
  [81.16895, 28.33501], [80.58701, 28.64961], [80.51787, 28.66519], [80.4791, 28.60488],
  [80.41855, 28.61201], [80.05166, 28.87031], [80.13047, 29.10039], [80.23301, 29.19463],
  [80.3169, 29.57207], [80.61289, 29.95586], [80.90762, 30.17192], [81.01025, 30.1645],
  [81.11035, 30.03682], [81.17715, 30.03989], [81.41719, 30.3376], [81.6419, 30.3875],
  [81.85488, 30.3624], [82.04336, 30.32676], [82.2207, 30.06387], [82.48652, 29.9415],
  [82.8543, 29.6834], [83.15547, 29.61265], [83.5835, 29.18359], [83.93594, 29.27949],
  [84.10137, 29.21997], [84.22871, 28.91177], [84.79688, 28.5602], [85.15908, 28.59224],
  [85.08857, 28.37227], [85.12246, 28.31597], [85.67832, 28.27744], [85.99453, 27.9104],
  [86.06416, 27.93472], [86.07871, 28.08359], [86.13701, 28.11435], [86.40869, 27.92866],
  [86.5169, 27.96353], [86.55449, 28.0852], [86.61445, 28.10303], [87.14141, 27.83833],
  [87.62256, 27.81519], [87.86074, 27.88608],
];

const MAP_LON_MIN = 80.0;
const MAP_LON_MAX = 88.25;
const MAP_LAT_MIN = 26.3;
const MAP_LAT_MAX = 30.45;
const MAP_X0 = 0.045;
const MAP_X1 = 0.955;
const MAP_Y0 = 0.12;
const MAP_Y1 = 0.88;

const FEATS = [
  {
    id: 'everest',
    name: 'EVEREST',
    sub: "8,849 M · WORLD'S HIGHEST",
    nx: 0.76,
    ny: 0.36,
    dx: 32,
    dy: -52,
    align: 'left',
  },
  {
    id: 'kathmandu',
    name: 'KATHMANDU',
    sub: 'CITY OF TEMPLES',
    nx: 0.58,
    ny: 0.49,
    dx: -26,
    dy: 58,
    align: 'right',
  },
  {
    id: 'pokhara',
    name: 'POKHARA',
    sub: 'ANNAPURNA GATEWAY',
    nx: 0.40,
    ny: 0.45,
    dx: -28,
    dy: -48,
    align: 'right',
  },
  {
    id: 'lumbini',
    name: 'LUMBINI',
    sub: "BUDDHA'S BIRTHPLACE",
    nx: 0.30,
    ny: 0.67,
    dx: -30,
    dy: 58,
    align: 'right',
  },
  {
    id: 'chitwan',
    name: 'CHITWAN',
    sub: 'ONE-HORNED RHINO',
    nx: 0.47,
    ny: 0.65,
    dx: 24,
    dy: 60,
    align: 'left',
  },
  {
    id: 'janakpur',
    name: 'JANAKPUR',
    sub: 'JANAKI MANDIR',
    nx: 0.68,
    ny: 0.71,
    dx: 30,
    dy: -48,
    align: 'left',
  },
];

function projectLonLat(lon, lat, width, height) {
  const nx = MAP_X0 + ((lon - MAP_LON_MIN) / (MAP_LON_MAX - MAP_LON_MIN)) * (MAP_X1 - MAP_X0);
  const ny = MAP_Y0 + ((MAP_LAT_MAX - lat) / (MAP_LAT_MAX - MAP_LAT_MIN)) * (MAP_Y1 - MAP_Y0);
  return { x: nx * width, y: ny * height };
}

function featPoint(feat) {
  return {
    x: (feat.nx - 0.5) * BOARD_WIDTH,
    z: (feat.ny - 0.5) * BOARD_DEPTH,
  };
}

function traceNepal(context, width, height) {
  context.beginPath();
  NEPAL_OUTLINE.forEach(([lon, lat], index) => {
    const point = projectLonLat(lon, lat, width, height);
    if (index === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.closePath();
}

function makeNepalMapTexture() {
  const width = 2048;
  const height = 832;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return null;

  const background = context.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, '#1b2438');
  background.addColorStop(0.55, '#141d2f');
  background.addColorStop(1, '#0e1524');
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  context.save();
  context.strokeStyle = 'rgba(236, 214, 166, 0.055)';
  context.lineWidth = 1;
  for (let x = 0; x < width; x += 128) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 0; y < height; y += 104) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
  context.restore();

  context.strokeStyle = 'rgba(217, 164, 65, 0.55)';
  context.lineWidth = 10;
  context.strokeRect(18, 18, width - 36, height - 36);
  context.strokeStyle = 'rgba(217, 164, 65, 0.22)';
  context.lineWidth = 2;
  context.strokeRect(36, 36, width - 72, height - 72);

  const glow = context.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.46);
  glow.addColorStop(0, 'rgba(126, 166, 138, 0.16)');
  glow.addColorStop(0.65, 'rgba(126, 166, 138, 0.06)');
  glow.addColorStop(1, 'rgba(126, 166, 138, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  context.save();
  context.shadowColor = 'rgba(0, 0, 0, 0.45)';
  context.shadowBlur = 34;
  context.shadowOffsetY = 14;
  traceNepal(context, width, height);
  context.fillStyle = '#2b3a37';
  context.fill();
  context.restore();

  context.save();
  traceNepal(context, width, height);
  context.clip();

  const terrain = context.createLinearGradient(0, height * 0.1, 0, height * 0.9);
  terrain.addColorStop(0, '#e7f0ed');
  terrain.addColorStop(0.18, '#c8dcd4');
  terrain.addColorStop(0.38, '#9db89a');
  terrain.addColorStop(0.58, '#7f9d6b');
  terrain.addColorStop(0.78, '#b08a5f');
  terrain.addColorStop(1, '#d2a66e');
  context.fillStyle = terrain;
  context.fillRect(0, 0, width, height);

  // Soft contour bands give the plate a relief-map feel without using an
  // external heightmap.
  for (let i = 0; i < 9; i += 1) {
    const y = height * (0.2 + i * 0.075);
    context.beginPath();
    context.moveTo(0, y);
    for (let x = 0; x <= width; x += 64) {
      const wave = Math.sin(x * 0.006 + i * 1.7) * 18 + Math.sin(x * 0.013 + i) * 9;
      context.lineTo(x, y + wave);
    }
    context.strokeStyle = i < 4 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(62, 74, 48, 0.1)';
    context.lineWidth = 2;
    context.stroke();
  }

  // Three great river systems, simplified.
  const rivers = [
    [[0.78, 0.14], [0.74, 0.3], [0.79, 0.48], [0.72, 0.68], [0.76, 0.86]],
    [[0.45, 0.12], [0.47, 0.3], [0.42, 0.48], [0.46, 0.66], [0.4, 0.86]],
    [[0.18, 0.16], [0.23, 0.32], [0.2, 0.5], [0.27, 0.68], [0.24, 0.84]],
  ];
  context.strokeStyle = 'rgba(115, 184, 194, 0.58)';
  context.lineWidth = 4;
  context.lineCap = 'round';
  for (const river of rivers) {
    context.beginPath();
    river.forEach(([nx, ny], index) => {
      const x = nx * width;
      const y = ny * height;
      if (index === 0) context.moveTo(x, y);
      else {
        const previous = river[index - 1];
        const cx = ((previous[0] + nx) / 2) * width;
        const cy = ((previous[1] + ny) / 2) * height;
        context.quadraticCurveTo(cx, cy, x, y);
      }
    });
    context.stroke();
  }

  // A dashed route links the six feats.
  const route = FEATS.map((feat) => ({
    x: feat.nx * width,
    y: feat.ny * height,
  }));
  context.setLineDash([12, 14]);
  context.strokeStyle = 'rgba(242, 199, 110, 0.8)';
  context.lineWidth = 3;
  context.beginPath();
  route.forEach((point, index) => {
    if (index === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.stroke();
  context.setLineDash([]);
  context.restore();

  context.save();
  traceNepal(context, width, height);
  context.strokeStyle = 'rgba(255, 244, 214, 0.82)';
  context.lineWidth = 4;
  context.stroke();
  context.restore();

  // Small mountain marks along the northern wall.
  context.fillStyle = 'rgba(255, 250, 238, 0.55)';
  for (let i = 0; i < 17; i += 1) {
    const x = width * (0.1 + i * 0.048);
    const y = height * (0.19 + Math.sin(i * 1.9) * 0.025);
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + 9, y - 15);
    context.lineTo(x + 18, y);
    context.closePath();
    context.fill();
  }

  // Location markers only. The six 3D vignettes sit on these points, and the
  // cartouche names them, so the plate stays readable instead of stacking
  // labels underneath the models.
  for (const feat of FEATS) {
    const x = feat.nx * width;
    const y = feat.ny * height;

    context.fillStyle = 'rgba(20, 29, 47, 0.78)';
    context.beginPath();
    context.arc(x, y, 15, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = '#f2c76e';
    context.lineWidth = 3;
    context.beginPath();
    context.arc(x, y, 12, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = '#fff4d8';
    context.beginPath();
    context.arc(x, y, 4.5, 0, Math.PI * 2);
    context.fill();
  }

  // Compass rose.
  const cx = width - 92;
  const cy = height - 100;
  context.save();
  context.translate(cx, cy);
  context.strokeStyle = 'rgba(242, 199, 110, 0.8)';
  context.fillStyle = 'rgba(242, 199, 110, 0.9)';
  context.lineWidth = 2;
  context.beginPath();
  context.arc(0, 0, 42, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.moveTo(0, -34);
  context.lineTo(9, 6);
  context.lineTo(0, 0);
  context.lineTo(-9, 6);
  context.closePath();
  context.fill();
  context.font = '700 22px "Segoe UI", sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('N', 0, -58);
  context.restore();

  // Scale bar.
  context.save();
  context.translate(82, height - 70);
  context.strokeStyle = 'rgba(255, 244, 216, 0.72)';
  context.fillStyle = 'rgba(255, 244, 216, 0.72)';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(150, 0);
  context.moveTo(0, -5);
  context.lineTo(0, 5);
  context.moveTo(75, -4);
  context.lineTo(75, 4);
  context.moveTo(150, -5);
  context.lineTo(150, 5);
  context.stroke();
  context.font = '600 18px "Segoe UI", sans-serif';
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.fillText('0', 0, 12);
  context.fillText('100', 62, 12);
  context.fillText('200 KM', 125, 12);
  context.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = Math.min(4, ctx.renderer?.capabilities.getMaxAnisotropy() ?? 1);
  return texture;
}

function makePlaqueTexture(title, subtitle) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 160;
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.clearRect(0, 0, 1024, 160);
  context.strokeStyle = 'rgba(217, 164, 65, 0.9)';
  context.lineWidth = 3;
  context.strokeRect(5, 5, 1014, 150);
  context.strokeStyle = 'rgba(217, 164, 65, 0.35)';
  context.lineWidth = 1;
  context.strokeRect(16, 16, 992, 128);

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = '#f7e7c4';
  context.font = '700 64px "Iowan Old Style", "Palatino Linotype", Georgia, serif';
  context.fillText(title, 512, 64);
  context.fillStyle = '#d9a441';
  context.font = '600 24px "Segoe UI", sans-serif';
  context.fillText(subtitle, 512, 118);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function addNepalProp(group, delay = 0) {
  nepalGroup.add(group);
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

function addNepalLandmark(group, delay = 0) {
  mapBoard.add(group);
  const baseScale = group.scale.clone();
  group.scale.copy(baseScale).multiplyScalar(0.001);
  group.visible = false;
  landmarks.push({
    group,
    baseScale,
    delay,
    baseY: group.position.y,
    baseRotY: group.rotation.y,
  });
  return group;
}

function makePrayerLine(parent, start, end, count = 9, sag = 0.35) {
  const lineFlags = makePrayerFlagLine(parent, start, end, {
    count,
    sag,
    colors: ['accent', 'white', 'accent2', 'gold', 'leaf'],
  });
  for (const flag of lineFlags) flags.push(flag);
  return lineFlags;
}

function makeEverest() {
  const group = new THREE.Group();

  addCone(group, 0.82, 2.25, 5, 0, 1.12, 0, 'stoneDark');
  addCone(group, 0.43, 0.86, 5, 0, 1.94, 0, 'snow', { castShadow: false });
  addCone(group, 0.56, 1.55, 5, -0.72, 0.78, 0.18, 'stoneDark');
  addCone(group, 0.29, 0.6, 5, -0.72, 1.34, 0.18, 'snow', { castShadow: false });
  addCone(group, 0.5, 1.3, 5, 0.68, 0.65, 0.22, 'stoneDark');
  addCone(group, 0.26, 0.5, 5, 0.68, 1.12, 0.22, 'snow', { castShadow: false });

  addCylinder(group, 0.03, 0.04, 1.4, 6, 1.32, 0.7, 0.5, 'woodDark');
  addCylinder(group, 0.03, 0.04, 1.15, 6, -1.28, 0.58, 0.55, 'woodDark');
  addBox(group, 0.24, 0.14, 0.02, 1.42, 1.3, 0.5, 'accent', { castShadow: false });
  makePrayerLine(
    group,
    new THREE.Vector3(1.32, 1.36, 0.5),
    new THREE.Vector3(-1.28, 1.12, 0.55),
    10,
    0.32,
  );

  for (let i = 0; i < 4; i += 1) {
    addSphere(group, 0.12 - i * 0.02, 1.62, 0.14 + i * 0.08, 0.62, i % 2 ? 'stone' : 'stoneDark', {
      widthSegments: 5,
      heightSegments: 4,
      castShadow: false,
    });
  }

  addBox(group, 0.24, 0.24, 0.24, 1.55, 0.12, 0.72, 'stoneDark');
  addBox(group, 0.3, 0.04, 0.3, 1.55, 0.26, 0.72, 'gold', { castShadow: false });

  return group;
}

function makeKathmandu() {
  const group = new THREE.Group();

  addBox(group, 1.65, 0.14, 1.55, 0, 0.07, 0, 'stoneDark');
  addBox(group, 1.3, 0.6, 1.2, 0, 0.44, 0, 'brick');
  addBox(group, 1.34, 0.08, 1.24, 0, 0.76, 0, 'stone');

  for (let i = 0; i < 3; i += 1) {
    const width = 1.12 - i * 0.2;
    addBox(group, width, 0.24, width, 0, 0.9 + i * 0.42, 0, 'wall');
    addCone(group, width * 0.76, 0.3, 4, 0, 1.08 + i * 0.42, 0, 'roof', {
      rotY: Math.PI / 4,
      castShadow: true,
    });
    addBox(group, width * 1.18, 0.055, width * 1.18, 0, 0.94 + i * 0.42, 0, 'roofDark', {
      castShadow: false,
    });
  }

  addCylinder(group, 0.04, 0.06, 0.5, 6, 0, 2.35, 0, 'gold');
  addSphere(group, 0.1, 0, 2.62, 0, 'gold', { widthSegments: 6, heightSegments: 5 });

  addBox(group, 0.78, 0.62, 0.55, 1.02, 0.36, 0.2, 'wallWarm');
  addBox(group, 0.84, 0.08, 0.62, 1.02, 0.72, 0.2, 'roof');
  for (let i = 0; i < 2; i += 1) {
    addBox(group, 0.11, 0.18, 0.02, 0.86 + i * 0.3, 0.46, 0.49, 'window', { castShadow: false });
  }

  addBox(group, 0.09, 0.45, 0.09, -1.05, 0.22, 0.48, 'woodDark');
  const bell = addCone(group, 0.08, 0.2, 6, -1.05, 0.52, 0.48, 'gold');
  bells.push({ mesh: bell, baseRotZ: bell.rotation.z, phase: rng() * Math.PI * 2 });

  makePrayerLine(
    group,
    new THREE.Vector3(-1.05, 1.15, 0.48),
    new THREE.Vector3(1.2, 1.0, -0.45),
    8,
    0.3,
  );

  return group;
}

function makeLumbini() {
  const group = new THREE.Group();

  addCylinder(group, 1.0, 1.0, 0.06, 18, 0, 0.03, 0.2, 'water', { castShadow: false });
  addCylinder(group, 0.62, 0.72, 0.34, 10, -0.28, 0.2, 0, 'white');
  addSphere(group, 0.48, -0.28, 0.56, 0, 'white', { widthSegments: 10, heightSegments: 8 });
  addCone(group, 0.19, 0.6, 8, -0.28, 1.08, 0, 'gold');
  addCylinder(group, 0.03, 0.05, 0.28, 6, -0.28, 1.45, 0, 'gold');

  addCylinder(group, 0.08, 0.1, 1.5, 8, 0.88, 0.75, 0.15, 'stone');
  addBox(group, 0.28, 0.2, 0.28, 0.88, 1.58, 0.15, 'gold');
  addSphere(group, 0.11, 0.88, 1.74, 0.15, 'gold', { widthSegments: 6, heightSegments: 5 });

  addCylinder(group, 0.08, 0.12, 0.9, 6, -1.18, 0.45, 0.38, 'woodDark');
  addSphere(group, 0.38, -1.18, 1.0, 0.38, 'leaf', { widthSegments: 7, heightSegments: 5 });
  addSphere(group, 0.27, -1.5, 0.9, 0.5, 'leafDark', { widthSegments: 6, heightSegments: 5 });
  addSphere(group, 0.24, -0.9, 0.88, 0.55, 'leaf', { widthSegments: 6, heightSegments: 5 });

  for (let i = 0; i < 7; i += 1) {
    const angle = (i / 7) * Math.PI * 2;
    const lotus = new THREE.Group();
    addCone(lotus, 0.06, 0.14, 5, 0, 0.07, 0, 'lotus', { castShadow: false });
    addSphere(lotus, 0.035, 0, 0.12, 0, 'marigold', {
      widthSegments: 5,
      heightSegments: 4,
      castShadow: false,
    });
    lotus.position.set(Math.cos(angle) * 0.72, 0.08, 0.2 + Math.sin(angle) * 0.42);
    group.add(lotus);
    lotuses.push({ group: lotus, baseY: lotus.position.y, phase: rng() * Math.PI * 2 });
  }

  makePrayerLine(
    group,
    new THREE.Vector3(0.88, 1.82, 0.15),
    new THREE.Vector3(-1.18, 1.55, 0.38),
    7,
    0.26,
  );

  return group;
}

function makeChitwan() {
  const group = new THREE.Group();

  addCylinder(group, 1.15, 1.15, 0.045, 14, 0, 0.02, 0.15, 'grassDark', { castShadow: false });

  const rhino = new THREE.Group();
  addBox(rhino, 0.95, 0.46, 0.55, 0, 0.52, 0, 'stoneDark');
  addBox(rhino, 0.72, 0.12, 0.45, 0, 0.28, 0, 'stone');
  addBox(rhino, 0.42, 0.38, 0.46, 0.55, 0.55, 0.1, 'stoneDark');
  addBox(rhino, 0.3, 0.26, 0.3, 0.82, 0.45, 0.12, 'stoneDark');
  addCone(rhino, 0.07, 0.3, 6, 0.99, 0.6, 0.12, 'white', {
    rotZ: -Math.PI / 2,
    castShadow: false,
  });
  addCone(rhino, 0.06, 0.16, 5, 0.52, 0.82, 0.02, 'stoneDark', { rotZ: -0.3 });
  addCone(rhino, 0.06, 0.16, 5, 0.52, 0.82, 0.22, 'stoneDark', { rotZ: 0.3 });
  addSphere(rhino, 0.025, 0.66, 0.64, 0.0, 'dark', { widthSegments: 4, heightSegments: 3, castShadow: false });
  addSphere(rhino, 0.025, 0.66, 0.64, 0.22, 'dark', { widthSegments: 4, heightSegments: 3, castShadow: false });

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      addBox(rhino, 0.15, 0.42, 0.15, sx * 0.3, 0.22, sz * 0.19, 'stoneDark');
    }
  }
  const tail = addBox(rhino, 0.05, 0.05, 0.35, -0.5, 0.62, -0.2, 'stoneDark', {
    rotX: 0.4,
    castShadow: false,
  });
  const head = rhino.children[2];
  rhino.position.set(-0.1, 0, 0.2);
  group.add(rhino);
  rhinos.push({
    group: rhino,
    head,
    tail,
    baseY: rhino.position.y,
    phase: rng() * Math.PI * 2,
  });

  const bird = new THREE.Group();
  addSphere(bird, 0.09, 0, 0, 0, 'white', { widthSegments: 6, heightSegments: 5 });
  addCone(bird, 0.035, 0.09, 4, 0.09, 0.02, 0, 'marigold', {
    rotZ: -Math.PI / 2,
    castShadow: false,
  });
  bird.position.set(-0.08, 0.8, 0.2);
  group.add(bird);
  rhinos[rhinos.length - 1].bird = bird;

  for (let i = 0; i < 20; i += 1) {
    const angle = rng() * Math.PI * 2;
    const radius = 0.5 + rng() * 0.8;
    const height = 0.22 + rng() * 0.34;
    addCone(
      group,
      0.035,
      height,
      4,
      Math.cos(angle) * radius,
      0.04 + height / 2,
      0.15 + Math.sin(angle) * radius,
      i % 3 ? 'grassDark' : 'leafDark',
      { castShadow: false },
    );
  }

  return group;
}

function makePokhara() {
  const group = new THREE.Group();

  addCylinder(group, 1.05, 1.05, 0.05, 18, 0, 0.03, 0.18, 'water', { castShadow: false });

  const boat = new THREE.Group();
  addBox(boat, 0.48, 0.08, 0.18, 0, 0.08, 0, 'woodDark');
  addBox(boat, 0.26, 0.06, 0.14, 0.06, 0.13, 0, 'wood');
  addCylinder(boat, 0.015, 0.015, 0.38, 4, -0.12, 0.3, 0, 'woodDark');
  addSphere(boat, 0.055, 0.08, 0.2, 0, 'skin', { widthSegments: 5, heightSegments: 4 });
  boat.position.set(0.25, 0.06, 0.2);
  boat.rotation.y = 0.45;
  group.add(boat);
  boats.push({ group: boat, baseY: boat.position.y, phase: rng() * Math.PI * 2 });

  addCone(group, 0.58, 1.8, 5, -1.0, 0.9, -0.55, 'stoneDark');
  addCone(group, 0.3, 0.95, 5, -0.86, 1.65, -0.55, 'snow', { castShadow: false });
  addCone(group, 0.34, 1.0, 5, -1.3, 0.5, -0.5, 'stoneDark');

  const glider = new THREE.Group();
  for (let i = 0; i < 5; i += 1) {
    addSphere(glider, 0.16, (i - 2) * 0.22, 0, 0, i % 2 ? 'accent' : 'gold', {
      widthSegments: 6,
      heightSegments: 4,
      scale: [1.25, 0.32, 0.55],
      castShadow: false,
    });
  }
  addLine(glider, [
    new THREE.Vector3(-0.42, 0, 0),
    new THREE.Vector3(0, -0.52, 0),
    new THREE.Vector3(0.42, 0, 0),
  ], 'dark', 0.45);
  addBox(glider, 0.07, 0.2, 0.07, 0, -0.6, 0, 'accent');
  addSphere(glider, 0.06, 0, -0.72, 0, 'skin', { widthSegments: 5, heightSegments: 4 });
  glider.position.set(0.1, 2.5, 0.1);
  group.add(glider);
  paragliders.push({
    group: glider,
    centerX: 0.1,
    centerZ: 0.1,
    radius: 1.15,
    baseY: 2.5,
    phase: rng() * Math.PI * 2,
    speed: 0.35,
  });

  return group;
}

function makeJanakpur() {
  const group = new THREE.Group();

  addBox(group, 1.35, 0.12, 0.9, 0, 0.06, 0, 'stone');
  addBox(group, 0.2, 1.1, 0.2, -0.48, 0.65, 0, 'woodDark');
  addBox(group, 0.2, 1.1, 0.2, 0.48, 0.65, 0, 'woodDark');
  addBox(group, 1.22, 0.22, 0.24, 0, 1.28, 0, 'accent');
  addBox(group, 1.28, 0.05, 0.28, 0, 1.42, 0, 'gold', { castShadow: false });

  for (let i = 0; i < 3; i += 1) {
    addBox(group, 0.24, 0.42, 0.05, -0.32 + i * 0.32, 0.78, 0.12, i % 2 ? 'accent2' : 'gold', {
      castShadow: false,
    });
    addBox(group, 0.12, 0.12, 0.06, -0.32 + i * 0.32, 0.78, 0.15, 'white', { castShadow: false });
  }

  addCone(group, 0.68, 0.38, 4, 0, 1.58, 0, 'roof', { rotY: Math.PI / 4 });
  addCylinder(group, 0.03, 0.045, 0.35, 5, 0, 1.88, 0, 'gold');
  addSphere(group, 0.07, 0, 2.05, 0, 'gold', { widthSegments: 5, heightSegments: 4 });

  const bell = addCone(group, 0.06, 0.15, 6, 0.68, 1.45, 0.08, 'gold');
  bells.push({ mesh: bell, baseRotZ: bell.rotation.z, phase: rng() * Math.PI * 2 });

  makePrayerLine(
    group,
    new THREE.Vector3(-0.72, 1.5, 0.2),
    new THREE.Vector3(0.72, 1.45, 0.2),
    6,
    0.2,
  );

  return group;
}

function makeMapBoard() {
  const group = new THREE.Group();

  addBox(group, BOARD_WIDTH + 0.4, 0.34, BOARD_DEPTH + 0.4, 0, 0.17, 0, 'woodDark');
  addBox(group, BOARD_WIDTH + 0.1, 0.06, BOARD_DEPTH + 0.1, 0, 0.37, 0, 'gold', {
    castShadow: false,
  });

  const mapTexture = makeNepalMapTexture();
  if (mapTexture) {
    const top = new THREE.Mesh(
      new THREE.PlaneGeometry(BOARD_WIDTH, BOARD_DEPTH),
      new THREE.MeshBasicMaterial({ map: mapTexture, toneMapped: false }),
    );
    top.rotation.x = -Math.PI / 2;
    top.position.y = BOARD_TOP;
    top.receiveShadow = true;
    group.add(top);
  }

  addBox(group, BOARD_WIDTH + 0.4, 0.08, 0.1, 0, 0.43, -BOARD_DEPTH / 2 - 0.15, 'gold', {
    castShadow: false,
  });
  addBox(group, BOARD_WIDTH + 0.4, 0.08, 0.1, 0, 0.43, BOARD_DEPTH / 2 + 0.15, 'gold', {
    castShadow: false,
  });
  addBox(group, 0.1, 0.08, BOARD_DEPTH + 0.4, -BOARD_WIDTH / 2 - 0.15, 0.43, 0, 'gold', {
    castShadow: false,
  });
  addBox(group, 0.1, 0.08, BOARD_DEPTH + 0.4, BOARD_WIDTH / 2 + 0.15, 0.43, 0, 'gold', {
    castShadow: false,
  });

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      addCylinder(group, 0.07, 0.07, 0.05, 8, sx * (BOARD_WIDTH / 2 + 0.05), 0.44, sz * (BOARD_DEPTH / 2 + 0.05), 'gold', {
        castShadow: false,
      });
    }
  }

  const plaqueTexture = makePlaqueTexture('NEPAL', 'THE GREATEST FEATS');
  if (plaqueTexture) {
    addBox(group, 5.75, 0.98, 0.05, 0, 0.32, BOARD_DEPTH / 2 + 0.21, 'woodDark', {
      castShadow: false,
    });
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(5.6, 0.875),
      new THREE.MeshBasicMaterial({
        map: plaqueTexture,
        transparent: true,
        toneMapped: false,
      }),
    );
    plaque.position.set(0, 0.32, BOARD_DEPTH / 2 + 0.24);
    group.add(plaque);
  }

  routeCurve = new THREE.CatmullRomCurve3(
    FEATS.map((feat) => {
      const point = featPoint(feat);
      return new THREE.Vector3(point.x, BOARD_TOP + 0.08, point.z);
    }),
    false,
    'catmullrom',
    0.3,
  );
  routeGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture('rgba(255,236,190,0.95)', 'rgba(255,236,190,0)'),
    color: 0xf2c76e,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    toneMapped: false,
  }));
  routeGlow.scale.set(0.55, 0.55, 1);
  group.add(routeGlow);

  return group;
}

export function buildNepal() {
  nepalGroup = new THREE.Group();
  nepalGroup.name = 'nepal';
  nepalGroup.visible = false;
  ctx.scene.add(nepalGroup);

  mapBoard = makeMapBoard();
  mapBoard.position.set(0, BOARD_Y, BOARD_Z);
  addNepalProp(mapBoard, 0.2);

  const placements = {
    everest: makeEverest(),
    kathmandu: makeKathmandu(),
    pokhara: makePokhara(),
    lumbini: makeLumbini(),
    chitwan: makeChitwan(),
    janakpur: makeJanakpur(),
  };

  let index = 0;
  for (const feat of FEATS) {
    const group = placements[feat.id];
    if (!group) continue;
    const point = featPoint(feat);
    group.position.set(point.x, BOARD_TOP, point.z);
    addNepalLandmark(group, 0.3 + index * 0.035);
    index += 1;
  }

  const light = new THREE.PointLight(0xffd9a0, 8, 19, 2);
  light.position.set(0, 4.2, BOARD_Z + 1.5);
  nepalGroup.add(light);

  const fill = new THREE.PointLight(0x9fd8d2, 3.5, 14, 2);
  fill.position.set(-6, 2.6, BOARD_Z + 2.5);
  nepalGroup.add(fill);
}

export function setNepalVisible(visible) {
  if (nepalGroup) nepalGroup.visible = visible;
}

export function updateNepal(progress, time, reduceMotion = false) {
  if (!nepalGroup || !nepalGroup.visible) return;

  const reveal = smoothstep(0.18, 0.45, progress);
  for (const prop of props) {
    const t = smoothstep(0, 1, clamp((reveal - prop.delay) / 0.36, 0, 1));
    prop.group.visible = t > 0.01;
    prop.group.scale.copy(prop.baseScale).multiplyScalar(t);
  }

  const detail = smoothstep(0.22, 0.55, progress);
  for (const landmark of landmarks) {
    const t = smoothstep(0, 1, clamp((detail - landmark.delay) / 0.34, 0, 1));
    landmark.group.visible = t > 0.01;
    landmark.group.scale.copy(landmark.baseScale).multiplyScalar(t);
  }

  if (reduceMotion) return;

  for (const flag of flags) {
    if (!flag.visible) continue;
    flag.rotation.z = flag.userData.baseRotation + Math.sin(time * 1.7 + flag.userData.phase) * 0.14;
  }

  for (const bell of bells) {
    bell.mesh.rotation.z = bell.baseRotZ + Math.sin(time * 2.1 + bell.phase) * 0.18;
  }

  for (const boat of boats) {
    boat.group.position.y = boat.baseY + Math.sin(time * 1.4 + boat.phase) * 0.018;
    boat.group.rotation.z = Math.sin(time * 1.1 + boat.phase) * 0.03;
  }

  for (const paraglider of paragliders) {
    const angle = time * paraglider.speed + paraglider.phase;
    paraglider.group.position.set(
      paraglider.centerX + Math.cos(angle) * paraglider.radius,
      paraglider.baseY + Math.sin(time * 0.8 + paraglider.phase) * 0.12,
      paraglider.centerZ + Math.sin(angle) * paraglider.radius,
    );
    paraglider.group.rotation.y = -angle + Math.PI / 2;
  }

  for (const rhino of rhinos) {
    if (!rhino.group.visible) continue;
    rhino.group.position.y = rhino.baseY + Math.sin(time * 0.9 + rhino.phase) * 0.01;
    if (rhino.head) rhino.head.rotation.x = Math.sin(time * 0.8 + rhino.phase) * 0.04;
    if (rhino.tail) rhino.tail.rotation.x = 0.4 + Math.sin(time * 2.2 + rhino.phase) * 0.18;
    if (rhino.bird) rhino.bird.position.y = 0.8 + Math.sin(time * 2.6 + rhino.phase) * 0.015;
  }

  for (const lotus of lotuses) {
    lotus.group.position.y = lotus.baseY + Math.sin(time * 1.1 + lotus.phase) * 0.01;
  }

  if (routeCurve && routeGlow && routeCurve.points.length > 1) {
    const t = Math.max(0, (time * 0.035) % 1);
    routeCurve.getPointAt(t, routeGlow.position);
    routeGlow.position.y += 0.06;
    routeGlow.material.opacity = 0.65 + Math.sin(time * 3.2) * 0.2;
  }
}

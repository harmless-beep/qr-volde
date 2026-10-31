import * as THREE from 'three';
import {
  ctx,
  addBox,
  addCylinder,
  addCone,
  addSphere,
  addLine,
  getMaterial,
  makeRng,
} from './scene-world.js';

const rng = makeRng(0x6a09e667);

export function makePerson(options = {}) {
  const group = new THREE.Group();
  const scale = options.scale ?? 1;
  const shirt = options.shirt ?? 'cloth';
  const pants = options.pants ?? 'dark';
  const skin = options.skin ?? 'skin';
  const shawl = options.shawl ?? null;
  const bag = options.bag ?? false;
  const hat = options.hat ?? false;
  const basket = options.basket ?? false;
  const sari = options.sari ?? false;
  const dhoti = options.dhoti ?? false;
  const bun = options.bun ?? false;
  const tika = options.tika ?? false;
  const tray = options.tray ?? false;

  group.scale.setScalar(scale);

  addBox(group, 0.13, 0.55, 0.15, -0.1, 0.29, 0, pants);
  addBox(group, 0.13, 0.55, 0.15, 0.1, 0.29, 0, pants);
  addCylinder(group, 0.17, 0.23, 0.64, 6, 0, 1.0, 0, shirt);
  addSphere(group, 0.17, 0, 1.46, 0, skin, { widthSegments: 7, heightSegments: 5 });
  addSphere(group, 0.155, 0, 1.48, 0.04, skin, { widthSegments: 6, heightSegments: 4 });

  if (sari) {
    addCylinder(group, 0.18, 0.32, 0.92, 7, 0, 0.44, 0, shirt);
    addBox(group, 0.14, 0.6, 0.05, -0.22, 1.15, 0.15, shirt, { rotZ: 0.1, castShadow: false });
    addBox(group, 0.035, 0.6, 0.02, -0.28, 1.15, 0.18, 'gold', { rotZ: 0.1, castShadow: false });
    addBox(group, 0.34, 0.04, 0.24, 0, 0.62, 0, 'gold', { castShadow: false });
  }

  if (dhoti) {
    addBox(group, 0.42, 0.28, 0.34, 0, 0.5, 0, 'white', { castShadow: false });
    addBox(group, 0.46, 0.05, 0.36, 0, 0.66, 0, 'gold', { castShadow: false });
  }

  if (bun) {
    addSphere(group, 0.12, 0, 1.47, -0.14, 'dark', { widthSegments: 6, heightSegments: 4, castShadow: false });
  }

  if (tika) {
    addSphere(group, 0.022, 0, 1.53, 0.15, 'accent', { widthSegments: 5, heightSegments: 4, castShadow: false });
  }

  if (tray) {
    addCylinder(group, 0.24, 0.24, 0.035, 8, 0, 1.02, 0.26, 'gold', { castShadow: false });
    for (let i = -1; i <= 1; i += 1) {
      addCylinder(group, 0.055, 0.07, 0.045, 7, i * 0.1, 1.055, 0.26, 'brick', { castShadow: false });
      addCone(group, 0.02, 0.07, 5, i * 0.1, 1.1, 0.26, 'window', { castShadow: false });
    }
  }

  const leftArm = addBox(group, 0.075, 0.5, 0.08, -0.27, 1.05, 0, shirt, { rotZ: 0.12 });
  const rightArm = addBox(group, 0.075, 0.5, 0.08, 0.27, 1.05, 0, shirt, { rotZ: -0.12 });
  addSphere(group, 0.055, -0.29, 0.81, 0, skin, { widthSegments: 5, heightSegments: 4 });
  addSphere(group, 0.055, 0.29, 0.81, 0, skin, { widthSegments: 5, heightSegments: 4 });

  if (shawl) {
    addBox(group, 0.5, 0.12, 0.34, 0, 1.27, 0.02, shawl, { rotZ: 0.02 });
    addBox(group, 0.12, 0.55, 0.12, -0.24, 1.0, 0.03, shawl, { rotZ: 0.12 });
  }
  if (bag) {
    addBox(group, 0.32, 0.38, 0.18, 0, 1.06, -0.23, 'woodDark');
    addBox(group, 0.05, 0.42, 0.05, -0.14, 1.18, -0.22, 'dark');
    addBox(group, 0.05, 0.42, 0.05, 0.14, 1.18, -0.22, 'dark');
  }
  if (hat) {
    addCylinder(group, 0.24, 0.26, 0.06, 8, 0, 1.63, 0, 'woodDark');
    addCylinder(group, 0.16, 0.18, 0.12, 8, 0, 1.7, 0, 'cloth3');
  }
  if (basket) {
    addCylinder(group, 0.24, 0.18, 0.34, 7, 0, 1.16, -0.3, 'wood');
    addCylinder(group, 0.2, 0.2, 0.06, 7, 0, 1.34, -0.3, 'woodDark');
    addBox(group, 0.05, 0.6, 0.05, 0, 1.35, -0.1, 'dark', { rotX: 0.25 });
  }

  group.userData.arms = { leftArm, rightArm };
  group.userData.phase = rng() * Math.PI * 2;
  return group;
}

export function makeDog() {
  const group = new THREE.Group();
  addBox(group, 0.5, 0.26, 0.24, 0, 0.28, 0, 'wood');
  addSphere(group, 0.17, 0.28, 0.38, 0.02, 'wood', { widthSegments: 6, heightSegments: 4 });
  addSphere(group, 0.08, 0.4, 0.4, 0.14, 'woodDark', { widthSegments: 5, heightSegments: 4 });
  addCone(group, 0.06, 0.16, 4, 0.2, 0.49, 0.02, 'woodDark', { rotZ: -0.4 });
  addCone(group, 0.06, 0.16, 4, 0.34, 0.49, 0.02, 'woodDark', { rotZ: -0.4 });
  for (const x of [-0.16, 0.16]) {
    for (const z of [-0.07, 0.07]) {
      addBox(group, 0.08, 0.28, 0.08, x, 0.1, z, 'woodDark');
    }
  }
  const tail = addBox(group, 0.08, 0.08, 0.34, -0.26, 0.36, -0.1, 'woodDark', { rotX: 0.5 });
  group.userData.tail = tail;
  group.userData.phase = rng() * Math.PI * 2;
  return group;
}

export function makePigeons() {
  const group = new THREE.Group();
  const positions = [
    [0, 0, 0],
    [0.38, 0, 0.22],
    [-0.32, 0, 0.34],
    [0.18, 0, -0.3],
    [-0.48, 0, -0.18],
  ];
  for (const [x, y, z] of positions) {
    const bird = new THREE.Group();
    bird.position.set(x, y, z);
    addSphere(bird, 0.12, 0, 0.14, 0, 'dark', {
      widthSegments: 6,
      heightSegments: 4,
      scale: [1, 0.8, 1.2],
    });
    addSphere(bird, 0.07, 0.1, 0.22, 0.03, 'dark', { widthSegments: 5, heightSegments: 4 });
    addCone(bird, 0.025, 0.08, 4, 0.17, 0.22, 0.03, 'gold', { rotZ: -Math.PI / 2 });
    addBox(bird, 0.16, 0.02, 0.08, 0, 0.15, 0.02, 'dark');
    bird.rotation.y = rng() * Math.PI * 2;
    group.add(bird);
  }
  return group;
}

export function makeBus() {
  const group = new THREE.Group();
  addBox(group, 3.0, 1.35, 1.15, 0, 0.95, 0, 'accent');
  addBox(group, 2.6, 0.38, 1.12, 0, 1.72, 0, 'white');
  addBox(group, 2.8, 0.16, 1.18, 0, 1.54, 0, 'woodDark');
  for (let i = 0; i < 4; i += 1) {
    addBox(group, 0.46, 0.38, 0.04, -1.05 + i * 0.7, 1.18, 0.59, 'window', { castShadow: false });
    addBox(group, 0.46, 0.38, 0.04, -1.05 + i * 0.7, 1.18, -0.59, 'window', { castShadow: false });
  }
  addBox(group, 0.5, 0.72, 0.04, 1.23, 0.94, 0.59, 'glass');
  addBox(group, 0.28, 0.18, 0.05, -1.32, 0.52, 0.6, 'gold');
  addBox(group, 0.28, 0.18, 0.05, -1.32, 0.52, -0.6, 'gold');
  for (const x of [-0.9, 0.9]) {
    for (const z of [-0.62, 0.62]) {
      addCylinder(group, 0.24, 0.24, 0.16, 10, x, 0.32, z, 'dark', { rotX: Math.PI / 2 });
      addCylinder(group, 0.12, 0.12, 0.18, 8, x, 0.32, z, 'gold', { rotX: Math.PI / 2 });
    }
  }
  return group;
}

export function makeScooter() {
  const group = new THREE.Group();
  addCylinder(group, 0.18, 0.18, 0.12, 10, -0.42, 0.28, 0, 'dark', { rotX: Math.PI / 2 });
  addCylinder(group, 0.18, 0.18, 0.12, 10, 0.42, 0.28, 0, 'dark', { rotX: Math.PI / 2 });
  addBox(group, 0.6, 0.22, 0.28, 0, 0.5, 0, 'accent');
  addBox(group, 0.3, 0.38, 0.3, -0.18, 0.76, 0, 'accent2');
  addBox(group, 0.08, 0.42, 0.08, 0.4, 0.72, 0, 'dark');
  addBox(group, 0.28, 0.05, 0.08, 0.46, 0.94, 0, 'dark');
  addBox(group, 0.34, 0.08, 0.12, -0.3, 0.62, 0, 'woodDark');
  addCylinder(group, 0.08, 0.1, 0.12, 7, 0.46, 0.86, 0, 'gold');
  return group;
}

function makeFlagMaterial(key) {
  const material = new THREE.MeshBasicMaterial({
    color: ctx.palette[key] ?? ctx.palette.accent,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.94,
    depthWrite: false,
    toneMapped: false,
  });
  ctx.flagMaterials.push({ material, key });
  return material;
}

export function makePrayerFlagLine(parent, start, end, options = {}) {
  const count = options.count ?? 10;
  const sag = options.sag ?? 0.55;
  const colors = options.colors ?? ['accent2', 'white', 'accent', 'grass', 'gold'];
  const points = [];
  for (let i = 0; i <= 24; i += 1) {
    const t = i / 24;
    const point = new THREE.Vector3().lerpVectors(start, end, t);
    point.y -= Math.sin(t * Math.PI) * sag;
    points.push(point);
  }
  addLine(parent, points, 'dark', 0.42);

  const flags = [];
  for (let i = 0; i < count; i += 1) {
    const t = (i + 0.6) / (count + 0.2);
    const point = new THREE.Vector3().lerpVectors(start, end, t);
    point.y -= Math.sin(t * Math.PI) * sag;
    const material = makeFlagMaterial(colors[i % colors.length]);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.32), material);
    flag.position.copy(point);
    flag.rotation.y = Math.atan2(end.x - start.x, end.z - start.z) + Math.PI / 2;
    flag.rotation.z = (rng() - 0.5) * 0.18;
    flag.userData.baseRotation = flag.rotation.z;
    flag.userData.phase = rng() * Math.PI * 2;
    parent.add(flag);
    flags.push(flag);
  }
  return flags;
}

export function makeWirePoles(parent) {
  const polePositions = [
    [7.4, 4.9],
    [7.4, -5.5],
  ];
  const tops = [];
  for (const [x, z] of polePositions) {
    addCylinder(parent, 0.08, 0.12, 3.1, 6, x, 1.55, z, 'woodDark');
    addBox(parent, 0.8, 0.08, 0.08, x, 2.9, z, 'woodDark');
    tops.push(new THREE.Vector3(x, 2.9, z));
  }
  for (let i = 0; i < 3; i += 1) {
    const a = tops[0].clone();
    const b = tops[1].clone();
    a.y -= i * 0.18;
    b.y -= i * 0.18;
    const points = [];
    for (let j = 0; j <= 12; j += 1) {
      const t = j / 12;
      const point = new THREE.Vector3().lerpVectors(a, b, t);
      point.y -= Math.sin(t * Math.PI) * 0.35;
      points.push(point);
    }
    addLine(parent, points, 'dark', 0.5);
  }
  addBox(parent, 0.38, 0.45, 0.3, 7.4, 2.55, 4.9, 'stoneDark');
  addBox(parent, 0.24, 0.24, 0.32, 7.4, 2.55, 4.9, 'gold');
}

export function makeStreetLamp(parent, x, z) {
  addCylinder(parent, 0.06, 0.09, 2.5, 6, x, 1.25, z, 'woodDark');
  addBox(parent, 0.38, 0.1, 0.38, x, 2.52, z, 'woodDark');
  addSphere(parent, 0.16, x, 2.4, z, 'window', { widthSegments: 7, heightSegments: 5 });
  addCone(parent, 0.22, 0.2, 4, x, 2.62, z, 'roofDark');
}

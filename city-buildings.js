import * as THREE from 'three';
import {
  ctx,
  addBox,
  addCylinder,
  addCone,
  addSphere,
  getMaterial,
  makeTextTexture,
  makeRng,
} from './scene-world.js';

const rng = makeRng(0x2f6f6a);

function addLatticeWindow(parent, x, y, z, width, height, rotY = 0, glassKey = 'window') {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;

  addBox(group, width, height, 0.06, 0, 0, 0, 'woodDark', { castShadow: false });
  addBox(group, width - 0.08, height - 0.08, 0.025, 0, 0, 0.045, glassKey, { castShadow: false });

  addBox(group, width, 0.06, 0.08, 0, height / 2 - 0.03, 0.055, 'woodDark', { castShadow: false });
  addBox(group, width, 0.06, 0.08, 0, -height / 2 + 0.03, 0.055, 'woodDark', { castShadow: false });
  addBox(group, 0.06, height, 0.08, -width / 2 + 0.03, 0, 0.055, 'woodDark', { castShadow: false });
  addBox(group, 0.06, height, 0.08, width / 2 - 0.03, 0, 0.055, 'woodDark', { castShadow: false });

  for (let i = 1; i < 3; i += 1) {
    addBox(group, 0.032, height - 0.08, 0.04, -width / 2 + (width / 3) * i, 0, 0.07, 'woodDark', {
      castShadow: false,
    });
  }
  addBox(group, width - 0.08, 0.032, 0.04, 0, 0, 0.07, 'woodDark', { castShadow: false });

  parent.add(group);
  return group;
}

function addRoof(parent, radius, height, baseY, roofKey = 'roof', trimKey = 'roofDark') {
  const roof = addCone(parent, radius, height, 4, 0, baseY + height / 2, 0, roofKey);
  roof.rotation.y = Math.PI / 4;

  addBox(parent, radius * 1.52, 0.09, radius * 1.52, 0, baseY, 0, trimKey, {
    castShadow: false,
  });

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const tip = addCone(parent, 0.11, 0.34, 4, sx * radius * 0.67, baseY + 0.12, sz * radius * 0.67, trimKey, {
        castShadow: false,
      });
      tip.rotation.z = sx * 0.45;
      tip.rotation.x = sz * 0.45;
    }
  }

  return roof;
}

function addStruts(parent, radius, baseY, count = 8) {
  for (let i = 0; i < count; i += 1) {
    const angle = (i / count) * Math.PI * 2;
    const pivot = new THREE.Group();
    pivot.position.set(0, baseY, 0);
    pivot.rotation.y = -angle;
    const strut = addBox(pivot, 0.09, 0.82, 0.09, radius, 0.18, 0, 'woodDark', {
      castShadow: false,
    });
    strut.rotation.z = 0.62;
    parent.add(pivot);
  }
}

function makeLion(x, z, scale = 1) {
  const group = new THREE.Group();
  group.position.set(x, 0.64, z);
  group.scale.setScalar(scale);
  addBox(group, 0.48, 0.28, 0.68, 0, 0.22, 0, 'stone');
  addSphere(group, 0.24, 0, 0.48, 0.2, 'stone', { widthSegments: 6, heightSegments: 4 });
  addSphere(group, 0.26, 0, 0.5, 0.05, 'stoneDark', { widthSegments: 6, heightSegments: 4 });
  addBox(group, 0.12, 0.3, 0.12, -0.15, 0.1, 0.23, 'stoneDark');
  addBox(group, 0.12, 0.3, 0.12, 0.15, 0.1, 0.23, 'stoneDark');
  addBox(group, 0.12, 0.3, 0.12, -0.15, 0.1, -0.23, 'stoneDark');
  addBox(group, 0.12, 0.3, 0.12, 0.15, 0.1, -0.23, 'stoneDark');
  addBox(group, 0.34, 0.08, 0.2, 0, 0.32, -0.42, 'stoneDark');
  return group;
}

export function makePagoda() {
  const group = new THREE.Group();

  addBox(group, 4.6, 0.22, 4.6, 0, 0.11, 0, 'stoneDark');
  addBox(group, 4.0, 0.2, 4.0, 0, 0.32, 0, 'stone');
  addBox(group, 3.4, 0.2, 3.4, 0, 0.52, 0, 'stoneDark');

  addBox(group, 1.8, 0.18, 0.6, 0, 0.32, 2.15, 'stone');
  addBox(group, 1.55, 0.18, 0.5, 0, 0.49, 2.04, 'stoneDark');
  addBox(group, 1.3, 0.18, 0.42, 0, 0.66, 1.95, 'stone');

  addBox(group, 2.7, 2.0, 2.7, 0, 1.64, 0, 'brick');
  addBox(group, 2.84, 0.18, 2.84, 0, 0.72, 0, 'woodDark');

  addBox(group, 0.72, 1.3, 0.1, 0, 1.27, 1.38, 'woodDark');
  addBox(group, 0.56, 1.14, 0.05, 0, 1.27, 1.44, 'gold');
  for (let i = -1; i <= 1; i += 1) {
    addBox(group, 0.035, 1.05, 0.025, i * 0.16, 1.27, 1.48, 'woodDark', { castShadow: false });
  }

  addLatticeWindow(group, 0, 1.78, 1.36, 0.56, 0.68, 0);
  addLatticeWindow(group, 1.36, 1.78, 0, 0.56, 0.68, Math.PI / 2);
  addLatticeWindow(group, -1.36, 1.78, 0, 0.56, 0.68, -Math.PI / 2);
  addLatticeWindow(group, 0, 1.78, -1.36, 0.56, 0.68, Math.PI);

  addRoof(group, 2.12, 0.64, 2.68);
  addStruts(group, 1.28, 2.12, 8);

  addBox(group, 1.86, 1.14, 1.86, 0, 3.28, 0, 'brick');
  addLatticeWindow(group, 0, 3.3, 0.96, 0.48, 0.52, 0);
  addLatticeWindow(group, 0.96, 3.3, 0, 0.48, 0.52, Math.PI / 2);
  addLatticeWindow(group, -0.96, 3.3, 0, 0.48, 0.52, -Math.PI / 2);
  addRoof(group, 1.68, 0.54, 3.78);

  addBox(group, 1.2, 0.86, 1.2, 0, 4.3, 0, 'brick');
  addLatticeWindow(group, 0, 4.3, 0.62, 0.38, 0.4, 0);
  addRoof(group, 1.24, 0.45, 4.64);

  addCylinder(group, 0.07, 0.07, 0.64, 8, 0, 5.12, 0, 'gold');
  addSphere(group, 0.16, 0, 5.48, 0, 'gold', { widthSegments: 8, heightSegments: 6 });
  addSphere(group, 0.09, 0, 5.68, 0, 'gold', { widthSegments: 6, heightSegments: 4 });
  addCone(group, 0.1, 0.3, 8, 0, 5.83, 0, 'gold');

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      addSphere(group, 0.07, sx * 1.45, 2.58, sz * 1.45, 'gold', {
        widthSegments: 6,
        heightSegments: 4,
        castShadow: false,
      });
    }
  }

  group.add(makeLion(-1.3, 2.05, 0.95));
  group.add(makeLion(1.3, 2.05, 0.95));

  for (let i = 0; i < 7; i += 1) {
    const t = i / 6;
    const x = -0.72 + t * 1.44;
    const y = 2.0 - Math.sin(t * Math.PI) * 0.22;
    addSphere(group, 0.065, x, y, 1.55, 'gold', {
      widthSegments: 5,
      heightSegments: 4,
      castShadow: false,
    });
  }

  return group;
}

export function makeSignPlane(parent, text, width, height, x, y, z, rotY = 0) {
  const texture = makeTextTexture(text, {
    width: 512,
    height: 128,
    font: '700 62px "Nirmala UI", "Noto Sans Devanagari", "Segoe UI", sans-serif',
  });
  if (!texture) return null;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: ctx.palette.accent,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  ctx.signMaterials.push({ material, key: 'accent' });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  plane.position.set(x, y, z);
  plane.rotation.y = rotY;
  parent.add(plane);
  return plane;
}

function makeBicycle(x, z, rotY = 0.2) {
  const group = new THREE.Group();
  group.position.set(x, 0.63, z);
  group.rotation.y = rotY;

  const wheelGeometry = new THREE.TorusGeometry(0.31, 0.035, 5, 12);
  const wheelA = new THREE.Mesh(wheelGeometry, getMaterial('dark'));
  wheelA.position.set(-0.55, 0.33, 0);
  const wheelB = new THREE.Mesh(wheelGeometry, getMaterial('dark'));
  wheelB.position.set(0.55, 0.33, 0);
  wheelA.castShadow = true;
  wheelB.castShadow = true;
  group.add(wheelA, wheelB);

  addBox(group, 0.78, 0.05, 0.05, 0, 0.55, 0, 'accent', { rotZ: 0.2 });
  addBox(group, 0.5, 0.05, 0.05, -0.15, 0.42, 0, 'accent', { rotZ: -0.55 });
  addBox(group, 0.05, 0.38, 0.05, 0.42, 0.56, 0, 'dark');
  addBox(group, 0.26, 0.05, 0.08, 0.52, 0.76, 0, 'dark');
  addBox(group, 0.22, 0.05, 0.12, -0.28, 0.74, 0, 'woodDark');
  addBox(group, 0.05, 0.35, 0.05, -0.55, 0.55, 0, 'dark');
  return group;
}

function makeMiniPoster(parent, x, y, z, rotY = 0) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;
  addBox(group, 0.74, 1.0, 0.07, 0, 0, 0, 'woodDark');
  addBox(group, 0.58, 0.82, 0.02, 0, 0, 0.05, 'white', { castShadow: false });
  const pattern = [
    '1110011',
    '1010101',
    '1110011',
    '0001100',
    '1110011',
    '1000101',
    '1110011',
  ];
  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      if (pattern[row][col] === '1') {
        addBox(group, 0.055, 0.055, 0.01, -0.21 + col * 0.07, 0.22 - row * 0.07, 0.07, 'dark', {
          castShadow: false,
        });
      }
    }
  }
  parent.add(group);
  return group;
}

export function makeShopRow() {
  const group = new THREE.Group();
  const units = [
    { x: -2.55, sign: 'PASAL' },
    { x: 0, sign: 'चिया' },
    { x: 2.55, sign: 'QR' },
  ];

  for (const unit of units) {
    const { x } = unit;
    addBox(group, 2.45, 1.25, 2.75, x, 0.63, 0, 'brick');
    addBox(group, 2.35, 1.55, 2.65, x, 1.96, 0, 'wallWarm');
    addBox(group, 2.5, 0.12, 0.72, x, 1.28, 1.48, 'wood');
    addBox(group, 2.5, 0.18, 2.8, x, 2.82, 0, 'roof');
    addBox(group, 2.5, 0.06, 0.12, x, 2.9, 0.9, 'roofDark', { castShadow: false });

    for (let i = 0; i < 7; i += 1) {
      addBox(group, 0.055, 0.52, 0.055, x - 1.05 + i * 0.35, 1.62, 1.78, 'wood', {
        castShadow: false,
      });
    }
    addBox(group, 2.4, 0.06, 0.08, x, 1.88, 1.78, 'wood', { castShadow: false });

    addLatticeWindow(group, x, 2.16, 1.34, 1.0, 0.64, 0);
    addBox(group, 1.58, 1.02, 0.08, x, 0.68, 1.4, 'woodDark');
    addBox(group, 1.82, 0.24, 0.42, x, 0.34, 1.66, 'wood');
    addBox(group, 2.2, 0.08, 1.0, x, 1.64, 1.84, 'accent', { rotX: -0.17 });
    for (let i = 0; i < 3; i += 1) {
      addBox(group, 0.32, 0.025, 0.94, x - 0.68 + i * 0.68, 1.68, 1.86, 'white', {
        rotX: -0.17,
        castShadow: false,
      });
    }

    addBox(group, 1.78, 0.48, 0.08, x, 2.42, 1.37, 'woodDark');
    makeSignPlane(group, unit.sign, 1.55, 0.36, x, 2.42, 1.43);

    addBox(group, 0.52, 0.62, 0.42, x - 0.86, 0.31, 1.95, 'wood');
    addBox(group, 0.4, 0.5, 0.38, x + 0.8, 0.25, 1.98, 'woodDark');
    addCylinder(group, 0.2, 0.24, 0.42, 7, x - 0.2, 0.21, 2.05, 'cloth3');
    addCylinder(group, 0.14, 0.18, 0.3, 7, x + 0.25, 0.15, 2.0, 'gold');
  }

  for (let i = 0; i < 9; i += 1) {
    addSphere(group, 0.055, -2.9 + i * 0.72, 2.23 - Math.sin((i / 8) * Math.PI) * 0.18, 1.88, 'gold', {
      widthSegments: 5,
      heightSegments: 4,
      castShadow: false,
    });
  }

  group.add(makeBicycle(2.1, 2.3, 0.35));
  makeMiniPoster(group, -3.65, 1.4, 1.72, 0.08);
  return group;
}

export function makeTeaStall() {
  const group = new THREE.Group();

  addBox(group, 2.3, 2.0, 1.15, 0, 1.0, -0.55, 'wallWarm');
  addBox(group, 2.5, 0.8, 0.7, 0, 0.8, 0.6, 'brick');
  addBox(group, 2.6, 0.14, 0.92, 0, 1.24, 0.66, 'wood');
  addBox(group, 2.6, 0.08, 1.65, 0, 2.16, 0.42, 'accent', { rotX: -0.12 });
  for (let i = 0; i < 4; i += 1) {
    addBox(group, 0.36, 0.025, 1.55, -0.88 + i * 0.58, 2.19, 0.43, 'white', {
      rotX: -0.12,
      castShadow: false,
    });
  }
  addBox(group, 2.4, 0.16, 0.16, 0, 2.3, 1.12, 'woodDark');

  addBox(group, 1.4, 0.46, 0.08, 0, 2.48, 1.08, 'woodDark');
  makeSignPlane(group, 'चिया', 1.15, 0.34, 0, 2.48, 1.14);

  addCylinder(group, 0.16, 0.18, 0.34, 7, -0.48, 1.48, 0.66, 'dark');
  addCylinder(group, 0.2, 0.22, 0.16, 7, -0.48, 1.7, 0.66, 'gold');
  addCylinder(group, 0.12, 0.14, 0.3, 6, -0.48, 1.94, 0.66, 'gold');
  addCylinder(group, 0.05, 0.05, 0.18, 6, -0.48, 2.17, 0.66, 'dark');
  for (let i = 0; i < 3; i += 1) {
    addCylinder(group, 0.065, 0.055, 0.12, 7, -0.12 + i * 0.2, 1.4, 0.72, 'white', {
      castShadow: false,
    });
  }
  for (let i = 0; i < 3; i += 1) {
    addCylinder(group, 0.28, 0.3, 0.16, 8, 0.66, 1.38 + i * 0.16, 0.58, 'white');
    addCylinder(group, 0.24, 0.28, 0.12, 8, 0.66, 1.52 + i * 0.16, 0.58, 'wood');
  }

  for (const sx of [-1.1, 1.1]) {
    addCylinder(group, 0.18, 0.2, 0.08, 8, sx, 0.42, 1.35, 'woodDark');
    addCylinder(group, 0.05, 0.05, 0.38, 6, sx, 0.21, 1.35, 'wood');
  }
  addBox(group, 1.4, 0.12, 0.4, 0, 0.55, 1.6, 'wood');
  addBox(group, 0.08, 0.55, 0.08, -0.65, 0.3, 1.6, 'woodDark');
  addBox(group, 0.08, 0.55, 0.08, 0.65, 0.3, 1.6, 'woodDark');

  for (let i = 0; i < 3; i += 1) {
    addSphere(group, 0.11 + i * 0.02, -0.48 + i * 0.04, 2.3 + i * 0.2, 0.66, 'white', {
      widthSegments: 6,
      heightSegments: 4,
      castShadow: false,
    });
  }

  return group;
}

export function makeStupa() {
  const group = new THREE.Group();
  addBox(group, 2.4, 0.2, 2.4, 0, 0.1, 0, 'stoneDark');
  addBox(group, 1.9, 0.18, 1.9, 0, 0.29, 0, 'stone');
  addBox(group, 1.45, 0.18, 1.45, 0, 0.47, 0, 'stoneDark');
  addSphere(group, 0.86, 0, 1.15, 0, 'white', {
    widthSegments: 10,
    heightSegments: 8,
    scale: [1, 0.78, 1],
  });
  addBox(group, 0.46, 0.34, 0.46, 0, 1.92, 0, 'gold');
  addCylinder(group, 0.08, 0.12, 0.6, 8, 0, 2.36, 0, 'gold');
  addSphere(group, 0.13, 0, 2.7, 0, 'gold', { widthSegments: 6, heightSegments: 4 });
  addCone(group, 0.08, 0.28, 6, 0, 2.9, 0, 'gold');
  addBox(group, 0.3, 0.4, 0.06, 0, 1.15, 0.8, 'woodDark');
  addBox(group, 0.18, 0.26, 0.03, 0, 1.15, 0.84, 'gold');
  for (let i = 0; i < 5; i += 1) {
    addSphere(group, 0.045, -0.4 + i * 0.2, 1.8 - Math.sin((i / 4) * Math.PI) * 0.12, 0.9, 'gold', {
      widthSegments: 5,
      heightSegments: 4,
      castShadow: false,
    });
  }
  return group;
}

export function makeDhara() {
  const group = new THREE.Group();
  addBox(group, 2.0, 0.2, 1.5, 0, 0.1, 0, 'stoneDark');
  addBox(group, 1.8, 0.16, 1.3, 0, 0.28, 0, 'stone');
  addBox(group, 0.9, 1.25, 0.45, 0, 0.82, -0.42, 'stoneDark');
  addBox(group, 0.7, 0.9, 0.35, 0, 0.9, -0.3, 'stone');
  addBox(group, 1.4, 0.52, 0.9, 0, 0.46, 0.15, 'stoneDark');
  addBox(group, 1.2, 0.08, 0.72, 0, 0.74, 0.15, 'water', { castShadow: false });
  addCylinder(group, 0.11, 0.13, 0.7, 7, 0, 0.9, -0.04, 'stone', { rotX: Math.PI / 2 });
  addBox(group, 0.14, 0.08, 0.55, 0, 0.88, 0.28, 'water', { castShadow: false });
  addBox(group, 0.5, 0.12, 0.3, 0, 0.38, 0.75, 'stone');
  addBox(group, 0.4, 0.1, 0.24, 0, 0.48, 0.75, 'stoneDark');
  addCylinder(group, 0.16, 0.2, 0.3, 7, -0.6, 0.3, 0.58, 'gold');
  addSphere(group, 0.09, 0.62, 0.82, 0.15, 'gold', { widthSegments: 5, heightSegments: 4 });
  return group;
}

export function makeTree(scale = 1, variant = 0) {
  const group = new THREE.Group();
  const height = (2.2 + rng() * 1.2) * scale;
  addCylinder(group, 0.1 * scale, 0.17 * scale, height, 6, 0, height / 2, 0, 'woodDark');
  const canopyCount = 3 + (variant % 2);
  for (let i = 0; i < canopyCount; i += 1) {
    const angle = (i / canopyCount) * Math.PI * 2 + rng();
    const radius = (0.42 + rng() * 0.38) * scale;
    const canopy = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 0),
      getMaterial(i % 2 ? 'grassDark' : 'grass'),
    );
    canopy.position.set(
      Math.cos(angle) * radius,
      height - 0.15 * scale + i * 0.28 * scale,
      Math.sin(angle) * radius,
    );
    canopy.scale.set((0.65 + rng() * 0.3) * scale, (0.55 + rng() * 0.35) * scale, (0.65 + rng() * 0.3) * scale);
    canopy.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
    canopy.castShadow = true;
    canopy.receiveShadow = true;
    group.add(canopy);
  }
  return group;
}

export function makeShrineTree() {
  const group = makeTree(1.35, 1);
  addBox(group, 0.7, 0.45, 0.5, 0.7, 0.23, 0.35, 'stoneDark');
  addBox(group, 0.5, 0.3, 0.35, 0.7, 0.48, 0.35, 'stone');
  addBox(group, 0.32, 0.22, 0.04, 0.7, 0.45, 0.54, 'woodDark');
  addCone(group, 0.32, 0.24, 4, 0.7, 0.73, 0.35, 'gold');
  return group;
}

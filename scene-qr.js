import * as THREE from 'three';
import { drawQRTexture } from './qr.js';
import {
  ctx,
  addBox,
  getMaterial,
  makeGlowTexture,
  makeRng,
  makeTextTexture,
  smoothstep,
  clamp,
  GROUND_Y,
  GROUND_SPAN,
  WALL_SPAN,
  WALL_CENTER_Y,
} from './scene-world.js';

let qr = null;
let qrWallGroup = null;
let qrWallMesh = null;
let qrWallPanel = null;
let qrWallFrame = null;
let qrWallLabel = null;
let qrWallLabelMaterial = null;
let qrHalo = null;
let groundQR = null;
let groundTexture = null;
let textureCanvas = null;
let qrInstances = [];
let plazaBase = null;

const tempPos = new THREE.Vector3();
const tempScale = new THREE.Vector3();
const tempQuat = new THREE.Quaternion();
const tempEuler = new THREE.Euler();
const tempMatrix = new THREE.Matrix4();

function buildWallMesh(qrData) {
  if (!qrWallGroup) return;

  if (qrWallMesh) {
    qrWallGroup.remove(qrWallMesh);
    qrWallMesh.geometry.dispose();
    qrWallMesh.dispose();
    qrWallMesh = null;
  }

  const count = qrData.count;
  const wallModule = WALL_SPAN / count;
  const groundModule = GROUND_SPAN / (count + 8);
  const darkCells = [];

  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (qrData.qr.isDark(row, col)) darkCells.push([row, col]);
    }
  }

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.InstancedMesh(geometry, getMaterial('qrDark'), darkCells.length);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;

  const rng = makeRng(0x9e3779b9 ^ count);
  qrInstances = darkCells.map(([row, col], index) => {
    const x = (col - (count - 1) / 2) * wallModule;
    const y = WALL_CENTER_Y + ((count - 1) / 2 - row) * wallModule;
    const endX = (col - (count - 1) / 2) * groundModule;
    const endZ = (row - (count - 1) / 2) * groundModule;

    const start = new THREE.Vector3(x, y, 0.08);
    const end = new THREE.Vector3(endX, GROUND_Y + 0.055, endZ);
    const startScale = new THREE.Vector3(wallModule * 0.9, wallModule * 0.9, 0.16);
    const endScale = new THREE.Vector3(groundModule * 0.82, 0.12, groundModule * 0.82);

    const dx = (col - (count - 1) / 2) / (count / 2);
    const dy = (row - (count - 1) / 2) / (count / 2);
    const distance = Math.hypot(dx, dy);

    const phase = rng();
    const spin = {
      x: (rng() - 0.5) * 1.6,
      y: (rng() - 0.5) * 1.6,
      z: (rng() - 0.5) * 1.6,
    };

    tempPos.copy(start);
    tempScale.copy(startScale);
    tempQuat.identity();
    tempMatrix.compose(tempPos, tempQuat, tempScale);
    mesh.setMatrixAt(index, tempMatrix);

    return {
      start,
      end,
      startScale,
      endScale,
      delay: clamp(0.02 + distance * 0.2 + rng() * 0.08, 0, 0.34),
      phase,
      spin,
    };
  });

  mesh.instanceMatrix.needsUpdate = true;
  qrWallGroup.add(mesh);
  qrWallMesh = mesh;
}

export function refreshGroundTexture() {
  if (!groundQR || !textureCanvas || !qr) return;

  drawQRTexture(textureCanvas, qr.qr, ctx.palette);

  if (!groundTexture) {
    groundTexture = new THREE.CanvasTexture(textureCanvas);
    groundTexture.colorSpace = THREE.SRGBColorSpace;
    groundTexture.minFilter = THREE.LinearFilter;
    groundTexture.magFilter = THREE.LinearFilter;
    groundTexture.generateMipmaps = false;
    groundTexture.anisotropy = Math.min(4, ctx.renderer?.capabilities.getMaxAnisotropy() ?? 1);
    groundQR.material.map = groundTexture;
  } else {
    groundTexture.needsUpdate = true;
  }

  groundQR.material.needsUpdate = true;
}

export function setQR(qrData) {
  qr = qrData;
  buildWallMesh(qrData);
  refreshGroundTexture();
}

export function buildQR(initialQR) {
  qrWallGroup = new THREE.Group();
  ctx.scene.add(qrWallGroup);

  // The QR is a floating monolith: a cream/dark panel, a thin frame, and a
  // field of raised modules. The panel fades as the modules fly to the plaza.
  qrWallPanel = new THREE.Mesh(
    new THREE.BoxGeometry(WALL_SPAN + 0.72, WALL_SPAN + 0.72, 0.24),
    getMaterial('qrPanel'),
  );
  qrWallPanel.position.set(0, WALL_CENTER_Y, -0.18);
  qrWallPanel.castShadow = true;
  qrWallPanel.receiveShadow = true;
  qrWallGroup.add(qrWallPanel);

  qrWallFrame = new THREE.Group();
  const frameThickness = 0.11;
  const frameDepth = 0.32;
  const half = WALL_SPAN / 2 + 0.42;
  addBox(qrWallFrame, WALL_SPAN + 0.95, frameThickness, frameDepth, 0, WALL_CENTER_Y + half, 0, 'qrGlow', {
    castShadow: false,
  });
  addBox(qrWallFrame, WALL_SPAN + 0.95, frameThickness, frameDepth, 0, WALL_CENTER_Y - half, 0, 'qrGlow', {
    castShadow: false,
  });
  addBox(qrWallFrame, frameThickness, WALL_SPAN + 0.95, frameDepth, -half, WALL_CENTER_Y, 0, 'qrGlow', {
    castShadow: false,
  });
  addBox(qrWallFrame, frameThickness, WALL_SPAN + 0.95, frameDepth, half, WALL_CENTER_Y, 0, 'qrGlow', {
    castShadow: false,
  });
  qrWallGroup.add(qrWallFrame);

  // A soft halo behind the monolith, visible around its edges.
  qrHalo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture('rgba(255,255,255,0.8)', 'rgba(255,255,255,0)'),
    color: ctx.palette.qrGlow,
    transparent: true,
    opacity: ctx.mode === 'neon' ? 0.34 : 0.12,
    depthWrite: false,
    toneMapped: false,
  }));
  qrHalo.position.set(0, WALL_CENTER_Y, -1.1);
  qrHalo.scale.set(21, 21, 1);
  qrWallGroup.add(qrHalo);
  ctx.qrHalo = qrHalo;

  const labelTexture = makeTextTexture('SCAN THE WORLD  ·  QR VOLDE', {
    width: 1024,
    height: 160,
    font: '700 48px "Segoe UI", "Nirmala UI", sans-serif',
  });
  qrWallLabelMaterial = new THREE.MeshBasicMaterial({
    map: labelTexture,
    color: ctx.palette.accent,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  ctx.labelMaterials.push({ material: qrWallLabelMaterial, key: 'accent' });
  qrWallLabel = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 1.06), qrWallLabelMaterial);
  qrWallLabel.position.set(0, WALL_CENTER_Y - WALL_SPAN / 2 - 0.82, 0.08);
  qrWallGroup.add(qrWallLabel);

  // Plaza slab and QR ground plan.
  plazaBase = addBox(ctx.scene, GROUND_SPAN + 0.8, 0.12, GROUND_SPAN + 0.8, 0, 0.55, 0, 'stone', {
    castShadow: false,
  });
  plazaBase.receiveShadow = true;

  const border = 0.16;
  addBox(ctx.scene, GROUND_SPAN + 0.9, 0.07, border, 0, 0.62, -GROUND_SPAN / 2 - 0.38, 'stoneDark', {
    castShadow: false,
  });
  addBox(ctx.scene, GROUND_SPAN + 0.9, 0.07, border, 0, 0.62, GROUND_SPAN / 2 + 0.38, 'stoneDark', {
    castShadow: false,
  });
  addBox(ctx.scene, border, 0.07, GROUND_SPAN + 0.9, -GROUND_SPAN / 2 - 0.38, 0.62, 0, 'stoneDark', {
    castShadow: false,
  });
  addBox(ctx.scene, border, 0.07, GROUND_SPAN + 0.9, GROUND_SPAN / 2 + 0.38, 0.62, 0, 'stoneDark', {
    castShadow: false,
  });

  textureCanvas = document.createElement('canvas');
  textureCanvas.width = 1024;
  textureCanvas.height = 1024;

  groundQR = new THREE.Mesh(
    new THREE.PlaneGeometry(GROUND_SPAN, GROUND_SPAN),
    new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  groundQR.rotation.x = -Math.PI / 2;
  groundQR.position.set(0, GROUND_Y - 0.012, 0);
  groundQR.renderOrder = 2;
  ctx.scene.add(groundQR);
  ctx.groundQR = groundQR;

  setQR(initialQR);
  updateQRMorph(0);
}

export function updateQRMorph(progress) {
  if (!qrWallMesh) return;

  const morph = smoothstep(0.04, 0.4, progress);

  for (let i = 0; i < qrInstances.length; i += 1) {
    const instance = qrInstances[i];
    const t = smoothstep(0, 1, clamp((morph - instance.delay) / 0.55, 0, 1));

    tempPos.copy(instance.start).lerp(instance.end, t);
    const arc = Math.sin(t * Math.PI);
    tempPos.y += arc * (0.9 + instance.phase * 1.35);
    tempPos.x += Math.sin(t * Math.PI * 2 + instance.phase * 8) * 0.08;
    tempPos.z += Math.sin(t * Math.PI * 2 + instance.phase * 5) * 0.06;

    tempScale.copy(instance.startScale).lerp(instance.endScale, t);

    tempEuler.set(
      arc * instance.spin.x,
      arc * instance.spin.y,
      arc * instance.spin.z,
    );
    tempQuat.setFromEuler(tempEuler);
    tempMatrix.compose(tempPos, tempQuat, tempScale);
    qrWallMesh.setMatrixAt(i, tempMatrix);
  }

  qrWallMesh.instanceMatrix.needsUpdate = true;

  const panelOpacity = 1 - smoothstep(0.02, 0.18, progress);
  qrWallPanel.material.opacity = panelOpacity;
  qrWallPanel.visible = panelOpacity > 0.01;

  qrWallFrame.visible = progress < 0.2;
  qrWallLabelMaterial.opacity = 1 - smoothstep(0.02, 0.16, progress);
  qrWallLabel.visible = qrWallLabelMaterial.opacity > 0.01;

  if (qrHalo) {
    const base = ctx.mode === 'neon' ? 0.34 : ctx.mode === 'minimal' ? 0.06 : 0.12;
    qrHalo.material.opacity = base * (1 - smoothstep(0.04, 0.3, progress));
    qrHalo.visible = qrHalo.material.opacity > 0.005;
  }

  const groundOpacity = smoothstep(0.2, 0.45, progress);
  groundQR.material.opacity = groundOpacity;
  groundQR.visible = groundOpacity > 0.01;
}

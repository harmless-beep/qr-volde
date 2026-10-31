import * as THREE from 'three';
import {
  ctx,
  createWorldBase,
  applyPalette,
  resizeWorld,
  updateBase,
  clamp,
  smoothstep,
} from './scene-world.js';
import { buildQR, setQR, updateQRMorph, refreshGroundTexture } from './scene-qr.js';
import { buildCity, updateCity, setCityVisible } from './scene-city.js';
import { buildMithila, updateMithila, setMithilaVisible } from './city-mithila.js';

/* -------------------------------------------------------------------------
   Camera choreography
   One continuous flight: face the QR monolith, rise as it unfolds, drift over
   the chowk, then pull back to the Himalayan horizon.
------------------------------------------------------------------------- */

const SECTION_WEIGHTS = [1.0, 1.2, 1.4, 1.5];

const CHOWK_SECTIONS = [
  {
    approach: [0, 7.5, 20],
    inside: [0, 7.5, 17],
    depart: [0, 8.2, 15.5],
    look: [0, 7.2, 0],
  },
  {
    approach: [0, 10.5, 16.5],
    inside: [7, 13.5, 16],
    depart: [11, 15.5, 17],
    look: [0, 4.8, -1],
  },
  {
    approach: [11, 15, 18],
    inside: [14, 15.5, 20],
    depart: [16, 18, 23],
    look: [0, 3.2, -1],
  },
  {
    approach: [15, 15, 22],
    inside: [16, 13, 24],
    depart: [17, 13, 27],
    look: [0, 3, -1],
  },
];

const CHOWK_OUTRO = [18, 14, 30];

// Mithila gets its own flight: the camera leans left over the pond and
// painting pavilion instead of orbiting right over the shop row.
const MITHILA_SECTIONS = [
  {
    approach: [0, 7.5, 20],
    inside: [0, 7.5, 17],
    depart: [0, 8.2, 15.5],
    look: [0, 7.2, 0],
  },
  {
    approach: [0, 10.5, 16.5],
    inside: [-6.5, 12.5, 16.5],
    depart: [-10.5, 14.5, 18],
    look: [-0.5, 4.6, -1],
  },
  {
    approach: [-10.5, 14.5, 18],
    inside: [-13.5, 13.2, 20.5],
    depart: [-15, 15.5, 23.5],
    look: [0, 3.4, -1],
  },
  {
    approach: [-15, 15.5, 23.5],
    inside: [-13, 12, 26],
    depart: [-9, 12.5, 29.5],
    look: [0, 3, -1],
  },
];

const MITHILA_OUTRO = [-7, 13, 31];

function makeCameraRig(sections, outro) {
  const points = [];
  const looks = [];

  for (const section of sections) {
    points.push(new THREE.Vector3(...section.approach));
    points.push(new THREE.Vector3(...section.inside));
    points.push(new THREE.Vector3(...section.depart));
    looks.push(new THREE.Vector3(...section.look));
  }
  points.push(new THREE.Vector3(...outro));

  return {
    points,
    looks,
    curve: new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5),
  };
}

const CAMERA_RIGS = {
  chowk: makeCameraRig(CHOWK_SECTIONS, CHOWK_OUTRO),
  mithila: makeCameraRig(MITHILA_SECTIONS, MITHILA_OUTRO),
};

let activeRig = CAMERA_RIGS.chowk;
const tempLook = new THREE.Vector3();
const tempDir = new THREE.Vector3();
const tempRight = new THREE.Vector3();
let currentProgress = 0;

export function sectionAt(progress) {
  const total = SECTION_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
  const p = clamp(progress, 0, 1);
  let accumulated = 0;

  for (let index = 0; index < SECTION_WEIGHTS.length; index += 1) {
    const weight = SECTION_WEIGHTS[index] / total;
    if (p <= accumulated + weight || index === SECTION_WEIGHTS.length - 1) {
      return {
        index,
        local: clamp((p - accumulated) / weight, 0, 1),
      };
    }
    accumulated += weight;
  }

  return { index: SECTION_WEIGHTS.length - 1, local: 1 };
}

export function sectionStart(index) {
  const total = SECTION_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
  let accumulated = 0;
  for (let i = 0; i < index; i += 1) accumulated += SECTION_WEIGHTS[i] / total;
  return accumulated;
}

function updateCamera(progress) {
  const { index, local } = sectionAt(progress);
  const denominator = activeRig.points.length - 1;
  const curveT = clamp((index * 3 + local * 3) / denominator, 0, 1);

  activeRig.curve.getPoint(curveT, ctx.camera.position);

  tempLook.copy(activeRig.looks[index]);
  if (index < activeRig.looks.length - 1) {
    const blend = smoothstep(0, 1, (local - 2 / 3) * 3);
    tempLook.lerp(activeRig.looks[index + 1], blend);
  }

  const aspect = ctx.camera.aspect;
  // Portrait screens need a longer lens and a higher composition so the QR
  // clears both the top bar and the bottom copy card.
  const fit = clamp(1 / aspect, 1, 1.5) * (aspect > 1.35 ? 1.04 : 1);
  const lower = aspect < 0.7 ? 3.2 : aspect < 1.15 ? 2.0 : 0;
  tempLook.y -= lower;

  tempDir.copy(ctx.camera.position).sub(tempLook);
  ctx.camera.position.copy(tempLook).addScaledVector(tempDir, fit);

  // On wide screens, shift the artwork to the right of the copy card. On
  // portrait screens the card sits below the artwork instead.
  const shift = clamp((aspect - 0.95) / 0.65, 0, 1) * 0.24;
  if (shift > 0.001) {
    tempDir.copy(tempLook).sub(ctx.camera.position);
    const distance = tempDir.length();
    tempDir.normalize();
    tempRight.crossVectors(tempDir, ctx.camera.up).normalize();
    tempLook.addScaledVector(tempRight, -distance * shift);
  }

  ctx.camera.lookAt(tempLook);
}

function setSceneMode(modeId) {
  const isMithila = modeId === 'mithila';
  activeRig = isMithila ? CAMERA_RIGS.mithila : CAMERA_RIGS.chowk;
  setCityVisible(!isMithila);
  setMithilaVisible(isMithila);
  applyPalette(modeId);
  refreshGroundTexture();
  updateQRMorph(currentProgress);
  updateCamera(currentProgress);
}

export function initScene(canvas, initialQR) {
  createWorldBase(canvas);
  buildQR(initialQR);
  buildCity();
  buildMithila();
  setSceneMode('dawn');
  updateQRMorph(0);
  updateCity(0, 0, false);
  updateMithila(0, 0, false);

  return {
    setMode(modeId) {
      setSceneMode(modeId);
    },
    setQR(qrData) {
      setQR(qrData);
      updateQRMorph(currentProgress);
    },
    update(progress, time, reduceMotion = false) {
      currentProgress = clamp(progress, 0, 1);
      updateCamera(currentProgress);
      updateQRMorph(currentProgress);
      updateCity(currentProgress, time, reduceMotion);
      updateMithila(currentProgress, time, reduceMotion);
      updateBase(time, reduceMotion);
      ctx.renderer.render(ctx.scene, ctx.camera);
    },
    resize() {
      resizeWorld();
      updateCamera(currentProgress);
    },
    getCamera: () => ctx.camera,
    getRenderer: () => ctx.renderer,
    getScene: () => ctx.scene,
    getProgress: () => currentProgress,
  };
}

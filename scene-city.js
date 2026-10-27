import * as THREE from 'three';
import {
  ctx,
  addBox,
  addCylinder,
  addSphere,
  getMaterial,
  smoothstep,
  clamp,
  GROUND_Y,
} from './scene-world.js';
import {
  makePagoda,
  makeShopRow,
  makeTeaStall,
  makeStupa,
  makeDhara,
  makeTree,
  makeShrineTree,
} from './city-buildings.js';
import {
  makePerson,
  makeDog,
  makePigeons,
  makeBus,
  makeScooter,
  makePrayerFlagLine,
  makeWirePoles,
  makeStreetLamp,
} from './city-life.js';

const cityProps = [];
const people = [];
const flags = [];
let dog = null;
let cityGroup = null;
let roadGroup = null;

function addCityProp(group, delay = 0) {
  cityGroup.add(group);
  const baseScale = group.scale.clone();
  group.scale.copy(baseScale).multiplyScalar(0.001);
  group.visible = false;
  cityProps.push({
    group,
    baseScale,
    delay,
    baseY: group.position.y,
    baseRotY: group.rotation.y,
  });
  return group;
}

function buildRoad() {
  roadGroup = new THREE.Group();

  const road = new THREE.Mesh(
    new THREE.RingGeometry(11.0, 13.45, 72, 1),
    getMaterial('road'),
  );
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.57;
  road.receiveShadow = true;
  roadGroup.add(road);

  for (const [inner, outer, key] of [
    [10.82, 11.02, 'stoneDark'],
    [13.45, 13.7, 'stoneDark'],
  ]) {
    const curb = new THREE.Mesh(
      new THREE.RingGeometry(inner, outer, 72, 1),
      getMaterial(key),
    );
    curb.rotation.x = -Math.PI / 2;
    curb.position.y = 0.585;
    curb.receiveShadow = true;
    roadGroup.add(curb);
  }

  for (let i = 0; i < 18; i += 1) {
    const angle = (i / 18) * Math.PI * 2;
    addBox(roadGroup, 0.16, 0.018, 0.72, Math.cos(angle) * 12.2, 0.592, Math.sin(angle) * 12.2, 'stone', {
      rotY: -angle,
      castShadow: false,
      receiveShadow: false,
    });
  }

  ctx.scene.add(roadGroup);
}

function addNeonLights() {
  const shopLight = new THREE.PointLight(ctx.palette.neon, 0, 13, 2);
  shopLight.position.set(5.3, 2.8, -0.5);
  shopLight.userData.baseIntensity = 16;
  shopLight.userData.colorKey = 'neon';
  ctx.scene.add(shopLight);
  ctx.neonLights.push(shopLight);

  const teaLight = new THREE.PointLight(ctx.palette.accent2, 0, 11, 2);
  teaLight.position.set(-5.2, 2.4, 1.8);
  teaLight.userData.baseIntensity = 12;
  teaLight.userData.colorKey = 'accent2';
  ctx.scene.add(teaLight);
  ctx.neonLights.push(teaLight);

  const qrLight = new THREE.PointLight(ctx.palette.qrGlow, 0, 15, 2);
  qrLight.position.set(0, 7, 1.5);
  qrLight.userData.baseIntensity = 10;
  qrLight.userData.colorKey = 'neon';
  ctx.scene.add(qrLight);
  ctx.neonLights.push(qrLight);
}

export function buildCity() {
  cityGroup = new THREE.Group();
  ctx.scene.add(cityGroup);

  buildRoad();

  const pagoda = makePagoda();
  pagoda.position.set(0, GROUND_Y, -4.2);
  pagoda.rotation.y = 0.06;
  addCityProp(pagoda, 0.0);

  const shops = makeShopRow();
  shops.position.set(5.55, GROUND_Y, -1.55);
  shops.rotation.y = -0.28;
  addCityProp(shops, 0.06);

  const tea = makeTeaStall();
  tea.position.set(-5.15, GROUND_Y, 1.05);
  tea.rotation.y = 0.32;
  addCityProp(tea, 0.1);

  const stupa = makeStupa();
  stupa.position.set(-3.9, GROUND_Y, 4.45);
  stupa.rotation.y = -0.18;
  addCityProp(stupa, 0.14);

  const dhara = makeDhara();
  dhara.position.set(2.5, GROUND_Y, 2.7);
  addCityProp(dhara, 0.18);

  const shrineTree = makeShrineTree();
  shrineTree.position.set(-8.1, GROUND_Y, -2.6);
  shrineTree.rotation.y = 0.35;
  addCityProp(shrineTree, 0.2);

  const treeData = [
    [7.9, 4.8, 1.0, 0, 0.16],
    [-7.8, 5.8, 0.92, 1, 0.18],
    [9.0, -5.3, 1.12, 0, 0.22],
    [-8.9, -4.6, 0.88, 1, 0.24],
    [4.6, 7.0, 0.78, 0, 0.2],
    [-2.8, 7.35, 0.84, 1, 0.23],
    [10.4, 0.9, 0.7, 0, 0.26],
  ];
  for (const [x, z, scale, variant, delay] of treeData) {
    const tree = makeTree(scale, variant);
    tree.position.set(x, GROUND_Y, z);
    tree.rotation.y = (x + z) * 0.17;
    addCityProp(tree, delay);
  }

  const bus = makeBus();
  const busAngle = 0.55;
  bus.position.set(Math.cos(busAngle) * 12.2, 0.5, Math.sin(busAngle) * 12.2);
  bus.rotation.y = -busAngle - Math.PI / 2;
  addCityProp(bus, 0.22);

  const scooter = makeScooter();
  const scooterAngle = 2.45;
  scooter.position.set(Math.cos(scooterAngle) * 12.2, 0.5, Math.sin(scooterAngle) * 12.2);
  scooter.rotation.y = -scooterAngle - Math.PI / 2;
  addCityProp(scooter, 0.25);

  const peopleData = [
    [2.5, 4.35, -2.35, { shirt: 'cloth2', pants: 'dark', bag: true }],
    [-2.0, 5.45, 2.8, { shirt: 'cloth', pants: 'woodDark', shawl: 'cloth3' }],
    [5.9, 2.75, -1.55, { shirt: 'cloth3', pants: 'dark', hat: true }],
    [-6.2, 0.25, 0.8, { shirt: 'cloth2', pants: 'dark', basket: true }],
    [3.0, -1.8, -2.9, { shirt: 'accent', pants: 'dark', scale: 0.72 }],
    [-1.25, 3.05, 0.4, { shirt: 'cloth', pants: 'dark', shawl: 'cloth2' }],
    [7.0, -5.2, 2.1, { shirt: 'cloth2', pants: 'woodDark' }],
    [-7.2, 3.8, -0.7, { shirt: 'cloth3', pants: 'dark' }],
    [8.0, 0.6, 1.7, { shirt: 'cloth', pants: 'dark', bag: true }],
    [-3.2, -5.8, 0.2, { shirt: 'cloth2', pants: 'dark', hat: true }],
    [0.2, 6.2, 2.4, { shirt: 'cloth3', pants: 'woodDark' }],
    [4.0, -4.0, -0.8, { shirt: 'cloth', pants: 'dark' }],
  ];

  for (const [x, z, rotY, options] of peopleData) {
    const person = makePerson(options);
    person.position.set(x, GROUND_Y, z);
    person.rotation.y = rotY;
    addCityProp(person, 0.12 + Math.random() * 0.1);
    people.push({
      group: person,
      baseY: GROUND_Y,
      baseRotY: rotY,
      phase: person.userData.phase ?? Math.random() * Math.PI * 2,
    });
  }

  dog = makeDog();
  dog.position.set(1.6, GROUND_Y, 4.5);
  dog.rotation.y = 0.55;
  addCityProp(dog, 0.2);

  const pigeons = makePigeons();
  pigeons.position.set(4.25, GROUND_Y + 0.02, 2.1);
  addCityProp(pigeons, 0.22);

  const prayerGroup = new THREE.Group();
  const flagsA = makePrayerFlagLine(
    prayerGroup,
    new THREE.Vector3(0.1, GROUND_Y + 5.55, -4.1),
    new THREE.Vector3(5.8, GROUND_Y + 3.2, -1.6),
    { count: 11, sag: 0.65 },
  );
  const flagsB = makePrayerFlagLine(
    prayerGroup,
    new THREE.Vector3(-3.9, GROUND_Y + 3.1, 4.45),
    new THREE.Vector3(-8.0, GROUND_Y + 3.35, -2.6),
    { count: 9, sag: 0.55 },
  );
  flags.push(...flagsA, ...flagsB);
  addCityProp(prayerGroup, 0.16);

  const wires = new THREE.Group();
  makeWirePoles(wires);
  addCityProp(wires, 0.22);

  const lamps = new THREE.Group();
  makeStreetLamp(lamps, -1.0, 6.85);
  makeStreetLamp(lamps, 8.2, 4.2);
  addCityProp(lamps, 0.24);

  const neonStrips = new THREE.Group();
  addBox(neonStrips, 2.2, 0.05, 0.06, 5.55, GROUND_Y + 2.55, 1.2, 'neon', {
    rotY: -0.28,
    castShadow: false,
  });
  addBox(neonStrips, 1.7, 0.05, 0.06, -5.15, GROUND_Y + 2.28, 1.95, 'neon', {
    rotY: 0.32,
    castShadow: false,
  });
  addCityProp(neonStrips, 0.18);

  addNeonLights();
}

export function updateCity(progress, time, reduceMotion = false) {
  if (!cityGroup) return;

  const reveal = smoothstep(0.22, 0.55, progress);

  for (const prop of cityProps) {
    const t = smoothstep(0, 1, clamp((reveal - prop.delay) / 0.38, 0, 1));
    prop.group.visible = t > 0.01;
    prop.group.scale.copy(prop.baseScale).multiplyScalar(t);
  }

  if (reduceMotion) return;

  for (const person of people) {
    if (!person.group.visible) continue;
    const sway = Math.sin(time * 1.15 + person.phase) * 0.012;
    person.group.position.y = person.baseY + sway;
    person.group.rotation.y = person.baseRotY + Math.sin(time * 0.35 + person.phase) * 0.035;
    const arms = person.group.userData.arms;
    if (arms) {
      arms.leftArm.rotation.z = 0.12 + Math.sin(time * 1.1 + person.phase) * 0.035;
      arms.rightArm.rotation.z = -0.12 - Math.sin(time * 1.1 + person.phase) * 0.035;
    }
  }

  if (dog?.visible) {
    const tail = dog.userData.tail;
    if (tail) tail.rotation.x = 0.5 + Math.sin(time * 4.2 + dog.userData.phase) * 0.2;
  }

  for (const flag of flags) {
    flag.rotation.z = flag.userData.baseRotation + Math.sin(time * 1.9 + flag.userData.phase) * 0.12;
  }
}

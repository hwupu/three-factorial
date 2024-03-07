import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

const parameters = {
  counts: 1000,
  size: 0.02,
  radius: 5,
  branches: 5,
};

let geometry: THREE.BufferGeometry | null;
let material: THREE.PointsMaterial | null;
let points: THREE.Points | null;

const generateGalaxy = () => {
  if (points != null) {
    geometry?.dispose();
    material?.dispose();
    scene.remove(points!);
  }
  const position = new Float32Array(parameters.counts * 3);
  for (const i in Array.from(Array(parameters.counts).keys())) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;

    position[i3 + 0] = radius;
    position[i3 + 1] = (Math.random() - 0.5) * 3;
    position[i3 + 2] = (Math.random() - 0.5) * 3;
  }
  geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

const gui = new GUI();
gui
  .add(parameters, "counts")
  .min(100)
  .max(10000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius")
  .min(1)
  .max(10)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "branches")
  .min(1)
  .max(10)
  .step(1)
  .onFinishChange(generateGalaxy);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight);
camera.position.set(2, 2, 5);
camera.lookAt(new THREE.Vector3());
scene.add(camera);
const canvas = document.querySelector("canvas.webgl") as HTMLElement;
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

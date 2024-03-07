import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("/textures/particles/5.png");

const particleGeometry = new THREE.BufferGeometry();
const count = 1000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (const i in Array.from(Array(count).keys())) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3),
);
particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial();
particleMaterial.size = 0.1;
particleMaterial.sizeAttenuation = true;
particleMaterial.transparent = true;
particleMaterial.alphaMap = particleTexture;

// Alpha color threshold
// particleMaterial.alphaTest = 0.1;

// Stop testing object's depth, just draw it all.
// particleMaterial.depthTest = false;

// Stop writing to depth buffer
// particleMaterial.depthWrite = false;

// Additive color mode. (can impact performance)
particleMaterial.blending = THREE.AdditiveBlending;

// Vertex color will blend with particleMaterial.color
// particleMaterial.color = new THREE.Color("#ffffff");
particleMaterial.vertexColors = true;

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

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

const clock = new THREE.Clock();
const tick = () => {
  const time = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

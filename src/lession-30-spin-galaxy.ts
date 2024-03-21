import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import vertexShader from "./shaders/vertex30.glsl?raw";
import fragmentShader from "./shaders/fragment30.glsl?raw";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

const parameters = {
  count: 1000,
  radius: 5,
  branches: 3,
  randomness: 0.5,
  randomnessPower: 3,
  insideColor: new THREE.Color("#ff6030"),
  outsideColor: new THREE.Color("#1b3984"),
};

const particleMaterial = new THREE.ShaderMaterial({
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    particleSize: { value: window.devicePixelRatio > 1 ? 12 : 6 },
  },
});

const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(parameters.count * 3);
const colors = new Float32Array(parameters.count * 3);
const scales = new Float32Array(parameters.count);

for (let i = 0; i < parameters.count; i++) {
  const i3 = i * 3;
  const radius = Math.random() * parameters.radius;
  const branchAngle =
    ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
  const randomX =
    Math.pow(Math.random(), parameters.randomnessPower) *
    (Math.random() + parameters.randomness);
  const randomY =
    Math.pow(Math.random(), parameters.randomnessPower) *
    (Math.random() + parameters.randomness);
  const randomZ =
    Math.pow(Math.random(), parameters.randomnessPower) *
    (Math.random() + parameters.randomness);

  positions[i3] = Math.cos(branchAngle) * radius + randomX;
  positions[i3 + 1] = randomY;
  positions[i3 + 2] = Math.sin(branchAngle) * radius + randomZ;

  const mixedColor = parameters.insideColor.clone();
  mixedColor.lerp(parameters.outsideColor, radius / parameters.radius);

  colors[i3] = mixedColor.r;
  colors[i3 + 1] = mixedColor.g;
  colors[i3 + 2] = mixedColor.b;

  scales[i] = Math.random();
}
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3),
);
particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
particleGeometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
const sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.set(2, 2, -1);
sun.castShadow = true;
scene.add(ambient, sun);

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
renderer.shadowMap.enabled = true;

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  particleMaterial.uniforms.uTime.value = elapsedTime;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import vertexShader28 from "./shaders/vertex28.glsl?raw";
import fragmentShader28 from "./shaders/fragment28.glsl?raw";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 32, 32),
  new THREE.ShaderMaterial({
    vertexShader: vertexShader28,
    fragmentShader: fragmentShader28,
    side: THREE.DoubleSide,
  }),
);
scene.add(plane);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
const sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.set(2, 2, -1);
sun.castShadow = true;
scene.add(ambient, sun);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight);
camera.position.set(1, 0, 2);
camera.lookAt(new THREE.Vector3());
scene.add(camera);
const canvas = document.querySelector("canvas.webgl") as HTMLElement;
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

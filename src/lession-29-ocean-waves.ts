import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import vertexShader from "./shaders/vertex29.glsl?raw";
import fragmentShader from "./shaders/fragment29.glsl?raw";
import GUI from "lil-gui";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());
const gui = new GUI();

const debugObject = {
  depthColor: "#186691",
  surfaceColor: "#9bd8ff",
};

const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uBigWavesSpeed: { value: 0.75 },
    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
  },
});
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 128, 128),
  waterMaterial,
);
plane.rotation.x = -Math.PI * 0.5;
scene.add(plane);
gui
  .add(plane.material.uniforms.uBigWavesSpeed, "value")
  .min(0)
  .max(2)
  .step(0.1)
  .name("uBigWavesSpeed");
gui
  .add(plane.material.uniforms.uBigWavesElevation, "value")
  .min(0.01)
  .max(1)
  .step(0.01)
  .name("uBigWavesElevation");
gui
  .add(plane.material.uniforms.uBigWavesFrequency.value, "x")
  .min(1)
  .max(10)
  .step(1)
  .name("uBigWavesFrequency.x");
gui
  .add(plane.material.uniforms.uBigWavesFrequency.value, "y")
  .min(1)
  .max(10)
  .step(1)
  .name("uBigWavesFrequency.y");

gui.addColor(debugObject, "depthColor").onChange(() => {
  waterMaterial.uniforms.uDepthColor.value = new THREE.Color(
    debugObject.depthColor,
  );
});
gui.addColor(debugObject, "surfaceColor").onChange(() => {
  waterMaterial.uniforms.uSurfaceColor.value = new THREE.Color(
    debugObject.surfaceColor,
  );
});

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
const sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.set(2, 2, -1);
sun.castShadow = true;
scene.add(ambient, sun);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight);
camera.position.set(2, 2, 2);
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
  waterMaterial.uniforms.uTime.value = elapsedTime;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

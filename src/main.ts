import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// maybe use vit-plugin-glsl or vite-plugin-glslify
import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";

const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("/textures/flag-french.jpg");
flagTexture.colorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

const planeGeo = new THREE.PlaneGeometry(1, 1, 32, 32);
const count = planeGeo.attributes.position.count;
const randoms = new Float32Array(count);
Array.from(Array(count).keys()).forEach((i) => (randoms[i] = Math.random()));
planeGeo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
const planeMat = new THREE.RawShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uTexture: { value: flagTexture },
  },
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.position.y = 0.5;
scene.add(plane);

const floorMaterial = new THREE.MeshStandardMaterial({
  color: "#777777",
  metalness: 0.3,
  roughness: 0.4,
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMaterial);
floor.rotation.x = Math.PI * -0.5;
floor.receiveShadow = true;
scene.add(floor);

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
  planeMat.uniforms.uTime.value = elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import GUI from "lil-gui";
import "./index.css";

const gui = new GUI();
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const doorAlbedo = textureLoader.load("/textures/door/color.jpg");
const doorAlpha = textureLoader.load("/textures/door/alpha.jpg");
const doorNormal = textureLoader.load("/textures/door/normal.jpg");
const doorHeight = textureLoader.load("/textures/door/height.jpg");
const doorAO = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const doorMetal = textureLoader.load("/textures/door/metalness.jpg");
const doorRough = textureLoader.load("/textures/door/roughness.jpg");
const matcaps = textureLoader.load("/textures/matcaps/8.png");
const gradient = textureLoader.load("/textures/gradient/5.jpg");

doorAlbedo.colorSpace = THREE.SRGBColorSpace;
matcaps.colorSpace = THREE.SRGBColorSpace;
gradient.colorSpace = THREE.SRGBColorSpace;

// const material = new THREE.MeshBasicMaterial({ map: matcaps1 });
// material.color = new THREE.Color("#ff0000");

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcaps;

// const material = new THREE.MeshDepthMaterial();

// Must efficent material that works with lighting, but has some downside with geometry.
// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.color = new THREE.Color(0xff8811);
// material.shininess = 50;
// material.specular = new THREE.Color(0x1188ff);

// const material = new THREE.MeshToonMaterial();
// gradient.minFilter = THREE.NearestFilter;
// gradient.magFilter = THREE.NearestFilter;
// gradient.generateMipmaps = false;
// material.gradientMap = gradient;

const material = new THREE.MeshPhysicalMaterial();
// const material = new THREE.MeshStandardMaterial();
material.metalness = 1;
material.roughness = 1;
// material.map = doorAlbedo;
material.aoMap = doorAO;
material.aoMapIntensity = 1;
material.displacementMap = doorHeight;
material.displacementScale = 0.1;
material.metalnessMap = doorMetal;
material.roughnessMap = doorRough;
material.normalMap = doorNormal;
material.normalScale.set(0.5, 0.5);
material.transparent = true;
material.alphaMap = doorAlpha;
gui.add(material, "metalness").min(0).max(1).step(0.1);
gui.add(material, "roughness").min(0).max(1).step(0.1);
gui.add(material, "aoMapIntensity").min(0).max(1).step(0.1);
gui.add(material, "displacementScale").min(0).max(1).step(0.1);

// Clearcoart (For PhysicMaterial)
material.clearcoat = 1;
material.clearcoatRoughness = 0;
gui.add(material, "clearcoat").min(0).max(1).step(0.1);
gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.1);

// Sheen (For PhysicMaterial)
material.sheen = 1;
material.sheenRoughness = 0.25;
material.sheenColor.set(1, 1, 1);
gui.add(material, "sheen").min(0).max(1).step(0.1);
gui.add(material, "sheenRoughness").min(0).max(1).step(0.1);
gui.addColor(material, "sheenColor");

material.iridescence = 1;
material.iridescenceIOR = 1;
material.iridescenceThicknessRange = [100, 800];
gui.add(material, "iridescence").min(0).max(1).step(0.1);
gui.add(material, "iridescenceIOR").min(0).max(2.333).step(0.1);
gui.add(material.iridescenceThicknessRange, "0").min(0).max(1000).step(1);
gui.add(material.iridescenceThicknessRange, "1").min(0).max(1000).step(1);

// ior: index of refraction
// Diamond: ior = 2.417
// Water: ior = 1.333
// Air: ior = 1.000293
material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;
gui.add(material, "transmission").min(0).max(1).step(0.1);
gui.add(material, "ior").min(0).max(10).step(0.1);
gui.add(material, "thickness").min(0).max(1).step(0.1);

// This is computation **relatively** heavy.
// material.side = THREE.DoubleSide;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), material);
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 64),
  material,
);

sphere.position.x = -2;
torus.position.x = 2;
scene.add(sphere, plane, torus);

// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.set(2, 3, 4);
// scene.add(ambientLight, pointLight);

const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2k.hdr", (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = envMap;
  scene.environment = envMap;
});

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight);
camera.position.set(3, 2, 3);
scene.add(camera);
const canvas = document.querySelector("canvas.webgl") as HTMLElement;
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.5 * elapsedTime;
  plane.rotation.x = -0.5 * elapsedTime;
  torus.rotation.x = -0.5 * elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

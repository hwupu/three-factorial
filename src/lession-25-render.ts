import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader, RGBELoader } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());
const gui = new GUI();

const textureLoader = new THREE.TextureLoader();
const wallAlbedo = textureLoader.load("/textures/bricks/color.jpg");
const wallAO = textureLoader.load("/textures/bricks/ambientOcclusion.jpg");
const wallNormal = textureLoader.load("/textures/bricks/normal.jpg");
const wallRoughness = textureLoader.load("/textures/bricks/roughness.jpg");
wallAlbedo.colorSpace = THREE.SRGBColorSpace;

const grassAlbedo = textureLoader.load("/textures/grass/color.jpg");
const grassAO = textureLoader.load("/textures/grass/ambientOcclusion.jpg");
const grassNormal = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughness = textureLoader.load("/textures/grass/roughness.jpg");
grassAlbedo.colorSpace = THREE.SRGBColorSpace;

const updateAllMaterials = () => {
  scene.traverse((child) => {
    // if (child.isMesh && child.isMeshStandardMaterial) {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      // child.material.envMapIntensity = 2;
      // call this function in gui.onChange, if need to update
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (model) => {
  model.scene.scale.set(10, 10, 10);
  scene.add(model.scene);
  updateAllMaterials();
});

const wallMaterial = new THREE.MeshStandardMaterial({
  map: wallAlbedo,
  normalMap: wallNormal,
  normalScale: new THREE.Vector2(2, 2),
  aoMap: wallAO,
  roughnessMap: wallRoughness,
});
const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), wallMaterial);
wall.position.y = 5;
wall.position.z = -5;
wall.receiveShadow = true;
scene.add(wall);

const floorMaterial = new THREE.MeshStandardMaterial({
  map: grassAlbedo,
  normalMap: grassNormal,
  aoMap: grassAO,
  roughnessMap: grassRoughness,
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMaterial);
floor.rotation.x = Math.PI * -0.5;
floor.receiveShadow = true;
scene.add(floor);

const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/0/2k.hdr", (map) => {
  map.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = map;
  scene.background = map;
});

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
const sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.set(-3, 7, 9);
sun.castShadow = true;
sun.shadow.camera.near = 5;
sun.shadow.camera.far = 16;
// sun.shadow.mapSize.set(1024, 1024);
scene.add(ambient, sun);
gui.add(sun, "intensity").min(0.5).max(10).step(0.5);
gui.add(sun.position, "x").min(-10).max(10).step(0.5);
gui.add(sun.position, "y").min(-10).max(10).step(0.5);
gui.add(sun.position, "z").min(-10).max(10).step(0.5);

// Shadow acne
// occures on flat or smooth surface, where it cast its own shadow.
// can change bias or normalBias on the light
// it offsets the (calculation) mesh
gui.add(sun.shadow, "normalBias").min(-0.05).max(0.05).step(0.001);
gui.add(sun.shadow, "bias").min(-0.05).max(0.05).step(0.001);

const sunHelper = new THREE.CameraHelper(sun.shadow.camera);
scene.add(sunHelper);
sun.target.position.set(0, 4, 0);
// position, scale, rotation will compose to matrix right before render,
// but if not added in to scene, THREE doesn't know
scene.add(sun.target);
// or just do it once:
// sun.target.updateWorldMatrix();

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight);
camera.position.set(10, 10, 10);
camera.lookAt(new THREE.Vector3());
scene.add(camera);
const canvas = document.querySelector("canvas.webgl") as HTMLElement;
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const renderer = new THREE.WebGLRenderer({
  canvas,
  // If pixel ratio >= 2, maybe no need to enable anti-alias
  // antialias: true
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.toneMapping = THREE.ReinhardToneMapping;
gui.add(renderer, "toneMapping", {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
});

renderer.toneMappingExposure = 2;
gui.add(renderer, "toneMappingExposure").min(0.1).max(10).step(0.1);

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

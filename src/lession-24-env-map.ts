import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  EXRLoader,
  GLTFLoader,
  GroundedSkybox,
  RGBELoader,
} from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 1,
    color: 0xaaaaaa,
  }),
);
// knot.material.envMap = envMap
// This sets envMap for this paticualr model,
// but to set a default for all models, set this instead:
// scene.environment = envMap
knot.position.x = -4;
knot.position.y = 4;
scene.add(knot);

// Hacky way to adjust envMap intensity for all materials
const updateAllMaterials = () => {
  scene.traverse((child) => {
    // if (child.isMesh && child.isMeshStandardMaterial) {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 2;
      // call this function in gui.onChange, if need to update
    }
  });
};

// GLTF
const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (model) => {
  model.scene.scale.set(10, 10, 10);
  scene.add(model.scene);
  updateAllMaterials();
});

/* Env cube map
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMap = cubeTextureLoader.load([
  "/textures/environmentMap/0/px.png",
  "/textures/environmentMap/0/nx.png",
  "/textures/environmentMap/0/py.png",
  "/textures/environmentMap/0/ny.png",
  "/textures/environmentMap/0/pz.png",
  "/textures/environmentMap/0/nz.png",
]);
scene.environment = envMap;
scene.background = envMap;
scene.backgroundBlurriness = 0.01;
*/

/* Env HDR Equirectangular
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/0/2k.hdr", (map) => {
  map.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = map;
  scene.background = map;
});
*/

/* Env EXR Equirectangular
// EXR has layers and alpha channel
const exrLoader = new EXRLoader();
exrLoader.load("/textures/environmentMap/nvidiaCanvas-4k.exr", (map) => {
  map.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = map;
  scene.background = map;
});
*/

/* Env
const textureLoader = new THREE.TextureLoader();
const envMap = textureLoader.load(
  "/textures/environmentMap/blockadesLabsSkybox/anime_art_style_japan_streets_with_cherry_blossom_.jpg",
);
envMap.mapping = THREE.EquirectangularReflectionMapping;
envMap.colorSpace = THREE.SRGBColorSpace;
scene.background = envMap;
scene.environment = envMap;
*/

/* Skybox
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/textures/environmentMap/2/2k.hdr", (map) => {
  map.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = map;
  const skybox = new GroundedSkybox(map, 120, 11);
  skybox.scale.setScalar(50);
  scene.add(skybox);
});
*/

// Dynamic Env
const textureLoader = new THREE.TextureLoader();
const envMap = textureLoader.load(
  "/textures/environmentMap/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg",
);
envMap.mapping = THREE.EquirectangularReflectionMapping;
envMap.colorSpace = THREE.SRGBColorSpace;
scene.background = envMap;
// scene.environment = envMap;

const ring = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.5),
  new THREE.MeshBasicMaterial({ color: "white" }),
);

ring.position.y = 3.5;
ring.layers.enable(1);
scene.add(ring);

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  type: THREE.HalfFloatType,
  // HalfFloatType is 16 bits, FloatType is 32 bits
});

scene.environment = cubeRenderTarget.texture;
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.layers.set(1);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
const sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.set(2, 2, -1);
sun.castShadow = true;
scene.add(ambient, sun);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight);
camera.position.set(5, 10, 15);
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

  if (ring) {
    ring.rotation.x = Math.sin(elapsedTime) * 2;
    cubeCamera.update(renderer, scene);
  }
  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};
tick();

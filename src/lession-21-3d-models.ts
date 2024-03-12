import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

// GLTF
const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (model) => {
  // Load the whole scene:
  // scene.add(model.scene)
  // or, add models individuall:
  [...model.scene.children].map((obj) => scene.add(obj));
});

// GLTF Draco compression
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("node_modules/three/examples/jsm/libs/draco/");
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("/models/Duck/glTF-Draco/Duck.gltf", (model) => {
  const obj = model.scene;
  obj.position.x = -2;
  scene.add(obj);
});

// Animation
let mixer: THREE.AnimationMixer;
gltfLoader.load("/models/Fox/glTF/Fox.gltf", (model) => {
  const obj = model.scene;
  mixer = new THREE.AnimationMixer(obj);
  const action = mixer.clipAction(model.animations[2]);
  action.play();

  obj.position.x = 2;
  obj.scale.set(0.025, 0.025, 0.025);
  scene.add(obj);
});

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
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  mixer?.update(deltaTime);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

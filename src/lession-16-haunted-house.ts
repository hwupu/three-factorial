import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

const gui = new GUI();

const textureLoader = new THREE.TextureLoader();
const doorAlbedo = textureLoader.load("/textures/door/color.jpg");
const doorAlpha = textureLoader.load("/textures/door/alpha.jpg");
const doorNormal = textureLoader.load("/textures/door/normal.jpg");
const doorHeight = textureLoader.load("/textures/door/height.jpg");
const doorAO = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const doorMetal = textureLoader.load("/textures/door/metalness.jpg");
const doorRough = textureLoader.load("/textures/door/roughness.jpg");
doorAlbedo.colorSpace = THREE.SRGBColorSpace;

const wallAlbedo = textureLoader.load("/textures/bricks/color.jpg");
const wallAO = textureLoader.load("/textures/bricks/ambientOcclusion.jpg");
const wallNormal = textureLoader.load("/textures/bricks/normal.jpg");
const wallRough = textureLoader.load("/textures/bricks/roughness.jpg");
wallAlbedo.colorSpace = THREE.SRGBColorSpace;

const grassAlbedo = textureLoader.load("/textures/grass/color.jpg");
const grassAO = textureLoader.load("/textures/grass/ambientOcclusion.jpg");
const grassNormal = textureLoader.load("/textures/grass/normal.jpg");
const grassRough = textureLoader.load("/textures/grass/roughness.jpg");
grassAlbedo.repeat.set(8, 8);
grassAO.repeat.set(8, 8);
grassNormal.repeat.set(8, 8);
grassRough.repeat.set(8, 8);
grassAlbedo.wrapS = THREE.RepeatWrapping;
grassAO.wrapS = THREE.RepeatWrapping;
grassNormal.wrapS = THREE.RepeatWrapping;
grassRough.wrapS = THREE.RepeatWrapping;
grassAlbedo.wrapT = THREE.RepeatWrapping;
grassAO.wrapT = THREE.RepeatWrapping;
grassNormal.wrapT = THREE.RepeatWrapping;
grassRough.wrapT = THREE.RepeatWrapping;
grassAlbedo.colorSpace = THREE.SRGBColorSpace;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassAlbedo,
    aoMap: grassAO,
    normalMap: grassNormal,
    roughnessMap: grassRough,
  }),
);
floor.rotation.x = Math.PI * -0.5;
floor.position.y = 0;
scene.add(floor);

const ambient = new THREE.AmbientLight("#b9d5ff", 0.12);
scene.add(ambient);

const moon = new THREE.DirectionalLight("#b9d5ff", 0.5);
moon.position.set(4, 5, -2);
scene.add(moon);
scene.add(new THREE.DirectionalLightHelper(moon));

const doorLight = new THREE.PointLight("#ff7d46", 3, 7);
doorLight.position.set(0, 2.2, 2.7);

const ghost1 = new THREE.PointLight("#ff00ff", 6, 3);
const ghost2 = new THREE.PointLight("#00ffff", 6, 3);
const ghost3 = new THREE.PointLight("#0000ff", 6, 3);
scene.add(ghost1, ghost2, ghost3);

const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

const house = new THREE.Group();
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallAlbedo,
    aoMap: wallAO,
    normalMap: wallNormal,
    roughnessMap: wallRough,
  }),
);
walls.position.y = 2.5 / 2;
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" }),
);
roof.position.y = 2.5 + 1 / 2;
roof.rotation.y = Math.PI * 0.25;
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorAlbedo,
    transparent: true,
    alphaMap: doorAlpha,
    aoMap: doorAO,
    normalMap: doorNormal,
    displacementMap: doorHeight,
    displacementScale: 0.1,
    metalnessMap: doorMetal,
    roughnessMap: doorRough,
  }),
);
door.position.set(0, 1, 2.01);
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
house.add(walls, roof, door, bush1, bush2, bush3, bush4);
house.add(doorLight);
scene.add(house);

const graves = new THREE.Group();
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });
for (let _ in Array.from(Array(50).keys())) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  const radius = 6 * Math.random() + 4;
  const angle = Math.random() * Math.PI * 2;
  const x = radius * Math.sin(angle);
  const z = radius * Math.cos(angle);
  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 1;
  grave.rotation.z = (Math.random() - 0.5) * 0.3;
  grave.castShadow = true;
  graves.add(grave);
}
scene.add(graves);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight);
camera.position.set(5, 5, 10);
camera.lookAt(new THREE.Vector3());
scene.add(camera);
const canvas = document.querySelector("canvas.webgl") as HTMLElement;
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
moon.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;
walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;
floor.receiveShadow = true;

doorLight.shadow.mapSize = new THREE.Vector2(256, 256);
doorLight.shadow.camera.far = 7;
ghost1.shadow.mapSize = new THREE.Vector2(256, 256);
ghost1.shadow.camera.far = 7;
ghost2.shadow.mapSize = new THREE.Vector2(256, 256);
ghost2.shadow.camera.far = 7;
ghost3.shadow.mapSize = new THREE.Vector2(256, 256);
ghost3.shadow.camera.far = 7;

const clock = new THREE.Clock();
const tick = () => {
  const time = clock.getElapsedTime();

  const ghost1Angle = time * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(time * 3) + 1;

  const ghost2Angle = time * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(time * 4) + Math.sin(time * 2.5) + 1;

  const ghost3Angle = time * 0.18;
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(time * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(time * 0.5));
  ghost3.position.y = Math.sin(time * 5) + Math.sin(time * 2) + 1;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

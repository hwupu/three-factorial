import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl")! as HTMLElement;

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);
cube1.position.set(-2, 0, 0);
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
);
group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff }),
);
cube3.position.set(2, 0, 0);
group.add(cube3);

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x555500 }),
);
mesh.position.set(0, 2, 0);
mesh.rotation.reorder("YXZ");
scene.add(mesh);

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Sizes
 */
const sizes = {
  width: 700,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(2, 2, 5);
camera.lookAt(new THREE.Vector3());
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();

gsap.to(cube2.position, { z: -2, duration: 1, delay: 1 });

/**
 * Animations
 */
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  cube1.rotation.y = elapsedTime;
  cube2.rotation.y = elapsedTime;
  cube3.rotation.y = elapsedTime;
  mesh.rotation.y = elapsedTime;

  cube1.position.y = Math.sin(elapsedTime);
  mesh.position.x = Math.sin(elapsedTime);
  mesh.position.z = Math.cos(elapsedTime);

  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

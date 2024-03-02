import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";
import { fromEvent, throttle, interval } from "rxjs";
import "./index.css";

const debugObject: {
  color: string;
  subdivision: number;
  spin?: () => void;
} = {
  color: "#ff0000",
  subdivision: 1,
};

// Canvas
const canvas = document.querySelector("canvas.webgl")! as HTMLElement;

// Scene
const scene = new THREE.Scene();

/**
 * Random
 */
const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = Math.random() - 0.5;
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
const bufferGeometry = new THREE.BufferGeometry();
bufferGeometry.setAttribute("position", positionsAttribute);
const bufferMesh = new THREE.Mesh(
  bufferGeometry,
  new THREE.MeshBasicMaterial({ color: 0x550055, wireframe: true }),
);
bufferMesh.position.x = 2;
bufferMesh.position.y = 2;
scene.add(bufferMesh);

/**
 * Objects
 */
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: debugObject.color }),
);
cube1.position.set(-2, 0, 0);
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }),
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
  width: window.innerWidth,
  height: window.innerHeight,
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

const gui = new GUI({ width: 320, title: "Lil GUI", closeFolders: true });
const guiCube1 = gui.addFolder("cube1");
guiCube1.add(cube1.position, "x").min(-3).max(3).step(0.1).name("cube1.x");
guiCube1
  .addColor(debugObject, "color")
  .name("cube1.color")
  .onChange((value: string) => {
    cube1.material.setValues({ color: value });
  });
gui.add(bufferMesh, "visible");
gui.add(bufferMesh.material, "wireframe");
debugObject.spin = () => {
  gsap.to(bufferMesh.rotation, { y: bufferMesh.rotation.y + Math.PI * 2 });
};
gui.add(debugObject, "spin");
gui
  .add(debugObject, "subdivision")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    cube2.geometry.dispose();
    cube2.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      debugObject.subdivision,
      debugObject.subdivision,
      debugObject.subdivision,
    );
  });
gui.hide();
window.addEventListener("keydown", (event) => {
  const keyboardEvent = event as KeyboardEvent;
  if (keyboardEvent.key == "h") gui.show(gui._hidden);
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

gsap.to(cube2.position, { z: -2, duration: 1, delay: 1 });

/**
 * Resize
 */
const resizeEvent = fromEvent(window, "resize");
const throttledResize = resizeEvent.pipe(throttle(() => interval(50)));
throttledResize.subscribe(() => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

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

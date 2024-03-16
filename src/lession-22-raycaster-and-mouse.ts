import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { fromEvent, throttle, interval } from "rxjs";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

// GLTF
let duck: THREE.Group;
const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/Duck/glTF/Duck.gltf", (model) => {
  model.scene.position.x = 1;
  scene.add(model.scene);
  duck = model.scene;
});

const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#ff0000" }),
);
const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#ff0000" }),
);
const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#ff0000" }),
);
object1.position.x = -3;
object2.position.x = -1;
object3.position.x = 3;
object1.position.y = 0.5;
object2.position.y = 0.5;
object3.position.y = 0.5;
scene.add(object1, object2, object3);

const floorMaterial = new THREE.MeshStandardMaterial({
  color: "#777777",
  metalness: 0.3,
  roughness: 0.4,
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMaterial);
floor.rotation.x = Math.PI * -0.5;
floor.receiveShadow = true;
scene.add(floor);

const raycaster = new THREE.Raycaster();
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(1, 0, 0);

// direction need to be normalized:
// rayDirection.normalize();

// raycaster.set(rayOrigin, rayDirection);

// Three.js updates the objects' coordinates right before rending
// but we do ray casting immediately, we can manualy update them.
// object1.updateMatrixWorld();
// object2.updateMatrixWorld();
// object3.updateMatrixWorld();

// const intersect = raycaster.intersectObject(object2);
// const intersects = raycaster.intersectObjects([object1, object2, object3]);

// distance
// face
// faceIndex
// object
// point ( exact position of collision)
// uv

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
const sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.set(2, 2, -1);
sun.castShadow = true;
scene.add(ambient, sun);

const cursor = new THREE.Vector2();
const mouseEvent = fromEvent<MouseEvent>(window, "mousemove");
const throttledMouse = mouseEvent.pipe(throttle(() => interval(10)));
throttledMouse.subscribe((event) => {
  cursor.x = 2 * (event.clientX / innerWidth - 0.5);
  cursor.y = -2 * (event.clientY / innerHeight - 0.5);
});

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

  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // const rayOrigin = new THREE.Vector3(-3, 0, 0);
  // const rayDirection = new THREE.Vector3(1, 0, 0);
  // rayDirection.normalize();
  // raycaster.set(rayOrigin, rayDirection);
  raycaster.setFromCamera(cursor, camera);
  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  objectsToTest.forEach((obj) => {
    obj.material.color.set("#ff0000");
  });
  intersects.forEach((obj) => {
    obj.object.material.color.set("#0000ff");
  });

  if (duck) {
    const modelInterescts = raycaster.intersectObject(duck);
    if (modelInterescts.length > 0) {
      duck.scale.set(1.2, 1.2, 1.2);
    } else {
      duck.scale.set(1, 1, 1);
    }
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

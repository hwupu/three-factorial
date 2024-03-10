import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as CANNON from "cannon";
import type { Vector3Like } from "three";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper());

const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  },
);
world.addContactMaterial(defaultContactMaterial);
world.defaultMaterial = defaultMaterial;

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  shape: floorShape,
  material: defaultMaterial,
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

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

const objectsToUpdate: Array<{
  mesh: THREE.Mesh;
  body: CANNON.Body;
}> = [];
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphaereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
});
const createSphere = (radius: number, position: Vector3Like) => {
  const mesh = new THREE.Mesh(sphereGeometry, sphaereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(position.x, position.y, position.z),
    shape,
    material: defaultMaterial,
  });
  world.addBody(body);

  objectsToUpdate.push({
    mesh,
    body,
  });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });
createSphere(0.2, { x: 2, y: 3, z: 0 });
createSphere(0.3, { x: 2, y: 3, z: 2 });

const clock = new THREE.Clock();
let oldElapsedTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  objectsToUpdate.map(({ mesh, body }) => {
    /*
    body.applyForce(
      new CANNON.Vec3(Math.sin(elapsedTime), 0, Math.cos(elapsedTime)),
      body.position,
    );
    */
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
  });
  world.step(1 / 60, deltaTime, 3);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

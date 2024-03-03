import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/examples/jsm/Addons.js";
import GUI from "lil-gui";

const gui = new GUI();
const scene = new THREE.Scene();

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 1;
gui.add(ambientLight, "intensity").min(0).max(3).step(0.01).name("ambient");
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight();
directionalLight.color = new THREE.Color(0x005555);
directionalLight.intensity = 1;
directionalLight.position.set(1, 0.25, 0);
gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(3)
  .step(0.01)
  .name("directional");
scene.add(directionalLight);

const hemisphereLight = new THREE.HemisphereLight();
hemisphereLight.color = new THREE.Color(0xff0000);
hemisphereLight.groundColor = new THREE.Color(0x0000ff);
hemisphereLight.intensity = 0.9;
gui
  .add(hemisphereLight, "intensity")
  .min(0)
  .max(3)
  .step(0.01)
  .name("hemisphere");
scene.add(hemisphereLight);
const hslHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.1);
scene.add(hslHelper);

const pointLight = new THREE.PointLight();
pointLight.color = new THREE.Color(0xff9000);
pointLight.intensity = 1.5;
pointLight.distance = 3;
pointLight.decay = 2;
pointLight.position.set(1, -0.5, 1);
gui.add(pointLight, "intensity").min(0).max(3).step(0.01).name("point");
gui.add(pointLight, "distance").min(0).max(5).step(0.01).name("point-distance");
gui.add(pointLight, "decay").min(0).max(5).step(0.01).name("point-decay");
scene.add(pointLight);

const rectAreaLight = new THREE.RectAreaLight();
rectAreaLight.color = new THREE.Color(0x4e00ff);
rectAreaLight.intensity = 6;
rectAreaLight.width = 1;
rectAreaLight.height = 1;
rectAreaLight.position.set(-1, -0.5, 2);
rectAreaLight.lookAt(new THREE.Vector3());
gui.add(rectAreaLight, "intensity").min(0).max(3).step(0.01).name("rect-area");
scene.add(rectAreaLight);
scene.add(new RectAreaLightHelper(rectAreaLight));

const spotLight = new THREE.SpotLight();
spotLight.color = new THREE.Color(0x78ff00);
spotLight.intensity = 4.5;
spotLight.distance = 10;
spotLight.angle = Math.PI * 0.1;
spotLight.penumbra = 0.25;
spotLight.decay = 1;
spotLight.position.set(-3, 2, 3);
scene.add(spotLight);

spotLight.target.position.x = -0.25;
scene.add(spotLight.target);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), material);
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1), material);
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2), material);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
floor.scale.x = 12;
floor.scale.y = 8;
floor.rotation.x = Math.PI * -0.5;
floor.position.y = -1;
sphere.position.x = -2;
torus.position.x = 2;
scene.add(sphere, box, torus, floor);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight);
camera.position.set(4, 2, 4);
camera.lookAt(new THREE.Vector3());
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
  box.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = -0.5 * elapsedTime;
  box.rotation.x = -0.5 * elapsedTime;
  torus.rotation.x = -0.5 * elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

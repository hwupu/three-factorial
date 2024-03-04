import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");
bakedShadow.colorSpace = THREE.SRGBColorSpace;
simpleShadow.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.set(2, 2, -1);
sun.castShadow = true;
// make shadow blur, but has no effect on PCFSoftShadowMap
// sun.shadow.radius = 10;
sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 6;
sun.shadow.camera.top = 2;
sun.shadow.camera.bottom = -1;
sun.shadow.camera.left = -1;
sun.shadow.camera.right = 1;
scene.add(sun);

const dLightCamHelper = new THREE.CameraHelper(sun.shadow.camera);
scene.add(dLightCamHelper);

const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);
spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

gsap.to(spotLight.target.position, {
  y: 1,
  ease: "power1.out",
  repeat: -1,
  yoyo: true,
});
scene.add(spotLight);
scene.add(spotLight.target);

const sLightCamHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(sLightCamHelper);

const pointLight = new THREE.PointLight(0xff5555, 2, 3.5, 0.5);
pointLight.position.set(1, 2, 1);
pointLight.castShadow = true;
pointLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
pointLight.shadow.camera.far = 3;
scene.add(pointLight);

const pLightCamHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pLightCamHelper);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), material);
sphere.castShadow = true;
gsap.to(sphere.position, { y: 1, ease: "power1.out", repeat: -1, yoyo: true });
scene.add(sphere);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  material,
  // new THREE.MeshBasicMaterial({ map: bakedShadow }),
);
floor.scale.x = 12;
floor.scale.y = 8;
floor.rotation.x = Math.PI * -0.5;
floor.position.y = -0.5;
floor.receiveShadow = true;
scene.add(floor);

const shadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x550000,
    transparent: true,
    alphaMap: simpleShadow,
  }),
);
shadow.rotation.x = Math.PI * -0.5;
shadow.position.y = floor.position.y + 0.01;
gsap.to(shadow.position, { z: -1, ease: "power1.out", repeat: -1, yoyo: true });
scene.add(shadow);

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

// Disabled to experiment with baked shadow map.
renderer.shadowMap.enabled = true;

// THREE.BasicShadowMap - high performance, but lossy quality
// THREE.PCFShadowMap - default
// THREE.PCFSoftShadowMap - less performance, but softer edges
// THREE.VSMShadowMap - less performance, more constrants, can have unexpected results
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

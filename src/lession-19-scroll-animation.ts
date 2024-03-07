import "./index.css";
import * as THREE from "three";
import GUI from "lil-gui";
import gsap from "gsap";
import { fromEvent, throttle, interval } from "rxjs";

const parameters = {
  color: "#ffeded",
  gap: 4,
  counts: 1000,
  size: 0.03,
};

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

const scene = new THREE.Scene();

const material = new THREE.MeshToonMaterial({
  color: parameters.color,
  gradientMap: gradientTexture,
});
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material,
);

mesh2.position.y = parameters.gap * -1;
mesh3.position.y = parameters.gap * -2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3);
const meshes = [mesh1, mesh2, mesh3];

const position = new Float32Array(parameters.counts * 3);
for (const i in Array.from(Array(parameters.counts).keys())) {
  const i3 = i * 3;
  position[i3 + 0] = (Math.random() - 0.5) * 7;
  position[i3 + 1] = parameters.gap * 0.5 - Math.random() * parameters.gap * 3;
  position[i3 + 2] = (Math.random() - 0.5) * 7;
}
const ptGeo = new THREE.BufferGeometry();
ptGeo.setAttribute("position", new THREE.BufferAttribute(position, 3));
const ptMat = new THREE.PointsMaterial({
  color: parameters.color,
  size: parameters.size,
  sizeAttenuation: true,
});
const points = new THREE.Points(ptGeo, ptMat);
points.position.z = -1;
scene.add(points);

const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

const gui = new GUI();
gui
  .addColor(parameters, "color")
  .onChange(() => material.color.set(parameters.color));

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight);
camera.position.z = 4;
cameraGroup.add(camera);
const canvas = document.querySelector("canvas.webgl") as HTMLElement;
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let currentSection = 0;
let scrollY = window.scrollY;
const scrollEvent = fromEvent(window, "scroll");
const throttledScroll = scrollEvent.pipe(throttle(() => interval(10)));
throttledScroll.subscribe(() => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / innerHeight);
  if (newSection != currentSection) {
    currentSection = newSection;
    gsap.to(meshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=3",
    });
  }
});

const cursor = {
  x: 0,
  y: 0,
};
const mouseEvent = fromEvent<MouseEvent>(window, "mousemove");
const throttledMouse = mouseEvent.pipe(throttle(() => interval(10)));
throttledMouse.subscribe((event) => {
  cursor.x = event.clientX / innerWidth - 0.5;
  cursor.y = event.clientY / innerHeight - 0.5;
});

const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  camera.position.y = (-scrollY / innerHeight) * parameters.gap;

  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.02;
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.02;

  for (const mesh of [mesh1, mesh2, mesh3]) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

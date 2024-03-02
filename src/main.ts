import "./index.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
// scene.add(new THREE.AxesHelper());

const textureLoader = new THREE.TextureLoader();
const matcaps = textureLoader.load("/textures/matcaps/4.png");
const matcaps2 = textureLoader.load("/textures/matcaps/1.png");
matcaps.colorSpace = THREE.SRGBColorSpace;
matcaps2.colorSpace = THREE.SRGBColorSpace;

const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello Three.js", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   (textGeometry.boundingBox!.max.x - 0.2) * -0.5,
  //   (textGeometry.boundingBox!.max.y - 0.2) * -0.5,
  //   (textGeometry.boundingBox!.max.z - 0.2) * -0.5,
  // );
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial();
  textMaterial.matcap = matcaps;
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const donutMaterial1 = new THREE.MeshMatcapMaterial();
  const donutMaterial2 = new THREE.MeshMatcapMaterial();
  donutMaterial1.matcap = matcaps;
  donutMaterial2.matcap = matcaps2;
  for (let i of Array.from(Array(100).keys())) {
    const donut = new THREE.Mesh(
      donutGeometry,
      i % 2 ? donutMaterial1 : donutMaterial2,
    );
    donut.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
    );
    donut.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    );
    const s = 0.2 + 0.8 * Math.random();
    donut.scale.set(s, s, s);

    // Should test for collision with text
    // if so, eat the donut (continue)
    scene.add(donut);
  }
});

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight);
camera.position.set(0, 0, 5);
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

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();

import * as THREE from "three";
import { GLTFLoader } from "./vendor/GLTFLoader.js";

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

export function startHero() {
  const canvas = document.querySelector("#computer-canvas");
  const stage = canvas?.closest(".computer-stage");
  if (!canvas || !stage || !window.WebGLRenderingContext) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 1.75, 9.2);
  camera.lookAt(0, 0.1, 0);
  const group = new THREE.Group();
  scene.add(group);

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, isCoarsePointer ? 1.25 : 1.6),
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const key = new THREE.DirectionalLight(0xf4f0e8, 3.2);
  key.position.set(4, 6, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x2452e8, 1.5);
  fill.position.set(-5, 1, 2);
  scene.add(fill, new THREE.HemisphereLight(0xe9e7e1, 0x17226b, 1.5));

  let model,
    needsRender = true;
  new GLTFLoader().load(
    "./assets/computer-web.glb",
    (gltf) => {
      model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const scale = 2.75 / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      model.position.set(
        -center.x * scale,
        -center.y * scale - 0.25,
        -center.z * scale,
      );
      model.rotation.set(-0.1, -0.62, 0.04);
      group.add(model);
      stage.classList.add("model-ready");
      needsRender = true;
    },
    undefined,
    () => stage.classList.add("model-failed"),
  );

  function resize() {
    needsRender = true;
    const rect = stage.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.position.z = 9.2;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  let pointerX = 0,
    pointerY = 0,
    targetX = 0,
    targetY = 0;
  window.addEventListener(
    "pointermove",
    (event) => {
      if (isCoarsePointer || reduceMotion) return;
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true },
  );

  let visible = true;
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
    },
    { threshold: 0.02 },
  ).observe(stage);

  const clock = new THREE.Clock();
  function render() {
    requestAnimationFrame(render);
    if (!visible || document.hidden || (reduceMotion && !needsRender)) return;
    needsRender = false;
    const t = clock.getElapsedTime();
    pointerX += (targetX - pointerX) * 0.045;
    pointerY += (targetY - pointerY) * 0.045;
    if (model) {
      model.rotation.y =
        -0.62 +
        pointerX * 0.15 +
        (reduceMotion ? 0 : Math.sin(t * 0.45) * 0.035);
      model.rotation.x = -0.1 + pointerY * 0.07;
      group.position.y = reduceMotion ? 0 : Math.sin(t * 0.7) * 0.05;
    }
    renderer.render(scene, camera);
  }
  render();
}

import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create a scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, -2);

// Create a WebGLRenderer and add it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the models
let firstModel = null;
let secondModel = null;
new MTLLoader().load("public/chiral_trefoil_knots_left.mtl", (mtl) => {
  mtl.preload();
  // allow mtl to be transparent
  const objLoader = new OBJLoader();
  objLoader.setMaterials(mtl);
  objLoader.load("public/chiral_trefoil_knots_left.obj", (obj) => {
    firstModel = obj;
    firstModel.position.set(1, 0, 0);
    firstModel.rotation.x = -Math.PI/4;
    firstModel.rotation.y = Math.PI/4;
    scene.add(firstModel);
  });
});
new MTLLoader().load("public/chiral_trefoil_knots_right.mtl", (mtl) => {
  mtl.preload();
  const objLoader = new OBJLoader();
  objLoader.setMaterials(mtl);
  objLoader.load("public/chiral_trefoil_knots_right.obj", (obj) => {
    secondModel = obj;
    secondModel.position.set(-1, 0, 0);
    secondModel.rotation.x = -Math.PI/4;
    secondModel.rotation.y = -Math.PI/4;
    scene.add(secondModel);
  });
});

// Set up the controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enableRotate = false;
controls.enablePan = false;
controls.target.set(0, 0, 0);
controls.update();

// Add touch event listeners
renderer.domElement.addEventListener('touchstart', onTouchStart, false);
renderer.domElement.addEventListener('touchmove', onTouchMove, false);
renderer.domElement.addEventListener('touchend', onTouchEnd, false);

// Create a hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
scene.add(hemisphereLight);

// Create a point light
// const pointLight = new THREE.PointLight(0xffffff, 1);
// pointLight.position.set(10, 10, 10);
// scene.add(pointLight);


let isRotating = false;
let lastTouchX0;
let lastTouchY0;
let lastTouchX1;
let lastTouchY1;

function onTouchStart(event) {
  isRotating = true;
  lastTouchX0 = event.touches[0].clientX;
  lastTouchY0 = event.touches[0].clientY;
  if (event.touches.length > 1) {
    lastTouchX1 = event.touches[1].clientX;
    lastTouchY1 = event.touches[1].clientY;
  }
}

function onTouchMove(event) {
  if (isRotating) {
    const rotationSpeed = 0.01;

    let model0 = null;
    if (event.touches[0].clientX < window.innerWidth / 2) {
      model0 = firstModel;
    } else {
      model0 = secondModel;
    }
    const deltaX0 = event.touches[0].clientX - lastTouchX0;
    const deltaY0 = event.touches[0].clientY - lastTouchY0;
    model0.rotation.y += deltaX0 * rotationSpeed;
    model0.rotation.x -= deltaY0 * rotationSpeed;
    lastTouchX0 = event.touches[0].clientX;
    lastTouchY0 = event.touches[0].clientY;

    if (event.touches.length > 1) {
      let model1 = null;
      if (event.touches[1].clientX < window.innerWidth / 2) {
        model1 = firstModel;
      } else {
        model1 = secondModel;
      }
      const deltaX1 = event.touches[1].clientX - lastTouchX1;
      const deltaY1 = event.touches[1].clientY - lastTouchY1;
      model1.rotation.y += deltaX1 * rotationSpeed;
      model1.rotation.x -= deltaY1 * rotationSpeed;
      lastTouchX1 = event.touches[1].clientX;
      lastTouchY1 = event.touches[1].clientY;
    }
  }
}

function onTouchEnd() {
  isRotating = false;
}

// Handle window resizing
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

import * as THREE from "three";
import GUI from "lil-gui";  
import { bigDipperStars, cassiopeiaStars, defaultStars, leoStars, orionStars } from "./constants/constant";
import { createBigDipper, createCassiopeia, createLeo, createOrion } from "./utils/animation";
import { constellationLineMaterial } from "./utils/connectingLines";
import { generateGalaxy } from "./utils/generateGalaxy";
const gui = new GUI();
const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();
const backgroundParameters = {
  topColor: "#000000",
  bottomColor: "#000814",
};

const createGradientTexture = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 512;
  canvas.height = 512;

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0.11, backgroundParameters.topColor);
  gradient.addColorStop(1, backgroundParameters.bottomColor);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return new THREE.CanvasTexture(canvas);
};

scene.background = createGradientTexture();

const backgroundFolder = gui.addFolder("Background");
backgroundFolder.addColor(backgroundParameters, "topColor").onChange(() => {
  scene.background = createGradientTexture();
});
backgroundFolder.addColor(backgroundParameters, "bottomColor").onChange(() => {
  scene.background = createGradientTexture();
});

const mouse = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth - 1.9) * 0.2;
  mouse.y = (event.clientY / window.innerHeight - 1.9) * 0.2;
});

const parameters = {};
parameters.count = 6000;
parameters.size = 0.001;
parameters.radius = 5;
parameters.branches = 5;
parameters.spin = 1;
parameters.randomness = 0.5;
parameters.randomnessPower = 3;
parameters.insideColor = "#ffffff";
parameters.outsideColor = "#ffffff";

let geometry = null;
let material = null;
let points = null;

const constellationMode = {
  currentConstellation: null,
  constellationLines: [],
  constellationStars: [],
  savedConstellations: [],
  isAnimating: false,
  animationProgress: 0,
};

const constellationStarMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05,
  transparent: true,
  opacity: 0.6,
  map: createCircleTexture(),
  alphaTest: 0.001,
  sizeAttenuation: true
});


function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  
  return new THREE.CanvasTexture(canvas);
}

const interactiveMode = {
  isActive: true,
  selectedStars: [],
  connectionLines: [],
  hoveredStar: null,
  allConstellationStars: null,
};

const raycaster = new THREE.Raycaster();
const mousePosition = new THREE.Vector2();

const createDefaultConstellationPoints = () => {
  
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(defaultStars.length * 3);
  
  defaultStars.forEach((star, i) => {
    positions[i * 3] = star.x;
    positions[i * 3 + 1] = star.y;
    positions[i * 3 + 2] = star.z;
  });
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const stars = new THREE.Points(geometry, constellationStarMaterial);
  scene.add(stars);
  interactiveMode.allConstellationStars = stars;
  
  return defaultStars;
};

const createInteractiveLine = (point1, point2) => {
  const geometry = new THREE.BufferGeometry().setFromPoints([point1, point2]);
  const line = new THREE.Line(geometry, constellationLineMaterial);
  scene.add(line);
  interactiveMode.connectionLines.push(line);
  return line;
};

const onMouseClick = (event) => {
  if (!interactiveMode.isActive) return;

  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mousePosition, camera);

  if (interactiveMode.allConstellationStars) {
    const intersects = raycaster.intersectObject(interactiveMode.allConstellationStars);
    
    if (intersects.length > 0) {
      const intersection = intersects[0];
      const starPosition = intersection.point;

      interactiveMode.selectedStars.push(starPosition.clone());
      
      if (interactiveMode.selectedStars.length >= 2) {
        const lastIndex = interactiveMode.selectedStars.length - 1;
        createInteractiveLine(
          interactiveMode.selectedStars[lastIndex - 1],
          interactiveMode.selectedStars[lastIndex]
        );
      }
    }
  }
};

const clearInteractiveConnections = () => {
  interactiveMode.connectionLines.forEach(line => {
    scene.remove(line);
    line.geometry.dispose();
  });
  interactiveMode.connectionLines = [];
  interactiveMode.selectedStars = [];
};

canvas.addEventListener('click', onMouseClick);

const createConstellationStars = (starPositions) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starPositions.length * 3);
  
  starPositions.forEach((star, i) => {
    positions[i * 3] = star.x;
    positions[i * 3 + 1] = star.y;
    positions[i * 3 + 2] = star.z;
  });
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const stars = new THREE.Points(geometry, constellationStarMaterial);
  scene.add(stars);
  constellationMode.constellationStars.push(stars);
  
  // Animate stars appearing
  const startTime = Date.now();
  const duration = 800;
  
  const animateStars = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Pulse effect for stars
    const pulse = 0.4;
    constellationStarMaterial.opacity = progress * pulse;
    constellationStarMaterial.size = 0.03 + (progress * 0.02);
    
    if (progress < 1) {
      requestAnimationFrame(animateStars);
    } else {
      constellationStarMaterial.opacity = 0.8;
      constellationStarMaterial.size = 0.05;
    }
  };
  
  animateStars();
};

const clearConstellation = () => {
  // Clear predefined constellation lines
  constellationMode.constellationLines.forEach(line => {
    scene.remove(line);
    line.geometry.dispose();
  });
  constellationMode.constellationLines = [];
  
  // Clear predefined constellation stars
  constellationMode.constellationStars.forEach(stars => {
    scene.remove(stars);
    stars.geometry.dispose();
  });
  constellationMode.constellationStars = [];
  
  // Clear interactive connections
  clearInteractiveConnections();
  
  constellationMode.currentConstellation = null;
  constellationMode.isAnimating = false;
};

const initializeScene = () => {
  const result = generateGalaxy(parameters, renderer, geometry, material, points, scene);
  geometry = result.geometry;
  material = result.material;
  points = result.points;
  createDefaultConstellationPoints();
};

const constellationFolder = gui.addFolder("� Constellations");

const constellationInfo = { currentConstellation: "None" };
constellationFolder.add(constellationInfo, "currentConstellation").name("Current").listen();

constellationFolder.add({ 
  createBigDipper: () => {
    clearConstellation();
    createBigDipper(constellationMode, createConstellationStars, scene);
  }
}, "createBigDipper").name("⭐ Big Dipper").onChange(() => {
  constellationInfo.currentConstellation = "Big Dipper";
});
constellationFolder.add({ 
  createOrion: () => {
    clearConstellation();
    createOrion(constellationMode, createConstellationStars, scene);
  }
}, "createOrion").name("🏹 Orion").onChange(() => {
  constellationInfo.currentConstellation = "Orion";
});
constellationFolder.add({ 
  createCassiopeia: () => {
    clearConstellation();
    createCassiopeia(constellationMode, createConstellationStars, scene);
  }
}, "createCassiopeia").name("👑 Cassiopeia").onChange(() => {
  constellationInfo.currentConstellation = "Cassiopeia";
});
constellationFolder.add({ 
  createLeo: () => {
    clearConstellation();
    createLeo(constellationMode, createConstellationStars, scene);
  }
}, "createLeo").name("🦁 Leo").onChange(() => {
  constellationInfo.currentConstellation = "Leo";
});

// Clear function
constellationFolder.add({ 
  clear: () => {
    clearConstellation();
    constellationInfo.currentConstellation = "None";
  }
}, "clear").name("�️ Clear");

// Line appearance controls
const lineFolder = constellationFolder.addFolder("📏 Line Style");
lineFolder.addColor(constellationLineMaterial, "color").name("Line Color");
lineFolder.add(constellationLineMaterial, "opacity", 0.1, 1, 0.1).name("Line Opacity");

// Point appearance controls
const pointFolder = constellationFolder.addFolder("⭐ Point Style");
pointFolder.addColor(constellationStarMaterial, "color").name("Point Color");
pointFolder.add(constellationStarMaterial, "size", 0.05, 0.3, 0.01).name("Point Size");
pointFolder.add(constellationStarMaterial, "opacity", 0.1, 1, 0.1).name("Point Opacity");

// Interactive mode controls
const interactiveFolder = constellationFolder.addFolder("🎯 Interactive Mode");
interactiveFolder.add(interactiveMode, "isActive").name("Click to Connect");
interactiveFolder.add({ 
  clear: () => clearInteractiveConnections()
}, "clear").name("🗑️ Clear Connections");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  75
);
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Initialize the scene with stars and constellation points
initializeScene();

const clock = new THREE.Clock();
let targetPosition = camera.position.clone(); // Target position for the camera movement
let isZooming = false;
const zoomSpeed = 0.01;
let angle = 7;
const radius = 7; // Base radius for the camera motion

// Animate function
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update shader time uniform
  if (material && material.uniforms && material.uniforms.uTime) {
    material.uniforms.uTime.value = elapsedTime;
  }

  camera.position.x += (mouse.x * 2 - camera.position.x) * 0.09;
  camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.09;

  if (isZooming) {
    angle = elapsedTime * zoomSpeed;

    const dynamicRadius = radius + Math.sin(elapsedTime * 0.2) * 1;
    const targetX = dynamicRadius * Math.cos(angle);
    const targetZ = dynamicRadius * Math.sin(angle);
    const targetY = 10 + Math.sin(angle * 2) * 2; // Gentler vertical movement

    targetPosition.set(targetX, targetY, targetZ);
    camera.position.lerp(targetPosition, 0.06); // Adjust 0.05 to make the transition slower/faster

    camera.lookAt(scene.position);
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();


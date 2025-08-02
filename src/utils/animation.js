import { bigDipperStars, orionStars, cassiopeiaStars, leoStars } from '../constants/constant.js';
import * as THREE from "three";
import { constellationLineMaterial } from './connectingLines.js';

const createAnimatedConstellationLine = (point1, point2, scene, constellationMode, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array([
        point1.x, point1.y, point1.z,
        point1.x, point1.y, point1.z  // Start with zero length
      ]);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const line = new THREE.Line(geometry, constellationLineMaterial);
      scene.add(line);
      constellationMode.constellationLines.push(line);
      
      const startTime = Date.now();
      const duration = 600;
      
      const animateLine = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
 
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentEnd = point1.clone().lerp(point2, easedProgress);
        const newPositions = new Float32Array([
          point1.x, point1.y, point1.z,
          currentEnd.x, currentEnd.y, currentEnd.z
        ]);
        
        line.geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
        line.geometry.attributes.position.needsUpdate = true;
        
        if (progress < 1) {
          requestAnimationFrame(animateLine);
        } else {
          resolve();
        }
      };
      
      animateLine();
    }, delay);
  });
};

export const createBigDipper = async (constellationMode, createConstellationStars, scene) => {
  if (constellationMode.isAnimating) return;
   
  constellationMode.isAnimating = true;

  // First, create the constellation stars
  createConstellationStars(bigDipperStars);
  
  // Wait a bit before starting line animation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Animate lines in sequence
  // Bowl: Dubhe -> Merak -> Phecda -> Megrez -> Dubhe (close bowl)
  await createAnimatedConstellationLine(bigDipperStars[0], bigDipperStars[1], scene, constellationMode, 0);
  await createAnimatedConstellationLine(bigDipperStars[1], bigDipperStars[2], scene, constellationMode, 200);
  await createAnimatedConstellationLine(bigDipperStars[2], bigDipperStars[3], scene, constellationMode, 200);
  await createAnimatedConstellationLine(bigDipperStars[3], bigDipperStars[0], scene, constellationMode, 200);
  
  // Handle: Megrez -> Alioth -> Mizar -> Alkaid
  await createAnimatedConstellationLine(bigDipperStars[3], bigDipperStars[4], scene, constellationMode, 300);
  await createAnimatedConstellationLine(bigDipperStars[4], bigDipperStars[5], scene, constellationMode, 200);
  await createAnimatedConstellationLine(bigDipperStars[5], bigDipperStars[6], scene, constellationMode, 200);
  
  constellationMode.currentConstellation = "Big Dipper";
  constellationMode.isAnimating = false;
  console.log("Animated Big Dipper constellation complete");
};

export const createOrion = async (constellationMode, createConstellationStars, scene) => {
  if (constellationMode.isAnimating) return;
  
  constellationMode.isAnimating = true;
  
  // Create constellation stars first
  createConstellationStars(orionStars);
  
  // Wait before starting line animation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Start with Orion's Belt (most distinctive feature)
  await createAnimatedConstellationLine(orionStars[2], orionStars[3], scene, constellationMode, 0);
  await createAnimatedConstellationLine(orionStars[3], orionStars[4], scene, constellationMode, 200);
  
  // Shoulders from belt
  await createAnimatedConstellationLine(orionStars[2], orionStars[0], scene, constellationMode, 300); // Alnitak to Betelgeuse
  await createAnimatedConstellationLine(orionStars[4], orionStars[1], scene, constellationMode, 200); // Mintaka to Bellatrix
  
  // Body/legs from belt
  await createAnimatedConstellationLine(orionStars[2], orionStars[5], scene, constellationMode, 300); // Alnitak to Saiph
  await createAnimatedConstellationLine(orionStars[4], orionStars[6], scene, constellationMode, 200); // Mintaka to Rigel
  
  // Sword hanging from belt
  await createAnimatedConstellationLine(orionStars[3], orionStars[7], scene, constellationMode, 400); // Belt to sword
  await createAnimatedConstellationLine(orionStars[7], orionStars[8], scene, constellationMode, 200);
  await createAnimatedConstellationLine(orionStars[8], orionStars[9], scene, constellationMode, 200);
  
  constellationMode.currentConstellation = "Orion";
  constellationMode.isAnimating = false;
  console.log("Animated Orion constellation complete");
};

export const createCassiopeia = async (constellationMode, createConstellationStars, scene) => {
  if (constellationMode.isAnimating) return;
  
  constellationMode.isAnimating = true;
  
  // Create constellation stars first
  createConstellationStars(cassiopeiaStars);
  
  // Wait before starting line animation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Connect the stars in W pattern with animation
  for (let i = 0; i < cassiopeiaStars.length - 1; i++) {
    await createAnimatedConstellationLine(cassiopeiaStars[i], cassiopeiaStars[i + 1], scene, constellationMode, 250);
  }
  
  constellationMode.currentConstellation = "Cassiopeia";
  constellationMode.isAnimating = false;
  console.log("Animated Cassiopeia constellation complete");
};

export const createLeo = async (constellationMode, createConstellationStars, scene) => {
  if (constellationMode.isAnimating) return;
  
  constellationMode.isAnimating = true;

  // Create constellation stars first
  createConstellationStars(leoStars);
  
  // Wait before starting line animation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Lion's body first (main feature)
  await createAnimatedConstellationLine(leoStars[0], leoStars[1], scene, constellationMode, 0); // Regulus to Eta
  await createAnimatedConstellationLine(leoStars[1], leoStars[2], scene, constellationMode, 250); // Body
  await createAnimatedConstellationLine(leoStars[2], leoStars[3], scene, constellationMode, 250); // Body
  await createAnimatedConstellationLine(leoStars[3], leoStars[4], scene, constellationMode, 250); // To tail
  
  // Lion's mane/back
  await createAnimatedConstellationLine(leoStars[3], leoStars[5], scene, constellationMode, 400); // Back
  await createAnimatedConstellationLine(leoStars[5], leoStars[6], scene, constellationMode, 250); // Mane
  await createAnimatedConstellationLine(leoStars[6], leoStars[7], scene, constellationMode, 250); // Mane
  await createAnimatedConstellationLine(leoStars[7], leoStars[0], scene, constellationMode, 250); // Close mane to head
  
  constellationMode.currentConstellation = "Leo";
  constellationMode.isAnimating = false;
  console.log("Animated Leo constellation complete");
};
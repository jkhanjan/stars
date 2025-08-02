import * as THREE from "three";
  
  export const defaultStars = [
    // Big Dipper area
    new THREE.Vector3(-3, 1.0, -1),
    new THREE.Vector3(-2, 1.5, -0.5),
    new THREE.Vector3(-0.5, 1.3, 0),
    new THREE.Vector3(0.8, 1.5, 0.2),
    new THREE.Vector3(2, 1.2, 0.5),
    new THREE.Vector3(3, 0.7, 0.8),
    new THREE.Vector3(3.8, 0.15, 1),
    
    // Orion area
    new THREE.Vector3(-1.2, 2.5, 0),
    new THREE.Vector3(1.8, 2.2, 0.3),
    new THREE.Vector3(-0.8, 1, -0.2),
    new THREE.Vector3(0, 0.9, 0),
    new THREE.Vector3(0.8, 0.8, 0.2),
    new THREE.Vector3(-1.8, -0.8, -0.5),
    new THREE.Vector3(2.2, -1, 0.8),
    new THREE.Vector3(-0.5, -1.5, 0),
    new THREE.Vector3(0, -1.8, 0),
    new THREE.Vector3(0.5, -1.6, 0),
    
    // Cassiopeia area
    new THREE.Vector3(-2.5, 0.5, 0),
    new THREE.Vector3(-1.2, 1.8, 0.2),
    new THREE.Vector3(0, 0.8, 0),
    new THREE.Vector3(1.5, 2, -0.3),
    new THREE.Vector3(2.8, 0.3, 0.5),
    
    // Leo area
    new THREE.Vector3(-2, 1.5, 0),
    new THREE.Vector3(-1, 0.8, 0.3),
    new THREE.Vector3(0, 0.2, 0),
    new THREE.Vector3(1.5, 0.5, -0.2),
    new THREE.Vector3(2.5, 1.2, 0.5),
    new THREE.Vector3(1.8, 2, 0.2),
    new THREE.Vector3(0.5, 2.3, 0),
    new THREE.Vector3(-1.2, 2.5, -0.3),
  ];

export const bigDipperStars = [
    new THREE.Vector3(-3, 1.2, -1),    // Dubhe
    new THREE.Vector3(-2, 1.8, -0.5),  // Merak
    new THREE.Vector3(-0.5, 1.5, 0),   // Phecda
    new THREE.Vector3(0.8, 1.7, 0.2),  // Megrez
    new THREE.Vector3(2, 1.4, 0.5),    // Alioth
    new THREE.Vector3(3, 0.9, 0.8),    // Mizar
    new THREE.Vector3(3.8, 0.3, 1),    // Alkaid
  ];
  
   export  const orionStars = [
    new THREE.Vector3(-1.2, 2.5, 0),    // Betelgeuse (red giant)
    new THREE.Vector3(1.8, 2.2, 0.3),   // Bellatrix
    new THREE.Vector3(-0.8, 1, -0.2),   // Alnitak (belt)
    new THREE.Vector3(0, 0.9, 0),       // Alnilam (belt)
    new THREE.Vector3(0.8, 0.8, 0.2),   // Mintaka (belt)
    new THREE.Vector3(-1.8, -0.8, -0.5), // Saiph
    new THREE.Vector3(2.2, -1, 0.8),    // Rigel (blue giant)
    new THREE.Vector3(-0.5, -1.5, 0),   // Sword star 1
    new THREE.Vector3(0, -1.8, 0),      // Sword star 2 (Orion Nebula)
    new THREE.Vector3(0.5, -1.6, 0),    // Sword star 3
  ];

    export const cassiopeiaStars = [
    new THREE.Vector3(-2.5, 0.5, 0),    // Caph
    new THREE.Vector3(-1.2, 1.8, 0.2),  // Shedar
    new THREE.Vector3(0, 0.8, 0),       // Gamma Cas
    new THREE.Vector3(1.5, 2, -0.3),    // Ruchbah
    new THREE.Vector3(2.8, 0.3, 0.5),   // Segin
  ];

    export const leoStars = [
    new THREE.Vector3(-2, 1.5, 0),      // Regulus (heart of the lion)
    new THREE.Vector3(-1, 0.8, 0.3),    // Eta Leonis
    new THREE.Vector3(0, 0.2, 0),       // Algieba
    new THREE.Vector3(1.5, 0.5, -0.2),  // Zosma
    new THREE.Vector3(2.5, 1.2, 0.5),   // Denebola (tail)
    new THREE.Vector3(1.8, 2, 0.2),     // Chort
    new THREE.Vector3(0.5, 2.3, 0),     // Theta Leonis
    new THREE.Vector3(-1.2, 2.5, -0.3), // Epsilon Leonis
  ];
  
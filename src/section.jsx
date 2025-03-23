



// import React, { useEffect, useState } from "react";

// import { motion } from "framer-motion";

// const points = [
//   { x: 70, y: 50, label: "Own the road (not just survive it)" },
//   { x: 370, y: 50, label: "Road safety is non-negotiable." },
//   { x: 670, y: 50, label: "Bad habits? We fix them before they start" },
//   { x: 510, y: 250, label: "No theory overload" },
//   { x: 210, y: 250, label: "Your first car? Consider it handled" },
// ];

// const createPathSegment = (p1, p2, index) => {
//   const midX = (p1.x + p2.x) / 2;
//   const midY = (p1.y + p2.y) / 2;
//   const dir = index % 2 === 0 ? 1 : 1;
//   const offset = 30;
//   const dx = p2.x - p1.x, dy = p2.y - p1.y;
//   const length = Math.sqrt(dx * dx + dy * dy);

//   return `M ${p1.x} ${p1.y} 
//   S ${midX + dir * offset * (-dy / length)}, ${midY + dir * offset * (dx / length)} ${midX}, ${midY}
//   S ${midX - dir * offset * (-dy / length)}, ${midY - dir * offset * (dx / length)} ${p2.x}, ${p2.y}`;
// };

// const SequentialPathAnimation = () => {
//   const [activeSegment, setActiveSegment] = useState(0);
//   const [pathProgress, setPathProgress] = useState(0);
//   const animationDuration = 1.5;
  
//   useEffect(() => {
//     let animationFrame;
//     let startTime = null;
    
//     const animate = (timestamp) => {
//       if (!startTime) startTime = timestamp;
//       const elapsed = timestamp - startTime;
//       const progress = Math.min(elapsed / (animationDuration * 1000), 1);
      
//       setPathProgress(progress);
      
//       if (progress < 1) {
//         animationFrame = requestAnimationFrame(animate);
//       } else {
        
//         if (activeSegment < points.length - 2) {
//           setTimeout(() => {
//             setActiveSegment(prev => prev + 1);
//             setPathProgress(0);
//           }, 300);
//         }
//       }
//     };
    
//     animationFrame = requestAnimationFrame(animate);
    
//     return () => {
//       cancelAnimationFrame(animationFrame);
//     };
//   }, [activeSegment]);

//   return (
//     <svg width="788" height="366" style={{ background: "#fff" }}>
//       {/* Red dashed paths (underneath) */}
//       {points.slice(0, 4).map((_, i) => (
//         <path
//           key={i}
//           d={createPathSegment(points[i], points[i + 1], i)}
//           fill="none"
//           stroke="red"
//           opacity={0.2}
//           strokeWidth="4"
//           strokeDasharray="8 6"
//         />
//       ))}

//       {points.slice(0, 4).map((_, i) => (
//         <motion.path
//           key={`blue-${i}`}
//           d={createPathSegment(points[i], points[i + 1], i)}
//           fill="none"
//           stroke="red"
//           opacity={0.9}
//           strokeWidth="4"
//           initial={{ pathLength: 0 }}
//           animate={{
//             pathLength: i === activeSegment ? pathProgress : i < activeSegment ? 1 : 0
//           }}
//           transition={{ duration: 0 }} 
//         />
//       ))}
      
//       {points.map((p, i) => (
//         <motion.g key={i}>
          
//           <motion.circle
//             cx={p.x}
//             cy={p.y}
//             r="42"
//             fill={"rgba(255, 219, 172, 1.0)"}
//             animate={{ scale: i === activeSegment || i === activeSegment + 1 ? [0.8, 1.2, 1] : 1 }}
//             transition={{ duration: 0.5 }}
//           />

//           {/* Blue Circle */}
//           <motion.circle
//             cx={p.x}
//             cy={p.y}
//             r="24"
//             fill={i <= activeSegment + 1 ? "rgb(33, 109, 254)" : "rgba(255, 255, 255, 0.2)"}
//             animate={{ scale: i === activeSegment || i === activeSegment + 1 ? [0.8, 1.2, 1] : 1 }}
//             transition={{ duration: 0.5 }}
//           />

//           <image
//             href="/Seatbelt.png" 
//             x={p.x - 12} 
//             y={p.y - 12} 
//             width="24"
//             height="24"
//             clipPath="circle(12px)" // Ensures it stays inside the circle
//           />

//           {/* Label */}
//           <motion.foreignObject
//             x={p.x - 70} 
//             y={p.y + 60}
//             width="150" 
//             height="50" 
//             animate={{ opacity: i <= activeSegment + 1 ? 1 : 0.5 }}
//           >
//             <div style={{ textAlign: "center", fontSize: "17px", color: "black", wordWrap: "break-word" }}>
//               {p.label}
//             </div>
//           </motion.foreignObject>
//         </motion.g>
//       ))}
//     </svg>
//   );
// };

// export default SequentialPathAnimation;
// "use client";

// const AnimatedSPath = () => {
//   return (
//     <svg
//       width="238"
//       height="53"
//       viewBox="0 0 238 53"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M155.727 0.759766C161.684 0.835137 167.608 1.69024 173.353 3.30434L172.601 6.1882C167.091 4.64007 161.41 3.82122 155.697 3.75157L155.727 0.759766ZM138.04 3.08844L138.792 5.97229C133.28 7.52493 127.965 9.73505 122.956 12.5574L121.557 9.93567C126.767 6.97842 132.3 4.66446 138.04 3.04217V3.08844ZM189.942 9.76603C193.146 11.3082 195.958 12.8504 198.394 14.2692C200.617 15.6086 202.941 16.7637 205.343 17.7236L204.501 20.5921C201.894 19.5709 199.379 18.3223 196.981 16.86C194.559 15.5183 191.807 13.9761 188.664 12.4186L189.942 9.76603ZM221.24 24.4783C224.654 25.5116 227.647 26.5602 230.264 27.5627C232.679 28.5146 235.163 29.2725 237.693 29.8296L237.317 32.7906C234.588 32.2237 231.911 31.4188 229.316 30.3848C226.714 29.4595 223.751 28.4108 220.397 27.4084L221.24 24.4783ZM106.863 20.0986L108.683 22.3501C107.72 23.1521 106.743 23.9848 105.765 24.8484C102.126 28.0716 98.5461 31.0171 95.1321 33.7313L93.3574 31.3564C96.7414 28.7193 100.261 25.7583 103.885 22.5815C104.863 21.7178 105.931 20.808 106.863 20.0523V20.0986ZM2.72843 26.807C8.02411 26.9434 13.1644 28.67 17.5124 31.7728L16.0085 34.3019C10.3686 30.6316 5.63107 29.3207 0.457429 29.9222L0.0664062 26.9766C0.948811 26.8508 1.83771 26.7787 2.72843 26.7607V26.807ZM79.0397 41.3496L80.5436 43.9405C75.4325 47.0656 69.9742 49.5509 64.2858 51.3429L63.4736 48.4745C68.9233 46.7309 74.1493 44.3233 79.0397 41.3034V41.3496ZM31.6347 42.3983C36.1402 45.8804 41.3273 48.3215 46.8398 49.554L46.2983 52.4995C40.3747 51.1692 34.8025 48.5385 29.9653 44.7887L31.6347 42.3983Z"
//         className="animate-path"
//       />
//       <style jsx>{`
//   .animate-path {
//     stroke: #f63d68;
//     stroke-width: 3;
//     fill: none;
//     animation: dashAnimation 0.8s ease-in-out forwards;
//   }

//   @keyframes dashAnimation {
//     0% {
//       stroke-dashoffset: 200;
//     }
//     100% {
//       stroke-dashoffset: 0;
//     }
//   }
// `}</style>

//     </svg>
//   );
// };

// export default AnimatedSPath;



// 'use client'
// import React, { useRef, useMemo, useState, useEffect } from 'react';
// import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
// import { shaderMaterial } from '@react-three/drei';
// import * as THREE from 'three';

// const GalaxyMaterial = shaderMaterial(
//     {
//         uSize: 25,
//         uTime: 0
//     },
//     // vertex shader
//     `
//         uniform float uSize;
//         uniform float uTime;
//         attribute float aScale;
//         attribute vec3 aRandomness;
//         varying vec3 vColor;
//         void main() {
//             vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//             float distanceFromCenter = length(modelPosition.xz);
//             float angle = atan(modelPosition.x, modelPosition.z);
//             float angleOffset = (1.0 / distanceFromCenter) * uTime * 0.05;
//             angle += angleOffset;
//             modelPosition.x = sin(angle) * distanceFromCenter;
//             modelPosition.z = cos(angle) * distanceFromCenter;
//             modelPosition.xyz += aRandomness - 0.5;
//             float flicker = 0.8 + 0.3 * sin(uTime * 2.0 + aRandomness.x * 5.0);
//             vec4 viewPosition = viewMatrix * modelPosition;
//             gl_Position = projectionMatrix * viewPosition;
//             gl_PointSize = uSize * aScale * (4.0 / -viewPosition.z) * flicker;
//             vColor = color;
//         }
//     `,
//     // fragment shader
//     `
//         void main() {
//             vec2 uv = gl_PointCoord;
//             float distanceFromCenter = length(uv - 0.5);
//             float alpha = 0.05 / distanceFromCenter - 0.15;
//             gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
//         }
//     `
// );

// extend({ GalaxyMaterial });

// const Galaxy = ({ isZooming, targetPosition, positionIndex }) => {
//     const points = useRef();
//     const { camera } = useThree();
//     const animationRef = useRef({
//         isAnimating: false,
//         startTime: 0,
//         duration: 1.5,
//     });

//     const parameters = {
//         count: 3000,
//         size: 0.01,
//         radius: 7,
//         branches: 5,
//         spin: 1,
//         randomness: 0.5,
//         randomnessPower: 3,
//         insideColor: '#ffffff',
//         outsideColor: '#ffffff'
//     };

//     const { geometry } = useMemo(() => {
//         const geometry = new THREE.BufferGeometry();
//         const positions = new Float32Array(parameters.count * 3);
//         const colors = new Float32Array(parameters.count * 3);
//         const scales = new Float32Array(parameters.count);
//         const randomValues = new Float32Array(parameters.count * 3);

//         const insideColorObj = new THREE.Color(parameters.insideColor);
//         const outsideColorObj = new THREE.Color(parameters.outsideColor);

//         for (let i = 0; i < parameters.count; i++) {
//             const i3 = i * 3;
//             const size = parameters.radius;
//             const x = (Math.random() - 0.5) * size * 2;
//             const y = (Math.random() - 0.5) * size * 2;
//             const z = (Math.random() - 0.5) * size * 2;

//             positions[i3] = x;
//             positions[i3 + 1] = y;
//             positions[i3 + 2] = z;

//             const randomX = Math.pow(Math.random(), parameters.randomnessPower) * parameters.randomness * size * (Math.random() < 0.5 ? 1 : -1);
//             const randomY = Math.pow(Math.random(), parameters.randomnessPower) * parameters.randomness * size * (Math.random() < 0.5 ? 1 : -1);
//             const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * parameters.randomness * size * (Math.random() < 0.5 ? 1 : -1);

//             randomValues[i3] = randomX;
//             randomValues[i3 + 1] = randomY;
//             randomValues[i3 + 2] = randomZ;

//             const distanceFromCenter = Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) / size;
//             const mixedColor = insideColorObj.clone();
//             mixedColor.lerp(outsideColorObj, distanceFromCenter);

//             colors[i3] = mixedColor.r;
//             colors[i3 + 1] = mixedColor.g;
//             colors[i3 + 2] = mixedColor.b;

//             scales[i] = Math.random();
//         }

//         geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
//         geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
//         geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
//         geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomValues, 3));

//         return { geometry };
//     }, []);

//     useEffect(() => {
//         if (targetPosition) {
//             animationRef.current.isAnimating = true;
//             animationRef.current.startTime = Date.now();
//         }
//     }, [targetPosition, positionIndex]);

//     useFrame((state) => {
//         if (points.current) {
//             points.current.material.uniforms.uTime.value = state.clock.elapsedTime;
            
//             if (isZooming) {
//                 const angle = state.clock.elapsedTime;
//                 const radius = 50 + Math.sin(state.clock.elapsedTime * 0.5);
//                 const targetX = radius * Math.cos(angle) * 0.0;
//                 const targetZ = radius * Math.sin(angle) * 0.0;
//                 const targetY = -5 + Math.sin(angle * 2) * 0.1;
//                 camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.06);
//                 camera.lookAt(0, 0, 0);
//             }
//             if (animationRef.current.isAnimating && targetPosition) {
//                 const elapsed = (Date.now() - animationRef.current.startTime) / 1500; 
//                 if (elapsed >= 1) {
//                     camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
//                     animationRef.current.isAnimating = false;
//                 } else {
//                     const t = easeInOutCubic(elapsed);
//                     camera.position.lerp(
//                         new THREE.Vector3(targetPosition.x, targetPosition.y, targetPosition.z),
//                         t * 0.1
//                     );
//                 }
//                 camera.lookAt(0, 0, 0);
//             }
//         }
//     });
//     const easeInOutCubic = (t) => {
//         return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
//     };

//     return (
//         <points ref={points} geometry={geometry} renderOrder={1}>
//             <galaxyMaterial
//                 blending={THREE.AdditiveBlending}
//                 depthWrite={false}
//                 vertexColors={true}
//             />
//         </points>
//     );
// };

// const GalaxyScene = ({ count = 3500 }) => {
//     const [isZooming, setIsZooming] = useState(false);
//     const [isMoving, setIsMoving] = useState(false);
//     const [positionIndex, setPositionIndex] = useState(0);
//     const [targetPosition, setTargetPosition] = useState(null);

//     const cameraPositions = useMemo(() => {
//         const positions = [];
//         const numPositions = 5;
//         const cameraDistance = 4;

//         for (let i = 0; i < numPositions; i++) {
//             const angle = (i / numPositions) * Math.PI * 3;
//             positions.push({
//                 x: Math.cos(angle) * cameraDistance,
//                 y: Math.sin(angle * 0.5) * 1.0,
//                 z: Math.sin(angle) * cameraDistance
//             });
//         }
//         return positions;
//     }, []);

//     const handleMoveCamera = () => {
//         if (!isMoving) {
//             const nextIndex = (positionIndex + 1) % cameraPositions.length;
//             setPositionIndex(nextIndex);
//             setTargetPosition(cameraPositions[nextIndex]);
//             setIsMoving(true);
//             setTimeout(() => {
//                 setIsMoving(false);
//             }, 1500); 
//         }
//     };

//     const handleClick = () => {
//         setIsZooming(true);
//     };

//     useEffect(() => {
//       if (isZooming) {
//           handleMoveCamera();
//           setIsZooming(false);
//       }
//   }, [isZooming])

//     return (
//         <div onClick={handleClick} style={{ cursor: 'pointer', width: '100%', height: '100vh' }}>
//             <Canvas className='h-screen w-full bg-black'>
//                 <Galaxy
//                     isZooming={isZooming}
//                     targetPosition={targetPosition}
//                     positionIndex={positionIndex}
//                     count={count}
//                 />
//             </Canvas>
//         </div>
//     );
// };

// export default GalaxyScene;




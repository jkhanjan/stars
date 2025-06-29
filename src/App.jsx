// 'use client'

// import React, { useRef, useMemo } from 'react';
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

// const Galaxy = ({ isZooming }) => {
//     const points = useRef();
//     const { camera } = useThree();

//     const parameters = {
//         count: 3500,
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
//         }
//     });

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

// const GalaxyScene = ({ isZooming }) => (
//     <Canvas style={b}>
//         <Galaxy isZooming={isZooming} renderOrder={1} />
//     </Canvas>
// );

// export default GalaxyScene;



// import React, { Suspense, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, Environment, Stage } from '@react-three/drei';
// // import Model from './section';
// // import SVG from './section';
// // import SequentialPathAnimation from './section';
// // import GalaxyScene from './section';
// // import AnimatedSPath from './section';
// // import MobileVersion from './MobileVersion';
// import Practice from './Practice';
// import { HandPoints } from './setUpHandTracking';
// import CarScene from './CarScene';
// import CrossroadScene from './CarScene2';
// import CarScene3 from './CarScene3';
// import Universe from './Universe';
// import ApiTesterGrid from './dataGridPostman/ApiTester';

// const SCENES = [
//   {
//     Component: (props) => <CarScene {...props} />
//   },
//   {
//     Component: (props) => <CrossroadScene {...props} />
//   },
//   {
//     Component: (props) => <CarScene3 {...props} />
//   },
// ]

// export default function Scene() {
//   const [index, setIndex] = useState(0);
//   // const scenes = [<CarScene />, <CrossroadScene />, <CarScene3 />];
  

//   // const nextScene = () => {
//   //   setIndex((prevIndex) => (prevIndex + 1) % scenes.length);
//   // };

//   const Component = SCENES[index].Component;

//   return (
//     <div className="w-screen h-screen">
//     {/* <Component 
//       index={index}
//       setIndex={setIndex}
//     /> */}
//     {/* <Practice /> */}
//     {/* <Universe /> */}

    
//     <ApiTesterGrid />
//   </div>
//     // <Canvas
//     //   camera={{ position: [5, 2, 10], fov: 45 }}
//     //   style={{ width: '100vw', height: '100vh' }}
//     // >
//     //   <Suspense fallback={null}>
//     //     <Stage environment="city" intensity={0.6}>
//     //       <Model />
//     //     </Stage>
//     //     <OrbitControls enableZoom={true} autoRotate />
//     //   </Suspense>
//     // </Canvas>
//   );
// }



import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "./components/Scene";
import { Grid } from "@react-three/drei";
import GridLayout from "./components/GridLayout";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const tween = gsap.to(
      {},
      {
        scrollTrigger: {
          trigger: "#main-container",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => setScrollProgress(self.progress),
        },
      }
    );

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      id="main-container"
      className="relative w-full h-[300vh] overflow-hidden"
    >
        <GridLayout />

      <div className="w-full h-[100vh] fixed top-0 left-0 z-10 flex items-center justify-center">
        <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        className="absolute bottom-0 left-0 w-full h-full"
      >
        <ambientLight intensity={0.8} />
        <Scene scrollProgress={scrollProgress} />
      </Canvas></div>
    </div>
  );
}

export default App;
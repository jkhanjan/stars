import { OrbitControls, Points } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from 'three';
import gsap from 'gsap';

import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';
import { HandPoints, useHandTracking } from "./setUpHandTracking";

const BasicParticle = (props) => {
  const { count } = props;
  const radius = 2;
  const points = useRef();
  const hands = useHandTracking();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for(let i = 0; i < count; i++) {
      const distance = Math.sqrt(Math.random());
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      
      let x = distance * Math.sin(theta) * Math.cos(phi);
      let y = distance * Math.sin(theta) * Math.sin(phi);
      let z = distance * Math.cos(theta);
      
      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0.0 },
    uRadius: { value: radius },
    uExplosion: { value: 0.0 }, 
    uHandInfluence: { value: 0.0 },
    uTwist:{value: 3.0},
}), []);


  useFrame((state) => {
    const { clock } = state;
    
const smoothingFactor = 0.5;
let smoothedPalm = { x: 0, y: 0, z: 0 };
let smoothedFingertips = [
  { x: 0, y: 0, z: 0 }, 
  { x: 0, y: 0, z: 0 }, 
  { x: 0, y: 0, z: 0 }, 
  { x: 0, y: 0, z: 0 }, 
  { x: 0, y: 0, z: 0 }  
];

if (points.current) {
  points.current.material.uniforms.uTime.value = clock.elapsedTime;
  
  if (hands.length > 0) {
    const palm = hands[0][0]; 
    const fingertips = [hands[0][4], hands[0][8], hands[0][12], hands[0][16], hands[0][20]];
    
    
    if (palm) {

      smoothedPalm.x = smoothedPalm.x * smoothingFactor + palm.x * (1 - smoothingFactor);
      smoothedPalm.y = smoothedPalm.y * smoothingFactor + palm.y * (1 - smoothingFactor);
      smoothedPalm.z = smoothedPalm.z * smoothingFactor + palm.z * (1 - smoothingFactor);
      
      fingertips.forEach((tip, i) => {
        if (tip) {
          smoothedFingertips[i].x = smoothedFingertips[i].x * smoothingFactor + tip.x * (1 - smoothingFactor);
          smoothedFingertips[i].y = smoothedFingertips[i].y * smoothingFactor + tip.y * (1 - smoothingFactor);
          smoothedFingertips[i].z = smoothedFingertips[i].z * smoothingFactor + tip.z * (1 - smoothingFactor);
        }
      });
      gsap.to(points.current.material.uniforms.uTwist, {
        value: smoothedPalm.x * 3.0, 
        easing:"power2.inOut",
        duration: 0.2
      });
      
      
      if (fingertips[0] && fingertips[1]) {
        const thumbTip = smoothedFingertips[0];
        const indexTip = smoothedFingertips[1];
        
        const pinchDistance = Math.sqrt(
          Math.pow(thumbTip.x - indexTip.x, 2) +
          Math.pow(thumbTip.y - indexTip.y, 2) +
          Math.pow(thumbTip.z - indexTip.z, 2)
        );
        
        const pinchFactor = Math.min(Math.max(pinchDistance * 10, 0.5), 1.0);
        
        gsap.to(points.current.material.uniforms.uRadius, {
          value: radius * pinchFactor,
        easing:"power2.inOut",
          duration: 0.4
        });
      }

      let avgDistance = 0;
      let validTips = 0;
      
      smoothedFingertips.forEach(tip => {
        const distance = Math.sqrt(
          Math.pow(tip.x - smoothedPalm.x, 2) +
          Math.pow(tip.y - smoothedPalm.y, 2) +
          Math.pow(tip.z - smoothedPalm.z, 2)
        );
        
        if (distance > 0) {
          avgDistance += distance;
          validTips++;
        }
      });
      
      if (validTips > 0) {
        avgDistance /= validTips;
        
        if (avgDistance > 0.2) {
          gsap.to(points.current.material.uniforms.uExplosion, {
            value: Math.min(points.current.material.uniforms.uExplosion?.value + 0.1 || 0, 1.4),
        easing:"power2.inOut",
            duration: 0.2
          });
        } else {
          gsap.to(points.current.material.uniforms.uExplosion, {
            value: Math.max(points.current.material.uniforms.uExplosion?.value - 0.05 || 0, 0),
        easing:"power2.inOut",

            duration: 0.2
          });
        }

      }
    }
  } else {
    points.current.material.uniforms.uHandInfluence.value *= 0.95;
  }
}
    
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial 
        depthWrite={false} 
        fragmentShader={fragmentShader} 
        vertexShader={vertexShader} 
        uniforms={uniforms} 
      />
    </points>
  );
};

const Practice = () => {
  const hands = useHandTracking();
  
  return (
    <Canvas className="bg-black" camera={{ position: [1.5, 1.5, 1.5] }}>
      <ambientLight intensity={0.5} />
      <BasicParticle count={2000} shape="sphere" />
      <OrbitControls autoRotate={hands.length === 0} />
      {hands.length > 0 && <HandPoints hand={hands[0]} />}
    </Canvas>
  );
};

export default Practice;
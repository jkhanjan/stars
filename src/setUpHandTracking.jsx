import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';


export function useHandTracking() {
  const [hands, setHands] = useState([]);
  const videoRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const requestRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);


  useEffect(() => {
    const video = document.createElement('video');
    video.style.display = 'block';
    video.style.position = 'absolute';
    video.style.top = '10px';
    video.style.right = '10px';
    video.style.width = '190px';
    video.style.height = '140px';
    video.style.borderRadius = '8px';
    video.style.border = '2px solid white';
    video.style.zIndex = '1000';
    video.width = 320;
    video.height = 240;
    document.body.appendChild(video);
    videoRef.current = video;

    const setupMediaPipe = async () => {
      try {
        const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
        
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm"
        );
        
        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          numHands: 1, 
          runningMode: "VIDEO"
        });

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, frameRate: { ideal: 30, max: 60 } }
        });
        
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        detectHands();
      } catch (error) {
        console.error("Error initializing hand tracking:", error);
      }
    };
    
    const detectHands = () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const video = videoRef.current;
        const currentTime = video.currentTime;
        
        
        if (currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = currentTime;
          
          if (handLandmarkerRef.current) {
            const results = handLandmarkerRef.current.detectForVideo(video, currentTime);
            
            if (results?.landmarks?.length > 0) {
              setHands(results.landmarks);
            }
          }
        }
      }
     
      requestRef.current = setTimeout(() => {
        requestAnimationFrame(detectHands);
      }, 10); // ~20fps for better performance
    };
    
    setupMediaPipe();

    return () => {
      if (requestRef.current) {
        clearTimeout(requestRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        document.body.removeChild(videoRef.current);
      }
    };
  }, []);

  return hands;
}

export function HandPoints({ hand, color = "#ffff00" }) {
  if (!hand) return null;
  
  
  const keyPoints = [0, 4, 8, 12, 16, 20]; 
  
  return (
    <group>
      {keyPoints.map((index) => {
        if (!hand[index]) return null;
        
        const point = hand[index];
        const x = (point.x - 0.5) * 5;
        const y = -(point.y - 0.5) * 5;
        const z = -point.z * 10;
        
        return (
          <mesh key={`hand-point-${index}`} position={[x, y, z]}>
            <sphereGeometry args={[0.05, 4, 4]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
}

export function HandTrackingExample() {
  const hands = useHandTracking();

  return hands.length > 0 ? <HandPoints hand={hands[0]} /> : null;
}
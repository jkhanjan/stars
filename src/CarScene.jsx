import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useState, useRef, useEffect, useMemo } from 'react';
import { OrbitControls, PerspectiveCamera, Sky, Environment, useGLTF, Text } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import gsap from 'gsap';
import Model1 from './Model1';
import Model2 from './Model2';

const MovingCar = ({ position = [1.5, -0.1, 25], ...props} ) => {

  return (
    <RigidBody
      position={position}
      name="movingCar"
      colliders="hull"
      type="fixed"
    >
      <PerspectiveCamera makeDefault fov={60} position={[0, 3, 12]} />
      <Model1 position={[1, 0.1, 5]} {...props} />
    </RigidBody>
  );
};


const StationaryCar = ({ position }) => {
  const carRef = useRef();

  const [collided, setCollided] = useState(false);
  
  useEffect(() => {
    if (carRef.current) {
      carRef.current.setMass(1000);
      
      const unsubscribe = carRef.current.onCollisionEnter(() => {
        setCollided(true);
        setTimeout(() => setCollided(false), 5000);
      });
      
      return unsubscribe;
    }
  }, []);
  
  return (
    <RigidBody 
      ref={carRef} 
      position={position} 
      name="stationaryCar"
      colliders="cuboid"
      type='dynamic'
      restitution={0.2}
      friction={1}
      
    >
      <Model2 />
      
    </RigidBody>
  );
};

// Obstacle (cylinder)
const Obstacle = ({ position }) => {
  const obstacleRef = useRef();
  const [hit, setHit] = useState(false);
  
  useEffect(() => {
    if (obstacleRef.current) {
      obstacleRef.current.setMass(150);
      
      const unsubscribe = obstacleRef.current.onCollisionEnter(() => {
        setHit(true);
      });
      
      return unsubscribe;
    }
  }, []);
  
  
  return (
    <RigidBody 
      ref={obstacleRef} 
      position={position} 
      name="obstacle"
      colliders="hull" 
      restitution={0.8}
      friction={0.2}
      type='dynamic'
    >
      <mesh >
        <cylinderGeometry args={[0.5, 0.5, 1.2, 16]} />
        
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.4, 0.1, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </RigidBody>
  );
};


// Traffic Light
const TrafficLight = ({ position }) => {
  const [lightState, setLightState] = useState('red');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setLightState(prev => {
        if (prev === 'red') return 'green';
        if (prev === 'green') return 'yellow';
        return 'red';
      });
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[0.5, 4, 0.5]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[0.8, 1.6, 0.8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Lights */}
      <mesh position={[0, 4.5, 0.45]} castShadow>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial 
          color="red" 
          emissive="red" 
          emissiveIntensity={lightState === 'red' ? 1 : 0.2} 
        />
      </mesh>
      <mesh position={[0, 4.0, 0.45]} castShadow>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial 
          color="yellow" 
          emissive="yellow" 
          emissiveIntensity={lightState === 'yellow' ? 1 : 0.2} 
        />
      </mesh>
      <mesh position={[0, 3.5, 0.45]} castShadow>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial 
          color="green" 
          emissive="green" 
          emissiveIntensity={lightState === 'green' ? 1 : 0.2} 
        />
      </mesh>
    </group>
  );
};

const Tree = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 3, 0]} castShadow>
        <coneGeometry args={[1, 3, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  );
};

// Lamppost
const Lamppost = ({ position }) => {
  return (
    <group position={position} castShadow>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 4, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[0, 4, 0.3]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} rotation={[Math.PI/2, 0, 0]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[0, 4, 0.6]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
};

const Building = ({ position, height = 6, width = 2, depth = 3, color = "#b9c4d0" }) => {
    const floors = Math.floor(height / 1.5);
  
    const windowLights = useMemo(() => {
      return Array.from({ length: floors * 4 }).map(() => Math.random() > 0.3);
    }, [floors]);
    
    return (
      <group position={position}>
        {/* Building Structure */}
        <mesh position={[0, height / 2, 0]} >
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={new THREE.Color(color)} />
        </mesh>
        
        {/* Windows */}
        {Array.from({ length: floors }).map((_, floorIndex) => (
          <group key={`floor-${floorIndex}`} position={[0, floorIndex * 1.5 + 1, 0]}>
            {Array.from({ length: 2 }).map((_, i) => (
              <mesh 
                key={`front-${i}`} 
                position={[width * (i === 0 ? -0.25 : 0.25), 0, depth / 2 + 0.01]} 
                castShadow
              >
                <planeGeometry args={[0.5, 0.9]} />
                <meshStandardMaterial 
                  color={new THREE.Color("#88ccff")} 
                  emissive={new THREE.Color("#ffffaa")} 
                  emissiveIntensity={windowLights[floorIndex * 4 + i] ? 0.5 : 0} 
                />
              </mesh>
            ))}
            
            {/* Side Windows */}
            {Array.from({ length: 2 }).map((_, i) => (
              <mesh 
                key={`side-${i}`} 
                position={[width / 2 + 0.01, 0, depth * (i === 0 ? -0.25 : 0.25)]}
                rotation={[0, Math.PI / 2, 0]} 
                castShadow
              >
                <planeGeometry args={[0.5, 0.8]} />
                <meshStandardMaterial 
                  color={new THREE.Color("#88ccff")} 
                  emissive={new THREE.Color("#ffffaa")} 
                  emissiveIntensity={windowLights[floorIndex * 4 + 2 + i] ? 0.5 : 0} 
                />
              </mesh>
            ))}
          </group>
        ))}
        
        {/* Roof */}
        <mesh position={[0, height + 0.1, 0]} castShadow>
          <boxGeometry args={[width + 0.2, 0.2, depth + 0.2]} />
          <meshStandardMaterial color={new THREE.Color("#555555")} />
        </mesh>
      </group>
    );
  };
  


const Road = () => {
  return (
    <group>
      <RigidBody type='fixed'>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow castShadow>
        <planeGeometry args={[8, 100]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      </RigidBody>
      
      {/* Road markings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.09, 3]} receiveShadow>
        <planeGeometry args={[0.2, 90]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
      
      {/* Dashed lane markings */}
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh 
          key={`dash-${i}`} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[2, -0.09, i * 2]} 
        >
          <planeGeometry args={[0.1, 1]} />
          <meshStandardMaterial color="white" />
        </mesh>
      ))}
       {Array.from({ length: 25 }).map((_, i) => (
        <mesh 
          key={`dash-${i}`} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[2, -0.09, -i * 2]} 
        >
          <planeGeometry args={[0.1, 1]} />
          <meshStandardMaterial color="white" />
        </mesh>
      ))}
      
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh 
          key={`dash-left-${i}`} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[-2, -0.09, i * 2]} 
        >
          <planeGeometry args={[0.1, 1]} />
          <meshStandardMaterial color="white" />
        </mesh>
      ))}
      {Array.from({ length: 25 }).map((_, i) => (
        <mesh 
          key={`dash-left-${i}`} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[-2, -0.09, -i * 2]} 
        >
          <planeGeometry args={[0.1, 1]} />
          <meshStandardMaterial color="white" />
        </mesh>
      ))}
      
      {/* Sidewalks */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-4.5, 0.1, 0]} receiveShadow castShadow>
          <boxGeometry args={[1, 0.3, 100]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
      
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[4.5, 0.1, 0]} receiveShadow castShadow>
          <boxGeometry args={[1, 0.3, 100]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
      
      {/* Grass areas */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7, -0.15, 0]}>
        <planeGeometry args={[5, 100]} />
        <meshStandardMaterial color="#4a7942" />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7, -0.15, 0]}>
        <planeGeometry args={[5, 100]} />
        <meshStandardMaterial color="#4a7942" />
      </mesh>
      
      {/* Invisible barriers to keep cars on the road */}
      <CuboidCollider position={[-5.5, 1, 0]} args={[0.5, 2, 50]} type="fixed" />
      <CuboidCollider position={[5.5, 1, 0]} args={[0.5, 2, 50]} type="fixed" />
    </group>
  );
};



const Scene = (props) => {
  const [width, setWidth] = useState(window.innerWidth);
    
    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  const getScaleFactor = () => {
    if (width < 480) return 0.65; // Small mobile
    if (width < 768) return 0.75; // Medium mobile
    if (width < 1024) return 0.85; // Tablet
    return 1; // Desktop
  };
  
  return (
    <Canvas shadows  frameloop="always">
      <Sky sunPosition={[10, 5, -5]} />
      <Environment preset="city"  />
      <ambientLight intensity={0.5}  />
      <directionalLight position={[5, 10, -5]} intensity={1}  shadow-mapSize={2048} />
      <fog attach="fog" args={['#aabbdd', 10, 80]} />
      
      <Physics gravity={[0, -9.8, 0]} scale={getScaleFactor()}>
        <Road />
        <MovingCar position={[0.2, -0.1, 25]} {...props} />
    
        <StationaryCar position={[-2, -0.1, -15]} />

        <Obstacle position={[1, -0.7, 4]} />
      </Physics>
      
      {/* Buildings on both sides */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Building 
          key={`building-left-${i}`}
          position={[-7, 0, -45 + i * 10]} 
          height={5 + Math.random() * 5}
          width={2 + Math.random()}
          depth={2 + Math.random() * 2}
          color={`rgb(${180 + Math.random() * 50}, ${180 + Math.random() * 50}, ${180 + Math.random() * 50})`}
          
        />
      ))}
      
      {Array.from({ length: 10 }).map((_, i) => (
        <Building 
          key={`building-right-${i}`}
          position={[7, 0, -45 + i * 10]} 
          height={5 + Math.random() * 5}
          width={2 + Math.random()}
          depth={2 + Math.random() * 2}
          color={`rgb(${180 + Math.random() * 50}, ${180 + Math.random() * 50}, ${180 + Math.random() * 50})`}
        />
      ))}
      

      <TrafficLight position={[-3.5, 0, -35]}  />

      {Array.from({ length: 10 }).map((_, i) => (
        <Lamppost key={`lamp-left-${i}`} position={[-4, 0, -40 + i * 10]}  />
      ))}
      
      {Array.from({ length: 10 }).map((_, i) => (
        <Lamppost key={`lamp-right-${i}`} position={[4, 0, -35 + i * 10]}  />
      ))}
      
      {Array.from({ length: 10 }).map((_, i) => (
        <Tree 
          key={`tree-left-${i}`} 
          position={[-6 - Math.random(), 0, -40 + i * 10 + Math.random() * 2.3]} 
          scale={0.7 + Math.random() * 0.9}
          
        />
      ))}
      
      {Array.from({ length: 10 }).map((_, i) => (
        <Tree 
          key={`tree-right-${i}`} 
          position={[6 + Math.random(), 0, -40 + i * 10 + Math.random() * 2.3]} 
          scale={0.7 + Math.random() * 0.5}
          
        />
      ))}
      <OrbitControls target={[0, 0, 0]}  />
    </Canvas>
  );
};

export default function CarScene(props) {
  return <Scene {...props} />;
}
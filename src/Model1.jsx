import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import gsap from 'gsap'
import { useThree } from '@react-three/fiber'

const POPUP_TEXT = {
  0: 'As you have spotted a pothole.',
  1: 'As the traffic light is broken.',
  2: 'As the street lamps are not working',
}

export default function Model1(props) {
  const groupRef = useRef()
  const { camera } = useThree()
  const { nodes, materials } = useGLTF('/mustang.glb')
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    if (!groupRef.current) return
    
    const timeline = gsap.timeline({
      onComplete: () => {
        // Show popup when the timeline is complete
        setShowPopup(true)
      }
    })
    
    timeline.to(groupRef.current.position, {
      z: -15,
      duration: 2.4,
      ease: "power1.out"
    })
    
    timeline.to(camera.position, {
      z: -7,
      y: 6,
      duration: 2,
      ease: "power1.in"
    }, ">=0")
    
    return () => {
      timeline.kill()
    }
  }, [camera])

  const closePopup = () => {
  
    if (typeof props.setIndex === "function") {
      props.setIndex((prevIndex) => prevIndex + 1); 
    }
  
    setShowPopup(false); 
  };
  
  
  return (
    <group {...props} dispose={null} rotation={[0, Math.PI, 0]} ref={groupRef}>
      {showPopup && (
        <Html position={[1.2, 4, 0]} center distanceFactor={10}>
          <div style={{
            backgroundColor: 'rgba(25, 28, 36, 0.95)',
            color: 'white',
            padding: '18px 24px',
            borderRadius: '12px',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            minWidth: '350px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(120, 130, 180, 0.3)'
          }}>
            <h3 style={{ 
              margin: '0 0 20px', 
              color: "#FFD700", 
              fontSize: '22px',
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}>Look Out!</h3>
            
            <p style={{ 
              margin: '0 0 25px', 
              color: "#FFFFFF",
              fontSize: '16px',
              lineHeight: '1.4'
            }}>
              {`You should report this problem. ${POPUP_TEXT[props.index] || "As the street lamps are not working"}`}
            </p>
            
            <button
              onClick={closePopup}
              style={{
                backgroundColor: '#304878',
                border: 'none',
                color: 'white',
                padding: '10px 22px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                transition: 'transform 0.1s, background-color 0.2s',
                transform: 'translateY(0)'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#3b5998'}
              onMouseDown={(e) => e.target.style.transform = 'translateY(2px)'}
              onMouseUp={(e) => e.target.style.transform = 'translateY(0)'}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#304878';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Ok
            </button>
          </div>
        </Html>
      )}
      <group scale={0.01}>
        <group scale={100}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mustang_CarPaint_0.geometry}
            material={materials.CarPaint}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mustang_Window_0.geometry}
            material={materials.Window}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mustang_FrontLights_0.geometry}
            material={materials.FrontLights}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mustang_RearLights_0.geometry}
            material={materials.RearLights}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mustang_Plastic_0.geometry}
            material={materials.Plastic}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mustang_Rims_0.geometry}
            material={materials.Rims}
          />
          <group position={[-0.933, 0.34, 1.56]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.FR_Wheel_Rims_0.geometry}
              material={materials.Rims}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.FR_Wheel_Plastic_0.geometry}
              material={materials.Plastic}
            />
          </group>
          <group position={[-0.94, 0.34, -1.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.BR_Wheel_Rims_0.geometry}
              material={materials.Rims}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.BR_Wheel_Plastic_0.geometry}
              material={materials.Plastic}
            />
          </group>
          <group position={[0.933, 0.34, 1.56]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.FL_Wheel_Rims_0.geometry}
              material={materials.Rims}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.FL_Wheel_Plastic_0.geometry}
              material={materials.Plastic}
            />
          </group>
          <group position={[0.94, 0.34, -1.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.BL_Wheel_Rims_0.geometry}
              material={materials.Rims}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.BL_Wheel_Plastic_0.geometry}
              material={materials.Plastic}
            />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/mustang.glb')
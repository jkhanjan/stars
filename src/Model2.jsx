import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model2(props) {
  const { nodes, materials } = useGLTF('/model.glb')
  return (
    <group {...props} dispose={null} rotation={[0, Math.PI, 0]}>
      <group scale={0.01} >
        <group scale={100}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['2107_CarPaint_0'].geometry}
            material={materials.CarPaint}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['2107_Plastic_0'].geometry}
            material={materials.Plastic}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['2107_Window_0'].geometry}
            material={materials.Window}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['2107_Chrome_0'].geometry}
            material={materials.Chrome}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['2107_FrontLights_0'].geometry}
            material={materials.FrontLights}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['2107_RearLights_0'].geometry}
            material={materials.RearLights}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['2107_Rims_0'].geometry}
            material={materials.Rims}
          />
          <group position={[-0.753, 0.291, -1.007]} rotation={[-Math.PI / 2, 0, 0]}>
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
          <group position={[-0.743, 0.291, 1.414]} rotation={[-Math.PI / 2, 0, 0]}>
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
          <group position={[0.743, 0.291, 1.414]} rotation={[-Math.PI / 2, 0, 0]}>
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
          <group position={[0.753, 0.291, -1.007]} rotation={[-Math.PI / 2, 0, 0]}>
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

useGLTF.preload('/model.glb')

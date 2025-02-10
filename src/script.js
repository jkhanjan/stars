import * as THREE from 'three'
import GUI from 'lil-gui'
import galaxyVertexShader from '../galaxy/vertex.glsl';
import galaxyFragmentShader from '../galaxy/fragment.glsl';

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Mouse tracking
const mouse = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) - 0.5
    mouse.y = (event.clientY / window.innerHeight) - 0.5
})

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 40000
parameters.size = 0.001
parameters.radius = 5
parameters.branches = 5
parameters.spin = 1
parameters.randomness = 0.5
parameters.randomnessPower = 3
parameters.insideColor = '#fafcff'
parameters.outsideColor = '#03a9fc'

let geometry = null
let material = null
let points = null

const generateGalaxy = () =>
{
    if(points !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const scales = new Float32Array(parameters.count * 1)
    const randomness = new Float32Array(parameters.count * 3)

    const insideColor = new THREE.Color(parameters.insideColor)
    const outsideColor = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
    
        // Generate random position within a square region
        const size = parameters.radius; // Define the square size (same as previous radius)
        const x = (Math.random() - 0.5) * size * 2; // Spread points inside the square
        const y = (Math.random() - 0.5) * size * 2;
        const z = (Math.random() - 0.5) * size * 2;
    
        // Apply pulsation effect for dynamic movement
        const pulse = Math.sin(performance.now() * 0.0002 + x * 8) * 10.5;
        positions[i3] = x + pulse * (Math.random() - 0.5);
        positions[i3 + 1] = y + pulse * (Math.random() - 0.5);
        positions[i3 + 2] = z + pulse * (Math.random() - 0.5);
    
        // Apply random movement variation
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * parameters.randomness * size * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * parameters.randomness * size * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * parameters.randomness * size * (Math.random() < 0.5 ? 1 : -1);
    
        randomness[i3] = randomX;
        randomness[i3 + 1] = randomY;
        randomness[i3 + 2] = randomZ;
    
        // Color mapping based on distance from the center
        const distanceFromCenter = Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) / size;
        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, distanceFromCenter);
    
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    
        scales[i] = Math.random();
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))

    /**
     * Material
     */
    material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader: galaxyVertexShader,
        fragmentShader: galaxyFragmentShader,
        uniforms: {
            uSize: { value: 7 * renderer.getPixelRatio() },
            uTime: { value: 0 }
        }
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 75)
camera.position.x = 2
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Store initial camera position
const initialCameraPosition = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z
}

// Smooth camera movement variables
const cameraTarget = {
    x: initialCameraPosition.x,
    y: initialCameraPosition.y
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

generateGalaxy()

/**
 * Animate
 */
const clock = new THREE.Clock()

// Camera movement parameters
let targetPosition = camera.position.clone(); // Target position for the camera movement
let isZooming = false;
const zoomSpeed = 0.0005;
let angle = 0;
const radius = 5; // Base radius for the camera motion

// Detect click to toggle zooming (start/stop camera movement)
window.addEventListener("click", () => {
    if (isZooming) {
        // Stop the animation (smoothly transition back to initial position)
        isZooming = false;
    } else {
        // Start the animation (smoothly transition to target position)
        isZooming = true;
        targetPosition = camera.position.clone(); // Store the current position as the starting point
    }
});

// Animate function
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;

    // Smooth camera movement with mouse tracking
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.05;

    if (isZooming) {
        // Update angle for smooth circular motion
        angle = elapsedTime * zoomSpeed;

        // Increase radius for cinematic effect
        const dynamicRadius = radius + Math.sin(elapsedTime * 0.2) * 3;

        // Calculate target positions for circular motion (X, Y, Z)
        const targetX = dynamicRadius * Math.cos(angle);
        const targetZ = dynamicRadius * Math.atan(angle);
        const targetY = 3 + Math.cos(angle * 0.9) * 5; // Smooth vertical movement

        // Transition the camera smoothly to the new target position
        targetPosition.set(targetX, targetY, targetZ);

        // Lerp for smooth transition (smooth camera movement)
        camera.position.lerp(targetPosition, 0.05); // Adjust 0.05 to make the transition slower/faster

        // Ensure the camera always looks at the center of the scene
        camera.lookAt(scene.position);
    }

    // Render the scene
    renderer.render(scene, camera);

    // Loop the animation
    window.requestAnimationFrame(tick);
};

tick();


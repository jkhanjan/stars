import * as THREE from "three";
import galaxyVertexShader from "../../galaxy/vertex.glsl";
import galaxyFragmentShader from "../../galaxy/fragment.glsl";

export const generateGalaxy = (parameters, renderer, geometry = null, material = null, points = null, scene) => {
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  const scales = new Float32Array(parameters.count * 1);
  const randomness = new Float32Array(parameters.count * 3);

  const insideColor = new THREE.Color(parameters.insideColor);
  const outsideColor = new THREE.Color(parameters.outsideColor);

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
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      parameters.randomness *
      size *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      parameters.randomness *
      size *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      parameters.randomness *
      size *
      (Math.random() < 0.5 ? 1 : -1);

    randomness[i3] = randomX;
    randomness[i3 + 1] = randomY;
    randomness[i3 + 2] = randomZ;

    const distanceFromCenter =
      Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) / size;
    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, distanceFromCenter);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    scales[i] = Math.random();
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute(
    "aRandomness",
    new THREE.BufferAttribute(randomness, 3)
  );

  material = new THREE.ShaderMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,

    vertexColors: true,
    vertexShader: galaxyVertexShader,
    fragmentShader: galaxyFragmentShader,
    uniforms: {
      uSize: { value: 25 * renderer.getPixelRatio() },
      uTime: { value: 0 },
    },
  });
  points = new THREE.Points(geometry, material);
  scene.add(points);
  
  // Return the created objects so they can be used by the caller
  return { geometry, material, points };
};
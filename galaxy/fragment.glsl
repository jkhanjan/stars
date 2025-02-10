// Get color from vertex shader
varying vec3 vColor;
uniform float uTime;

void main() {
    // Distance from the center of the point
    float dist = distance(gl_PointCoord, vec2(0.5));

    // Create a soft circular falloff for a realistic glow
    float glow = 1.0 - smoothstep(0.2, 0.9, dist);

    // Introduce a unique flicker for each star
    float uniqueOffset = fract(sin(gl_FragCoord.x * 12.9898 + gl_FragCoord.y * 78.233) * 43758.5453);
    float twinkle = 0.6 + 0.4 * sin(uTime * 2.5 + uniqueOffset * 20.0);

    // Random noise for brightness variation
    float noise = fract(sin(gl_FragCoord.x * 3.14159 + gl_FragCoord.y * 45.238) * 437.5853);
    float brightness = glow * twinkle + noise * 0.1;

    // Enhance star color for a natural look
    vec3 starColor = mix(vec3(0.8), vColor * 1.0, brightness);

    // Apply a strong glow effect
    gl_FragColor = vec4(starColor, brightness * glow);
}

// Get color from vertex shader
varying vec3 vColor;
uniform float uTime;

void main() {
    // Distance from the center of the point
    float dist = distance(gl_PointCoord, vec2(0.5));

    // Soft circular falloff for a realistic glow with wider blur area
    float glow = 1.0 - smoothstep(0.01, 0.95, dist);

    // Unique flicker for each star
    float uniqueOffset = fract(sin(gl_FragCoord.x * 12.9898 + gl_FragCoord.y * 78.233) * 43758.5453);
    float twinkle = 0.6 + 0.4 * sin(uTime * 2.5 + uniqueOffset * 20.0);

    // Random noise for natural variation
    float noise = fract(sin(gl_FragCoord.x * 3.14159 + gl_FragCoord.y * 45.238) * 437.5853);
    float brightness = glow * twinkle + noise * 0.9;

    // Enhancing star colors with subtle variations
    vec3 baseColor = mix(vec3(0.1, 0.1, 1.0), vColor, 0.9); // Slight blue tint for realism
    vec3 starColor = baseColor * brightness * 2.0;

    // Final blended output with a strong glow
    gl_FragColor = vec4(starColor, brightness * glow);
}

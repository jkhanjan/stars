// varying vec3 vColor;
// uniform float uTime;

// void main() {
//     // Distance from center
//     float dist = distance(gl_PointCoord, vec2(0.5));
//     float distanceFromCenter = distance(gl_PointCoord, vec2(0.5));
//     float alpha = 0.05 * distanceFromCenter - 0.1;

//     // Glow effect
//     float glow = 1.0 - smoothstep(0.01, 0.95, dist);

//     // Star flicker
//     float uniqueOffset = fract(sin(gl_FragCoord.x * 12.9898 + gl_FragCoord.y * 78.233) * 43758.5453);
//     float twinkle = 0.6 + 0.4 * sin(uTime * 2.5 + uniqueOffset * 20.0);

//     // Combine effects
//     float noise = fract(sin(gl_FragCoord.x * 3.14159 + gl_FragCoord.y * 45.238) * 437.5853);
//     float brightness = glow * twinkle + noise * 0.9;

//     gl_FragColor = vec4(0.1, 0.1, 1.0, alpha);
// }

void main()
{
    vec2 uv = gl_PointCoord ; // Multiply by 2.0 to double the UV coordinates
    float dstanceFromCenter = length(uv - 0.5); // Adjust center point since UV is now 0-2 range
    float alpha =0.05 / dstanceFromCenter - 0.15;
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
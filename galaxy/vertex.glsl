// Uniforms for controlling size and animation time
uniform float uSize;
uniform float uTime;

// Attributes for individual point customization
attribute float aScale;
attribute vec3 aRandomness;

// Varying to pass color to fragment shader
varying vec3 vColor;

void main() {
    // Transform position into model space
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Calculate rotation based on distance
    float distanceFromCenter = length(modelPosition.xz);
    float angle = atan(modelPosition.x, modelPosition.z);
    float angleOffset = (1.0 / distanceFromCenter) * uTime * 0.05;
    angle += angleOffset;
    
    // Apply rotational movement
    modelPosition.x = sin(angle) * distanceFromCenter;
    modelPosition.z = cos(angle) * distanceFromCenter;
    
    // Add slight randomness for organic movement
    modelPosition.xyz += aRandomness;
    
    // Transform to view and clip space
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    
    // Set point size with distance attenuation
    gl_PointSize = uSize * aScale * (1.0 / -viewPosition.z);
    
    // Pass color to fragment shader
    vColor = color;
}

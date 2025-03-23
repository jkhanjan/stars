uniform float uTime;
uniform float uRadius;
uniform float uExplosion;
uniform float uTwist;


varying float vDistance;

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
  );
}

void main() {
  float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.9);
  float size = distanceFactor * 10.0 + 10.0;
  
  vec3 explosionOffset = normalize(position) * uExplosion * 0.5;
  
  vec3 particlePosition = (position + explosionOffset) * rotation3dY(uTime * 0.1 * distanceFactor * uTwist);

  vDistance = distanceFactor;

  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = size;
  gl_PointSize *= (1.0 / - viewPosition.z);
}

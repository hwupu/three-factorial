attribute float aScale;

uniform float particleSize;
uniform float uTime;

varying vec3 vColor;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.);
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1. / distanceToCenter) * uTime * .2;
  angle += angleOffset;
  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  vec4 mvPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = particleSize * aScale;

  // Make far particles smaller.
  gl_PointSize *= (1. / - mvPosition.z);

  vColor = color;
}

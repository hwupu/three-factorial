/*
  If use ShaderMaterial instead of RawShaderMaterial,
  those variables are provided automatically:
    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelMatrix;
    attribute vec3 position;
    attribute vec2 uv;
    precision mediump float;
*/

varying vec2 vUv;

void main() {
  // step(x) -> x > 0.5 ? 1 : 0

  // float strength = step(0.5, mod(vUv.y, 0.2) * 5.0);
  // line grid
  // strength += step(0.5, mod(vUv.x, 0.2) * 5.0);
  // grid cell (like invert)
  // strength *= step(0.5, mod(vUv.x, 0.2) * 5.0);
  // strength *= step(0.5, mod(vUv.x, 0.1) * 10.0);

  // ||uv|| = length(uv)
  // radius
  // or
  // take distance between a point:
  // distance(vUv, vec2(0.5))

  // star:
  // float strength = 0.015 / distance(vUv, vec2(0.5));
  // inverse square root?

  vec2 lightUv = vec2(
    vUv.x * 0.2 + 0.4,
    vUv.y
  );
  float strength = 0.05 / distance(lightUv, vec2(0.5));

  gl_FragColor = vec4(strength, strength, strength, 1.0);
}

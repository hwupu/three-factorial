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

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
attribute float aRandom;
attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;

void main() {
  vec4 modelCoor = modelMatrix * vec4(position, 1.0);

  float elvation = sin(modelCoor.x * uFrequency.x - uTime) * 0.1;
  elvation += sin(modelCoor.y * uFrequency.y - uTime) * 0.1;
  modelCoor.z = elvation;
  // modelCoor.z += aRandom * 0.1;
  vec4 viewCoor = viewMatrix * modelCoor;
  gl_Position = projectionMatrix * viewCoor;

  vUv = uv;
  vElevation = elvation;
}

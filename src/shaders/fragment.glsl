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

precision mediump float;
/*
  need to specify precision: highp, mediump, lowp
  (highp works with some devices only)
*/

uniform sampler2D uTexture;
varying vec2 vUv;
varying float vElevation;

void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation * 2.0 + 0.5;
  gl_FragColor = textureColor;

}

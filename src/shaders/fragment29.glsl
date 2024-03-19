uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

varying float vElevation;

void main() {
  gl_FragColor = vec4(mix(uDepthColor, uSurfaceColor, vElevation), 1.0);
  #include <colorspace_fragment>
}

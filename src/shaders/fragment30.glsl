varying vec3 vColor;

void main() {
  float strength = distance(gl_PointCoord, vec2(.5));
  strength = step(.5, strength);
  strength = 1. - strength;

  vec3 color = mix(vec3(0.), vColor, strength);
  gl_FragColor = vec4(color, 1.);
  #include <colorspace_fragment>;
}

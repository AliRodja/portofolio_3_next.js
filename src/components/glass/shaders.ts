// GLSL for the WebGL glass stage. Coordinates in the fragment shaders are
// device pixels with the origin at the top left, like the DOM.
//
// The glass shader's approach (refraction strongest at the rim and falling
// off inward, Gaussian blur of what is behind, a vertical tint, and a shape
// mask) is adapted from liquid-glass-js by Armagan Amcalar, MIT License,
// https://github.com/dashersw/liquid-glass-js.

export const fullscreenVertex = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
}
`;

// Draws the page backdrop: near-black base, a studio key and fill light, two
// slowly drifting gray glows, film grain, a vignette, and up to two light
// streaks. Mirrors GlassBackdrop and LightStreaks, which stay as the CSS
// fallback.
export const backdropFragment = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_dpr;
uniform vec3 u_blob1; // center.xy, radius; drift is computed in JS
uniform vec3 u_blob2;
uniform vec4 u_streak1; // center.xy, angle (radians), opacity
uniform vec4 u_streak2;
uniform float u_streakHalfLength;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// A CSS-style radial gradient from a color at the center to transparent at
// \`stop\` (as a fraction of the ellipse radii).
float radial(vec2 p, vec2 center, vec2 radii, float stop) {
  float k = length((p - center) / radii);
  return max(1.0 - k / stop, 0.0);
}

float blob(vec2 p, vec3 b) {
  float d = length(p - b.xy);
  float feather = 135.0 * u_dpr;
  return 1.0 - smoothstep(b.z - feather, b.z + feather, d);
}

// The CSS streak: a 2px line with a soft glow, fading in toward the middle.
float streak(vec2 p, vec4 s) {
  if (s.w <= 0.0) return 0.0;
  vec2 dir = vec2(cos(s.z), sin(s.z));
  vec2 normal = vec2(-dir.y, dir.x);
  vec2 rel = p - s.xy;
  float across = abs(dot(rel, normal));
  // The CSS gradient runs 0, 0.5, 1, 0.5, 0 along the line: linear from
  // the middle out.
  float along = clamp(abs(dot(rel, dir)) / u_streakHalfLength, 0.0, 1.0);
  float fade = 1.0 - along;
  float core = exp(-pow(across / (1.0 * u_dpr), 2.0));
  float glow = 0.35 * exp(-pow(across / (8.0 * u_dpr), 2.0))
             + 0.08 * exp(-pow(across / (32.0 * u_dpr), 2.0));
  return s.w * fade * (core + glow);
}

void main() {
  vec2 R = u_resolution;
  vec2 p = vec2(gl_FragCoord.x, R.y - gl_FragCoord.y);

  vec3 col = vec3(5.0 / 255.0);
  col = mix(col, vec3(1.0), 0.16 * radial(p, vec2(0.12, 0.08) * R, vec2(0.60, 0.55) * R, 0.7));
  col = mix(col, vec3(1.0), 0.07 * radial(p, vec2(0.92, 0.96) * R, vec2(0.45, 0.40) * R, 0.7));
  col = mix(col, vec3(59.0, 62.0, 68.0) / 255.0, 0.45 * blob(p, u_blob1));
  col = mix(col, vec3(42.0, 44.0, 48.0) / 255.0, 0.45 * blob(p, u_blob2));

  col += (hash(floor(p / u_dpr)) - 0.5) * 0.035;

  float vignette = length((p - vec2(0.5, 0.4) * R) / (vec2(1.2, 0.9) * R));
  col = mix(col, vec3(0.0), 0.7 * clamp((vignette - 0.55) / 0.45, 0.0, 1.0));

  col += vec3(streak(p, u_streak1) + streak(p, u_streak2));
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

// Copies the rendered backdrop texture to the screen.
export const copyFragment = `
precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
void main() {
  gl_FragColor = texture2D(u_texture, gl_FragCoord.xy / u_resolution);
}
`;

// One quad per glass element, placed over its DOM rectangle.
export const glassVertex = `
attribute vec2 a_position;
uniform vec4 u_rect; // x, y, width, height in device px, top-left origin
uniform vec2 u_resolution;
varying vec2 v_pixel;
void main() {
  vec2 pixel = u_rect.xy + a_position * u_rect.zw;
  v_pixel = pixel;
  vec2 clip = pixel / u_resolution * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

export const glassFragment = `
precision highp float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec4 u_rect;
uniform float u_radius;
uniform float u_opacity;
uniform float u_dpr;
varying vec2 v_pixel;

// Signed distance to a rounded rectangle centered at the origin: negative
// inside, positive outside.
float roundedRect(vec2 p, vec2 halfSize, float r) {
  vec2 q = abs(p) - halfSize + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec3 sampleBackdrop(vec2 pixel) {
  vec2 uv = vec2(pixel.x / u_resolution.x, 1.0 - pixel.y / u_resolution.y);
  return texture2D(u_texture, clamp(uv, 0.0, 1.0)).rgb;
}

void main() {
  vec2 halfSize = u_rect.zw * 0.5;
  vec2 q = v_pixel - (u_rect.xy + halfSize);
  float r = min(u_radius, min(halfSize.x, halfSize.y));

  float d = roundedRect(q, halfSize, r);
  float mask = clamp(0.5 - d, 0.0, 1.0);
  if (mask <= 0.0) discard;
  float inside = -d;

  // Outward normal from the distance field.
  vec2 e = vec2(1.0, 0.0);
  vec2 n = vec2(
    roundedRect(q + e.xy, halfSize, r) - roundedRect(q - e.xy, halfSize, r),
    roundedRect(q + e.yx, halfSize, r) - roundedRect(q - e.yx, halfSize, r)
  );
  n = length(n) > 0.0 ? normalize(n) : vec2(0.0, -1.0);

  // Refraction: like the curved edge of a lens, the rim bends the backdrop,
  // strongest at the edge and fading out within a band inside it.
  // Both scale with the element, so a small button bends a little and a
  // large card bends a lot; a fixed shift would swallow small buttons whole.
  float shortSide = min(halfSize.x, halfSize.y);
  float band = min(0.6 * shortSide, 28.0 * u_dpr);
  float t = clamp(1.0 - inside / band, 0.0, 1.0);
  // Sampling outward (as liquid-glass-js does) squeezes what is behind
  // toward the rim and pulls in a little from beyond it, so lines passing
  // behind bend at the edge instead of disappearing.
  vec2 samplePoint = v_pixel + n * (t * t * min(0.35 * shortSide, 24.0 * u_dpr));

  // A light Gaussian blur, so sharp things behind stay visible and the
  // bending at the rim can be seen.
  vec3 col = vec3(0.0);
  float total = 0.0;
  float spread = 0.9 * u_dpr;
  for (float x = -2.0; x <= 2.0; x += 1.0) {
    for (float y = -2.0; y <= 2.0; y += 1.0) {
      float w = exp(-(x * x + y * y) / 4.5);
      col += sampleBackdrop(samplePoint + vec2(x, y) * spread) * w;
      total += w;
    }
  }
  col /= total;

  // Lit from the left, slightly brighter at the top, like the reference.
  float across = (v_pixel.x - u_rect.x) / u_rect.z;
  float down = (v_pixel.y - u_rect.y) / u_rect.w;
  col = mix(col, vec3(1.0), 0.03 + 0.08 * (1.0 - across) + 0.02 * (1.0 - down));

  // Soft inner glow along the edge and a specular rim, brightest at the
  // top left and bottom right.
  col += vec3(1.0) * 0.06 * exp(-inside / (7.0 * u_dpr));
  float rim = exp(-inside / (1.3 * u_dpr));
  float light = 0.9 * max(dot(n, normalize(vec2(-1.0, -1.0))), 0.0)
              + 0.55 * max(dot(n, normalize(vec2(1.0, 1.0))), 0.0);
  col += vec3(1.0) * rim * (0.12 + 0.5 * light);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), mask * u_opacity);
}
`;

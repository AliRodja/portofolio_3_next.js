// Fragment coordinates use device pixels with a top-left origin to match DOM rects.
// Glass refraction adapted from liquid-glass-js by Armagan Amcalar (MIT, https://github.com/dashersw/liquid-glass-js).

export const fullscreenVertex = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
}
`;

// Renders the studio backdrop and blends between dark (u_light = 0) and light (u_light = 1) themes.
export const backdropFragment = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_dpr;
uniform vec3 u_blob1; // center.xy, radius; drift is computed in JS
uniform vec3 u_blob2;
uniform vec4 u_streak1; // center.xy, angle (radians), opacity
uniform vec4 u_streak2;
uniform float u_streakHalfLength;
uniform float u_light;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float radial(vec2 p, vec2 center, vec2 radii, float stop) {
  float k = length((p - center) / radii);
  return max(1.0 - k / stop, 0.0);
}

float blob(vec2 p, vec3 b) {
  float d = length(p - b.xy);
  float feather = 135.0 * u_dpr;
  return 1.0 - smoothstep(b.z - feather, b.z + feather, d);
}

float streak(vec2 p, vec4 s) {
  if (s.w <= 0.0) return 0.0;
  vec2 dir = vec2(cos(s.z), sin(s.z));
  vec2 normal = vec2(-dir.y, dir.x);
  vec2 rel = p - s.xy;
  float across = abs(dot(rel, normal));
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

  float L = u_light;
  vec3 col = mix(vec3(5.0), vec3(255.0, 255.0, 255.0), L) / 255.0;
  col = mix(col, vec3(1.0), mix(0.16, 0.95, L) * radial(p, vec2(0.12, 0.08) * R, vec2(0.60, 0.55) * R, 0.7));
  col = mix(col, vec3(1.0), mix(0.07, 0.8, L) * radial(p, vec2(0.92, 0.96) * R, vec2(0.45, 0.40) * R, 0.7));
  col = mix(col, mix(vec3(59.0, 62.0, 68.0), vec3(236.0, 240.0, 246.0), L) / 255.0, 0.45 * blob(p, u_blob1));
  col = mix(col, mix(vec3(42.0, 44.0, 48.0), vec3(241.0, 244.0, 249.0), L) / 255.0, 0.45 * blob(p, u_blob2));

  col += (hash(floor(p / u_dpr)) - 0.5) * mix(0.035, 0.01, L);

  float vignette = length((p - vec2(0.5, 0.4) * R) / (vec2(1.2, 0.9) * R));
  col = mix(col, vec3(0.0), mix(0.7, 0.02, L) * clamp((vignette - 0.55) / 0.45, 0.0, 1.0));

  float streaks = streak(p, u_streak1) + streak(p, u_streak2);
  col = mix(col + vec3(streaks), col * (1.0 - 0.22 * min(streaks, 1.0)), L);
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export const copyFragment = `
precision mediump float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
void main() {
  gl_FragColor = texture2D(u_texture, gl_FragCoord.xy / u_resolution);
}
`;

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
uniform float u_light;
varying vec2 v_pixel;

// Signed distance to a rounded rectangle centered at the origin (negative inside).
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

  vec2 e = vec2(1.0, 0.0);
  vec2 n = vec2(
    roundedRect(q + e.xy, halfSize, r) - roundedRect(q - e.xy, halfSize, r),
    roundedRect(q + e.yx, halfSize, r) - roundedRect(q - e.yx, halfSize, r)
  );
  n = length(n) > 0.0 ? normalize(n) : vec2(0.0, -1.0);

  // Scale rim refraction with element size and sample outward so background lines bend at the edge.
  float shortSide = min(halfSize.x, halfSize.y);
  float band = min(0.6 * shortSide, 28.0 * u_dpr);
  float t = clamp(1.0 - inside / band, 0.0, 1.0);
  vec2 samplePoint = v_pixel + n * (t * t * min(0.35 * shortSide, 24.0 * u_dpr));

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

  float across = (v_pixel.x - u_rect.x) / u_rect.z;
  float down = (v_pixel.y - u_rect.y) / u_rect.w;
  float tint = 0.03 + 0.08 * (1.0 - across) + 0.02 * (1.0 - down);
  vec3 lightGlass = mix(vec3(0.955, 0.965, 0.98), vec3(1.0), (1.0 - across) * 0.65 + (1.0 - down) * 0.35);
  col = mix(mix(col, vec3(1.0), tint), mix(col, lightGlass, 0.55), u_light);

  col += vec3(1.0) * 0.06 * exp(-inside / (7.0 * u_dpr));
  float rim = exp(-inside / (1.3 * u_dpr));
  float light = 0.9 * max(dot(n, normalize(vec2(-1.0, -1.0))), 0.0)
              + 0.55 * max(dot(n, normalize(vec2(1.0, 1.0))), 0.0);
  col += vec3(1.0) * rim * (0.12 + 0.5 * light);
  // On a light backdrop a white rim alone disappears, so add a fine dark edge.
  col = mix(col, vec3(0.06, 0.09, 0.16), u_light * 0.14 * exp(-inside / (0.9 * u_dpr)));

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), mask * u_opacity);
}
`;

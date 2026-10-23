import {
  backdropFragment,
  copyFragment,
  fullscreenVertex,
  glassFragment,
  glassVertex,
} from "./shaders";

// A glass element to draw, in device pixels with a top-left origin.
export type Pane = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  opacity: number;
  // Region the element is visible in (its overflow-clipping ancestors).
  clip: { x: number; y: number; width: number; height: number };
};

export type Streak = { x: number; y: number; angle: number; opacity: number };

export type Blob = { x: number; y: number; radius: number };

export type Frame = {
  blobs: [Blob, Blob];
  streaks: Streak[];
  streakHalfLength: number;
  // 0 for the dark theme, 1 for the light one, in between while switching.
  light: number;
  panes: Pane[];
};

type Program = {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
};

// Renders the backdrop into a texture, copies it to the screen, then draws
// every glass pane on top, sampling that texture. One WebGL context for the
// whole page, so the number of glass elements is not limited by the
// browser's cap on contexts.
export class GlassRenderer {
  private gl: WebGLRenderingContext;
  private quad: WebGLBuffer;
  private backdrop: Program;
  private copy: Program;
  private glass: Program;
  private texture: WebGLTexture;
  private framebuffer: WebGLFramebuffer;
  private width = 0;
  private height = 0;
  private dpr = 1;

  private constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      gl.STATIC_DRAW,
    );

    this.backdrop = this.createProgram(fullscreenVertex, backdropFragment, [
      "u_resolution",
      "u_dpr",
      "u_blob1",
      "u_blob2",
      "u_streak1",
      "u_streak2",
      "u_streakHalfLength",
      "u_light",
    ]);
    this.copy = this.createProgram(fullscreenVertex, copyFragment, [
      "u_texture",
      "u_resolution",
    ]);
    this.glass = this.createProgram(glassVertex, glassFragment, [
      "u_texture",
      "u_resolution",
      "u_rect",
      "u_radius",
      "u_opacity",
      "u_dpr",
      "u_light",
    ]);

    this.texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.framebuffer = gl.createFramebuffer()!;
  }

  // Returns null when WebGL or a shader is unavailable, so the caller can
  // keep the CSS fallback.
  static create(canvas: HTMLCanvasElement): GlassRenderer | null {
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) return null;
    try {
      return new GlassRenderer(gl);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  resize(width: number, height: number, dpr: number) {
    if (width === this.width && height === this.height && dpr === this.dpr) return;
    const gl = this.gl;
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    gl.canvas.width = width;
    gl.canvas.height = height;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  render(frame: Frame) {
    const gl = this.gl;
    const { width, height, dpr } = this;
    if (!width || !height) return;

    // 1. Backdrop into the texture.
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.viewport(0, 0, width, height);
    gl.disable(gl.BLEND);
    gl.disable(gl.SCISSOR_TEST);
    this.use(this.backdrop);
    const b = this.backdrop.uniforms;
    gl.uniform2f(b.u_resolution, width, height);
    gl.uniform1f(b.u_dpr, dpr);
    frame.blobs.forEach((blob, index) =>
      gl.uniform3f(index ? b.u_blob2 : b.u_blob1, blob.x, blob.y, blob.radius),
    );
    const [first, second] = frame.streaks;
    for (const [location, streak] of [
      [b.u_streak1, first],
      [b.u_streak2, second],
    ] as const) {
      gl.uniform4f(location, streak?.x ?? 0, streak?.y ?? 0, streak?.angle ?? 0, streak?.opacity ?? 0);
    }
    gl.uniform1f(b.u_streakHalfLength, frame.streakHalfLength);
    gl.uniform1f(b.u_light, frame.light);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 2. Backdrop to the screen.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width, height);
    this.use(this.copy);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.copy.uniforms.u_texture, 0);
    gl.uniform2f(this.copy.uniforms.u_resolution, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // 3. Glass panes, blended over the backdrop and clipped like the DOM.
    if (!frame.panes.length) return;
    this.use(this.glass);
    const g = this.glass.uniforms;
    gl.uniform1i(g.u_texture, 0);
    gl.uniform2f(g.u_resolution, width, height);
    gl.uniform1f(g.u_dpr, dpr);
    gl.uniform1f(g.u_light, frame.light);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.SCISSOR_TEST);

    for (const pane of frame.panes) {
      const { clip } = pane;
      // Scissor uses a bottom-left origin.
      gl.scissor(
        Math.floor(clip.x),
        Math.floor(height - clip.y - clip.height),
        Math.ceil(clip.width),
        Math.ceil(clip.height),
      );
      gl.uniform4f(g.u_rect, pane.x, pane.y, pane.width, pane.height);
      gl.uniform1f(g.u_radius, pane.radius);
      gl.uniform1f(g.u_opacity, pane.opacity);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    gl.disable(gl.SCISSOR_TEST);
  }

  destroy() {
    const gl = this.gl;
    gl.deleteBuffer(this.quad);
    gl.deleteTexture(this.texture);
    gl.deleteFramebuffer(this.framebuffer);
    for (const { program } of [this.backdrop, this.copy, this.glass]) {
      gl.deleteProgram(program);
    }
    // The context itself is left alive: React mounts effects twice in
    // development, and a lost context could not be reused by the canvas.
  }

  private use({ program }: Program) {
    const gl = this.gl;
    gl.useProgram(program);
    const location = gl.getAttribLocation(program, "a_position");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  }

  private createProgram(vertex: string, fragment: string, uniforms: string[]): Program {
    const gl = this.gl;
    const program = gl.createProgram()!;
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`Glass shader failed to compile: ${gl.getShaderInfoLog(shader)}`);
      }
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`Glass program failed to link: ${gl.getProgramInfoLog(program)}`);
    }
    return {
      program,
      uniforms: Object.fromEntries(
        uniforms.map((name) => [name, gl.getUniformLocation(program, name)]),
      ),
    };
  }
}

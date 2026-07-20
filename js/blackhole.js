/* Runner vanilla do buraco negro de Schwarzschild (mesmo shader do produto
   AtlasFile). Contrato idêntico ao BlackholeGL.tsx: blend premultiplicado
   (ONE, 1-SRC_ALPHA — o alfa do shader é sempre >= max componente da luz, o
   compositor Metal clampa pixels inválidos), DPR cap 1.25 no backdrop, pausa
   fora do viewport/aba oculta, reduced-motion congela em t=11.7. */

import { BH_FRAG, BH_VERT } from "./shader.js";

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("blackhole shader:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/* Centro do buraco em coordenadas de TELA (0..1, y-down do DOM) — espelha a
   fórmula do shader (variant backdrop): lissa(t*0.12) → (0.5+wx*0.30, 0.62+wy*0.16)
   em uv y-up; o DOM inverte o y. Usado pela espiral dos arquivos. */
export function bhCenter(t) {
  const lx = 0.75 * Math.sin(t * 0.12 * 0.37) + 0.25 * Math.sin(t * 0.12 * 0.83 + 1.0);
  const ly = 0.70 * Math.sin(t * 0.12 * 0.54 + 2.1) + 0.30 * Math.sin(t * 0.12 * 1.07);
  const x = 0.5 + lx * 0.30;
  const yUp = 0.62 + ly * 0.16;
  return { x, y: 1 - yUp };
}

/**
 * initBlackhole(canvas, { variant, getIntensity, starGain, onTime })
 *  - variant: "backdrop" | "orb"
 *  - getIntensity(): number 0..1 lido a cada frame (scroll-driven)
 *  - onTime(t): callback por frame com o relógio do shader (para a espiral)
 * Retorna false se WebGL2 indisponível (caller aplica fallback .no-gl).
 */
export function initBlackhole(canvas, { variant = "backdrop", getIntensity = () => 0.55, starGain = 0.6, onTime = null } = {}) {
  const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: true });
  if (!gl) return false;

  const vs = compile(gl, gl.VERTEX_SHADER, BH_VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, BH_FRAG);
  if (!vs || !fs) return false;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
  gl.useProgram(prog);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const loc = {
    res: gl.getUniformLocation(prog, "uRes"),
    time: gl.getUniformLocation(prog, "uTime"),
    intensity: gl.getUniformLocation(prog, "uIntensity"),
    variant: gl.getUniformLocation(prog, "uVariant"),
    starGain: gl.getUniformLocation(prog, "uStarGain"),
  };

  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    || new URLSearchParams(location.search).get("motion") === "reduce";

  let dpr = Math.min(window.devicePixelRatio || 1, variant === "backdrop" ? 1.25 : 2);
  const applySize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    canvas.width = Math.max(2, Math.round(w * dpr));
    canvas.height = Math.max(2, Math.round(h * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    // redimensionar limpa o canvas; sem loop rodando, redesenha o frame único
    if (reduced) draw(11.7);
  };
  const ro = new ResizeObserver(applySize);
  ro.observe(canvas);
  const start = performance.now();

  const draw = (t) => {
    gl.uniform2f(loc.res, canvas.width, canvas.height);
    gl.uniform1f(loc.time, t);
    gl.uniform1f(loc.intensity, getIntensity());
    gl.uniform1f(loc.variant, variant === "orb" ? 1 : 0);
    gl.uniform1f(loc.starGain, starGain);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (onTime) onTime(t);
  };

  let visible = !document.hidden;
  let inView = true;
  let raf = 0;
  let running = false;
  // Degrau adaptativo: 30 frames seguidos acima de 22ms → DPR 1.0
  let slowFrames = 0;
  let last = start;

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = now - last;
    last = now;
    if (dt > 22) {
      if (++slowFrames === 30 && dpr > 1) {
        dpr = 1;
        applySize();
      }
    } else if (slowFrames < 30) {
      slowFrames = 0;
    }
    draw((now - start) / 1000);
  };

  const syncLoop = () => {
    if (reduced) return;
    const should = visible && inView;
    if (should && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (!should && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  };

  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    syncLoop();
  });
  const io = new IntersectionObserver((entries) => {
    inView = entries[0]?.isIntersecting ?? true;
    syncLoop();
  });
  io.observe(canvas);

  applySize();
  if (reduced) draw(11.7); // frame estático digno (disco bem posicionado)
  else syncLoop();

  return true;
}

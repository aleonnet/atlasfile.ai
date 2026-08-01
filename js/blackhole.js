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
   fórmula do shader (variant backdrop), incluindo a correção de retrato:
   centro sobe (yUp 0.62→0.74) e a deriva vertical encolhe (0.16→0.06) no
   mesmo smoothstep(0.68, 1.05, aspect) do raio. O DOM inverte o y. */
export function bhCenter(t, aspect = 1.6) {
  const lx = 0.75 * Math.sin(t * 0.12 * 0.37) + 0.25 * Math.sin(t * 0.12 * 0.83 + 1.0);
  const ly = 0.70 * Math.sin(t * 0.12 * 0.54 + 2.1) + 0.30 * Math.sin(t * 0.12 * 1.07);
  const k = Math.min(1, Math.max(0, (aspect - 0.68) / (1.05 - 0.68)));
  const astep = k * k * (3 - 2 * k);
  const x = 0.5 + lx * 0.30;
  const yUp = 0.74 + (0.62 - 0.74) * astep + ly * (0.06 + (0.16 - 0.06) * astep);
  return { x, y: 1 - yUp };
}

/**
 * initBlackhole(canvas, { variant, getIntensity, starGain, onTime })
 *  - variant: "backdrop" | "orb"
 *  - getIntensity(): number 0..1 lido a cada frame (scroll-driven)
 *  - onTime(t): callback por frame com o relógio do shader (para a espiral)
 * Retorna false se WebGL2 indisponível (caller aplica fallback .no-gl).
 */
export function initBlackhole(canvas, { variant = "backdrop", getIntensity = () => 0.55, starGain = 0.6, onTime = null, calm = false, zoom = 1 } = {}) {
  // calm: canvas GRANDE que nao e o backdrop (ex.: hero do install) — herda o
  // pacing do backdrop (30fps de draw + DPR progressivo 1.0→1.25)
  const calmo = variant === "backdrop" || calm;
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
    zoom: gl.getUniformLocation(prog, "uZoom"),
  };

  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    || new URLSearchParams(location.search).get("motion") === "reduce";

  // DPR alvo (o visual pleno) e DPR inicial. O backdrop NASCE em 1.0 e é
  // PROMOVIDO ao alvo quando os frames provarem folga sustentada — máquina
  // forte fica visualmente idêntica (promove em ~1s), fraca nunca paga o
  // custo. O orb (120px) e o reduced-motion (1 frame só) começam no alvo:
  // ali a economia é irrisória e o preço seria nitidez.
  const dprAlvo = Math.min(window.devicePixelRatio || 1, calmo ? 1.25 : 2);
  // dprBase = nitidez que a máquina merece (1.0, promovida a dprAlvo).
  // dpr = dprBase × escala do nível de qualidade (ver NIVEIS abaixo).
  let dprBase = calmo && !reduced ? Math.min(dprAlvo, 1) : dprAlvo;
  let dpr = dprBase;
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
    gl.uniform1f(loc.zoom, zoom);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (onTime) onTime(t);
  };

  let visible = !document.hidden;
  let inView = true;
  let raf = 0;
  let running = false;
  let last = start;
  // Promoção de nitidez: 60 rAFs seguidos abaixo de 17ms — o orçamento de um
  // frame a 60Hz é 16.7ms — provam folga sustentada e o backdrop sobe para o
  // DPR alvo. Uma vez só; a escada de qualidade abaixo cuida do caminho oposto.
  let fastFrames = 0;
  let promoted = dprBase >= dprAlvo;
  let lastDraw = -1e9;

  /* ---- qualidade adaptativa (dynamic resolution scaling) --------------------
     Control law padrão (Babylon SceneOptimizer / DRS de console): degrada em
     degraus ordenados SÓ até voltar ao alvo, e volta a subir quando houver
     folga sustentada. Máquina que segura o alvo nunca sai do nível 0 e fica
     idêntica ao que rodava antes.

     Ordem dos degraus, medida em SwiftShader a 1280x720 (mesma corrida):
       nível 0 — 30fps de draw, escala 1.00 ................  55 fps  (baseline)
       nível 1 — 20fps de draw, escala 1.00 ................  81 fps  (+51.6%)
       nível 2 — 20fps de draw, escala 0.75 ................ 107 fps  (+93.2%)
     A cadência vem primeiro porque não custa UM pixel de nitidez (só taxa
     temporal, e o conteúdo anda a 0.12 rad/s). A escala vem depois porque
     amolece o anel de fótons. Pulamos 0.90/0.85 de propósito: medido, eles
     pagam praticamente o mesmo custo visual (0.85% dos px contra 0.98%) por
     metade do ganho.

     Gatilho por JANELA, não por sequência: frames de draw (~24ms) e de skip
     (~8ms) se alternam, então "N consecutivos acima de 22ms" nunca acontece —
     medido 179 de 345 frames lentos com sequência máxima de 4. Era por isso
     que o degrau antigo nunca disparava.

     Assimetria deliberada (padrão de DRS): desce após UMA janela ruim, sobe
     só após TRÊS janelas limpas. Cada transição chama applySize(), que realoca
     o buffer e limpa o canvas — oscilar sai mais caro que ficar degradado. */
  const NIVEIS = [
    { gap: 30, escala: 1 },
    { gap: 50, escala: 1 },
    { gap: 50, escala: 0.75 },
  ];
  const JANELA = 60;      // rAFs por avaliação
  const LENTOS_P_DESCER = 30; // metade da janela acima de 22ms
  const LIMPAS_P_SUBIR = 3;

  let nivel = 0;
  let drawGap = calmo ? NIVEIS[0].gap : 0;
  let amostras = 0, lentos = 0, limpas = 0;

  const aplicaNivel = () => {
    drawGap = calmo ? NIVEIS[nivel].gap : 0;
    const alvo = dprBase * NIVEIS[nivel].escala;
    if (alvo === dpr) return;
    dpr = alvo;
    applySize();
    // applySize LIMPA o canvas; sem zerar o gap, o próximo draw pode ser
    // segurado e deixar um frame transparente — um flash visível.
    lastDraw = -1e9;
  };

  // Contadores de prova (lidos pela bancada de medição; custo zero real)
  window.__bhStats = window.__bhStats || {};
  const stats = (window.__bhStats[canvas.id || variant] = { rafs: 0, draws: 0, nivel: 0 });

  const frame = (now) => {
    raf = requestAnimationFrame(frame);
    const dt = now - last;
    last = now;
    stats.rafs++;

    if (dt > 22) lentos++;
    if (++amostras >= JANELA) {
      if (lentos >= LENTOS_P_DESCER && nivel < NIVEIS.length - 1) {
        nivel++;
        promoted = true; // quem está degradando não volta a subir nitidez base
        limpas = 0;
        aplicaNivel();
      } else if (lentos === 0 && nivel > 0) {
        if (++limpas >= LIMPAS_P_SUBIR) { nivel--; limpas = 0; aplicaNivel(); }
      } else if (lentos > 0) {
        limpas = 0;
      }
      stats.nivel = nivel;
      amostras = 0;
      lentos = 0;
    }

    if (nivel === 0 && !promoted && dt < 17 && ++fastFrames >= 60) {
      promoted = true;
      dprBase = dprAlvo;
      aplicaNivel();
    } else if (dt >= 17) {
      fastFrames = 0;
    }

    if (drawGap && now - lastDraw < drawGap) return;
    lastDraw = now;
    stats.draws++;
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

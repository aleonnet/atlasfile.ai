/* Arquivos caóticos que a gravidade puxa: chips DOM espiralando rumo ao centro
   REAL do buraco (bhCenter replica a deriva Lissajous do shader). Só
   transform/opacity; tudo dirigido pelo tick do motor único. */

import { bhCenter } from "./blackhole.js";

const FILES = [
  "contract_draft (3).pdf", "ata_2024_final_v2.docx", "notas fiscais (7).xlsx",
  "IMG_4021.png", "scan0093.tiff", "sem_titulo_final_v2.doc",
  "Q2-report-REVIEWED.pdf", "meeting_notes.eml", "deck_v9_FINAL.pptx",
  "orçamento-2025 copy.xlsx", "carta_registrada.msg", "backup_old.zip",
  "foto_whatsapp_2024.jpeg", "minuta__revisar!!.docx",
];

const TAU = Math.PI * 2;
let chips = [];
let stage = null;

function ext(name) {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i);
}

export function initDebris(stageEl) {
  stage = stageEl;
  const wrap = stageEl.querySelector(".debris");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  chips = FILES.map((name, i) => {
    const el = document.createElement("span");
    el.className = "chip";
    const e = ext(name);
    el.innerHTML = `${name.slice(0, name.length - e.length)}<span class="ext">${e}</span>`;
    wrap.appendChild(el);
    const golden = i * 0.61803 * TAU;
    return {
      el,
      // posição de repouso: anel largo ao redor do centro da tela
      angle0: golden,
      radius0: 0.32 + 0.16 * ((i * 0.37) % 1),      // fração do menor lado
      drift: 0.05 + 0.1 * ((i * 0.53) % 1),          // flutuação parada
      delay: 0.06 + 0.55 * (i / FILES.length),        // entrada escalonada na espiral
      spin: 2.2 + ((i * 0.29) % 1) * 1.6,             // voltas até o horizonte
    };
  });

  if (reduced) {
    // constelação estática digna: espalhados, sem espiral
    layout(0, 0);
  }
  return chips.length;
}

/* pos do chip: interpola do repouso (órbita larga flutuante) até o centro do
   buraco, espiralando; some perto do horizonte. */
export function layout(t, p) {
  if (!stage) return;
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  const minSide = Math.min(w, h);
  const c = bhCenter(t);
  const cx = c.x * w;
  const cy = c.y * h;

  for (const chip of chips) {
    const k0 = Math.max(0, Math.min(1, (p - chip.delay) / Math.max(0.001, 1 - chip.delay)));
    const k = k0 * k0 * (3 - 2 * k0); // smoothstep

    // repouso: anel + flutuação lenta (centro do anel abaixo do buraco)
    const wob = Math.sin(t * chip.drift * 3 + chip.angle0) * 0.02;
    const restR = (chip.radius0 + wob) * minSide;
    const restA = chip.angle0 + t * 0.02;
    const rx = w / 2 + Math.cos(restA) * restR * 1.35;
    const ry = h * 0.58 + Math.sin(restA) * restR * 0.8;

    // espiral: raio decai até 0 no centro do buraco, ângulo acumula voltas
    const spR = restR * (1 - k);
    const spA = restA + k * chip.spin * TAU * 0.5;
    const sx = cx + Math.cos(spA) * spR;
    const sy = cy + Math.sin(spA) * spR;

    const x = rx + (sx - rx) * k;
    const y = ry + (sy - ry) * k;
    const scale = 1 - 0.75 * k;
    const fade = k < 0.82 ? 1 : Math.max(0, 1 - (k - 0.82) / 0.14);

    chip.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%,-50%) rotate(${(spA - restA) * 30}deg) scale(${scale.toFixed(3)})`;
    chip.el.style.opacity = fade.toFixed(3);
  }
}

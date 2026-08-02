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

/* Estreito (<560px): constelação estática — 5 chips (uma extensão de cada) em
   posições nomeadas (frações de w,h) ao redor e abaixo do buraco. O anel
   girante não cabe: 5+ chips × ~140px excedem o perímetro do anel em 390px, e
   ancorar no cy importa a deriva Lissajous por cima do eyebrow (medido). Em
   alturas ≤667px o chip mais baixo pode roçar a zona do eyebrow — o próprio
   disco já invade essa região nessas telas; o texto fica por cima (z-index). */
const POS_NARROW = {
  0: [0.78, 0.33],   // contract_draft (3).pdf   — abaixo, à direita
  2: [0.35, 0.35],   // notas fiscais (7).xlsx   — abaixo, à esquerda
  4: [0.36, 0.145],  // scan0093.tiff            — acima
  8: [0.77, 0.19],   // deck_v9_FINAL.pptx       — alto, à direita
  12: [0.22, 0.28],  // foto_whatsapp_2024.jpeg  — lado esquerdo
};

let chips = [];
let stage = null;
let heroCopy = null;

function ext(name) {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i);
}

export function initDebris(stageEl) {
  stage = stageEl;
  heroCopy = stageEl.querySelector(".hero-copy");
  const wrap = stageEl.querySelector(".debris");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile: só os 5 chips de POS_NARROW via CSS (.chip-extra some <560px) —
  // responsivo nos dois sentidos, ao contrário de decidir no load
  const files = FILES;

  chips = files.map((name, i) => {
    const el = document.createElement("span");
    el.className = i in POS_NARROW ? "chip" : "chip chip-extra";
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
      delay: 0.06 + 0.55 * (i / files.length),        // entrada escalonada na espiral
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
  const narrow = w < 560;
  const c = bhCenter(t, w / h);
  const cx = c.x * w;
  const cy = c.y * h;
  const ringCY = h * 0.58;
  const ringScaleX = 1.35;
  const ringScaleY = 0.8;
  const dim = narrow ? 0.7 : 1;

  /* Caixa proibida: o texto do hero, inflado pela METADE DO CHIP (empurrar só
     o centro até a borda deixaria metade do chip ainda por cima) mais folga.
     Existe porque o anel escala com min(w,h) e é concêntrico com a copy
     (ringCY = 0.58h = o centro dela), enquanto o texto tem altura fixa em px:
     em tela larga e baixa o anel encolhe para dentro do texto — medido, 13 de
     14 chips a 1440x610 e 14 de 14 a 1440x560.
     Lida no MESMO lote de leituras de clientWidth/Height, sem reflow extra, e
     por frame em vez de cacheada: a caixa muda com resize E com troca de
     idioma (a copy em PT é mais alta). Guarda: tests/hero-hit.mjs */
  let proibida = null;
  let dims = null;
  if (!narrow && heroCopy && chips.length) {
    const rc = heroCopy.getBoundingClientRect();
    const rs = stage.getBoundingClientRect();
    // Todas as leituras de layout num lote só, ANTES de qualquer escrita —
    // ler offsetWidth dentro do loop de escrita causaria thrash. A inflação é
    // POR CHIP porque as larguras variam muito ("foto_whatsapp_2024.jpeg"
    // contra "IMG_4021.png"): usar a do primeiro sub-infla os largos e eles
    // continuam por cima do texto.
    dims = chips.map((c) => [c.el.offsetWidth, c.el.offsetHeight]);
    proibida = {
      cx: rc.left - rs.left + rc.width / 2,
      cy: rc.top - rs.top + rc.height / 2,
      w2: rc.width / 2,
      h2: rc.height / 2,
    };
  }

  for (let i = 0; i < chips.length; i++) {
    const chip = chips[i];
    const k0 = Math.max(0, Math.min(1, (p - chip.delay) / Math.max(0.001, 1 - chip.delay)));
    const k = k0 * k0 * (3 - 2 * k0); // smoothstep

    // repouso: anel + flutuação lenta (largo) OU constelação fixa + flutter (estreito)
    const wob = Math.sin(t * chip.drift * 3 + chip.angle0) * 0.02;
    const restR = (chip.radius0 + wob) * minSide;
    const restA = chip.angle0 + t * 0.02;
    const pos = narrow ? POS_NARROW[i] : null;
    let rx = pos
      ? pos[0] * w + Math.sin(t * chip.drift * 3 + chip.angle0) * 5
      : w / 2 + Math.cos(restA) * restR * ringScaleX;
    let ry = pos
      ? pos[1] * h + Math.cos(t * chip.drift * 2 + chip.angle0) * 4
      : ringCY + Math.sin(restA) * restR * ringScaleY;

    // Quem cair na caixa proibida sai por UM eixo — o de menor deslocamento
    // que ainda deixe o chip inteiro dentro do palco. Empurrão radial parecia
    // mais natural mas quebra em tela estreita: ali a caixa inflada fica mais
    // larga que o próprio viewport (medido, hw 452px contra 400 de meia-tela a
    // 800px), então a saída horizontal é sempre para fora da borda — subiu de
    // 1 para 7 chips cortados. Na vertical sempre cabe, porque a caixa tem a
    // altura do texto, não a largura.
    // Só no REPOUSO: na espiral (k>0) os chips devem atravessar o centro, e
    // ali a copy já sumiu (heroFade zera em p >= 0.28, main.js:45).
    // Em tela alta nada cai dentro, então isto é no-op.
    if (proibida) {
      const mx = dims[i][0] / 2 + 4, my = dims[i][1] / 2 + 4;
      const hw = proibida.w2 + mx + 10, hh = proibida.h2 + my + 10;
      const dx = rx - proibida.cx, dy = ry - proibida.cy;
      const n = Math.max(Math.abs(dx) / hw, Math.abs(dy) / hh);
      if (n < 1 && n > 1e-4) {
        // RADIAL: escala o raio até a borda da caixa, ao longo do próprio raio
        // do chip. Preserva o ângulo — o centro do anel (ringCY = 0.58h) e o
        // centro da copy coincidem — e por isso não aglomera.
        const px = proibida.cx + dx / n, py = proibida.cy + dy / n;
        if (px >= mx && px <= w - mx && py >= my && py <= h - my) {
          rx = px; ry = py;
        } else {
          // Radial sairia do palco (acontece em tela estreita, onde a caixa
          // inflada é mais larga que a meia-tela). Cai para o eixo que cabe.
          // Axial não preserva ângulo e tende a aglomerar, por isso é o plano B.
          const alvoX = proibida.cx + (dx < 0 ? -hw : hw);
          const alvoY = proibida.cy + (dy < 0 ? -hh : hh);
          const cabeX = alvoX >= mx && alvoX <= w - mx;
          const cabeY = alvoY >= my && alvoY <= h - my;
          if (cabeY && (!cabeX || Math.abs(alvoY - ry) <= Math.abs(alvoX - rx))) ry = alvoY;
          else if (cabeX) rx = alvoX;
          else ry = Math.min(Math.max(alvoY, my), h - my);
        }
      }
    }

    // espiral: raio decai até 0 no centro do buraco, ângulo acumula voltas
    const spR = restR * (1 - k);
    const spA = restA + k * chip.spin * TAU * 0.5;
    const sx = cx + Math.cos(spA) * spR;
    const sy = cy + Math.sin(spA) * spR;

    const x = rx + (sx - rx) * k;
    const y = ry + (sy - ry) * k;
    const scale = 1 - 0.75 * k;
    const fade = (k < 0.82 ? 1 : Math.max(0, 1 - (k - 0.82) / 0.14)) * dim;

    chip.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%,-50%) rotate(${(spA - restA) * 30}deg) scale(${scale.toFixed(3)})`;
    chip.el.style.opacity = fade.toFixed(3);
  }
}

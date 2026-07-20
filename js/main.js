/* Entry da landing: i18n primeiro (evita flash de EN para usuários PT),
   tema, buraco negro + motor único de scroll, debris, reveals, terminal, copy. */

import { initI18n, t } from "./i18n.js";
import { initTheme } from "./theme.js";
import { initBlackhole } from "./blackhole.js";
import { measure, tick, initReveals, initFpsDebug } from "./scroll.js";
import { initDebris, layout } from "./debris.js";
import { initTerminal } from "./terminal.js";
import { initCopyButtons } from "./clipboard.js";

initI18n();
initTheme(document.getElementById("theme-toggle"));

const act = document.getElementById("act-gravity");
const stage = act.querySelector(".act-gravity__stage");
const canvas = document.getElementById("bh");
const heroCopy = document.getElementById("hero-copy");
const chaosCaption = document.getElementById("chaos-caption");

measure(act);
addEventListener("resize", () => measure(act), { passive: true });

// header adota o tema da página quando o ato espacial sai de cena
const syncHeader = () => {
  document.body.classList.toggle("past-space", window.scrollY > act.offsetTop + act.offsetHeight - window.innerHeight * 1.05);
};
addEventListener("scroll", syncHeader, { passive: true });
syncHeader();
initDebris(stage);
initReveals();
const fps = initFpsDebug();

let currentP = 0;
const ok = initBlackhole(canvas, {
  variant: "backdrop",
  starGain: 0.6,
  // intensidade cresce com o scroll: buraco "engorda" enquanto puxa os arquivos
  getIntensity: () => 0.35 + 0.65 * currentP,
  onTime: (tSec) => {
    currentP = tick();
    layout(tSec, currentP);
    // hero some cedo; legenda do caos vive no meio do ato
    const heroFade = Math.max(0, 1 - currentP / 0.28);
    heroCopy.style.opacity = heroFade.toFixed(3);
    heroCopy.style.pointerEvents = heroFade < 0.15 ? "none" : "";
    const cap = currentP < 0.35 ? 0 : currentP < 0.5 ? (currentP - 0.35) / 0.15 : currentP < 0.85 ? 1 : Math.max(0, (1 - currentP) / 0.15);
    chaosCaption.style.opacity = cap.toFixed(3);
    fps();
  },
});
if (!ok) {
  stage.classList.add("no-gl");
  // sem shader: coreografia estática, conteúdo intacto
  const p = new URLSearchParams(location.search);
  layout(11.7, p.has("progress") ? parseFloat(p.get("progress")) || 0 : 0);
}

// reduced-motion: o shader desenha 1 frame e não chama onTime em loop —
// garante uma passada de layout digna
if (matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).get("motion") === "reduce") {
  layout(11.7, 0);
  heroCopy.style.opacity = "1";
}

// modo OG (?og=1): esconde chrome da página para o screenshot 1200x630
if (new URLSearchParams(location.search).get("og") === "1") {
  document.querySelector(".site-header").style.display = "none";
  document.querySelector(".scroll-cue").style.display = "none";
  document.getElementById("debris").style.display = "none";
  document.querySelector(".hero-copy .eyebrow").style.display = "none";
  document.querySelectorAll(".hero-actions").forEach((el) => (el.style.display = "none"));
  heroCopy.style.marginTop = "10vh";
}

// terminal do CTA + copiar embutido
initTerminal(document.getElementById("cta-term"));
initCopyButtons(t);

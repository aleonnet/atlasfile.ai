/* Entry do install.html: i18n/tema, orb-assinatura (variant orb), terminal
   com estado final imediato ao entrar em view, tabs ARIA, copy buttons. */

import { initI18n, t } from "./i18n.js";
import { initTheme } from "./theme.js";
import { initBlackhole } from "./blackhole.js";
import { initTerminal } from "./terminal.js";
import { initCopyButtons } from "./clipboard.js";
import { initAllTabs } from "./tabs.js";

initI18n();
initTheme(document.getElementById("theme-toggle"));
document.body.classList.add("past-space"); // sem ato espacial: header temável desde o topo

// assinatura: mini buraco negro (look Inferno fixo do variant orb)
// hero inteiro: mesmo shader, pacing calmo (30fps + DPR progressivo)
initBlackhole(document.getElementById("orb-sig"), { variant: "orb", starGain: 0.5, getIntensity: () => 0.8, calm: true, zoom: 0.28 });

initTerminal(document.getElementById("install-term"));

// tabs ARIA compartilhadas (tabs.js, escopadas por tablist); os textos
// sensíveis à plataforma acompanham a aba selecionada em qualquer grupo
function applyPlatform(platform) {
  document.querySelectorAll(".platform-text").forEach((el) => {
    el.dataset.i18nHtml = el.dataset.i18nHtml.replace(/\.(mac|win)$/, `.${platform}`);
    el.innerHTML = t(el.dataset.i18nHtml);
  });
}
initAllTabs({ onSelect: (tab) => applyPlatform(tab.id.endsWith("-win") ? "win" : "mac") });

// copiar embutido nas caixas de comando
initCopyButtons(t);

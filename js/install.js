/* Entry do install.html: i18n/tema, orb-assinatura (variant orb), terminal
   com estado final imediato ao entrar em view, tabs ARIA, copy buttons. */

import { initI18n, t } from "./i18n.js";
import { initTheme } from "./theme.js";
import { initBlackhole } from "./blackhole.js";
import { initTerminal } from "./terminal.js";

initI18n();
initTheme(document.getElementById("theme-toggle"));
document.body.classList.add("past-space"); // sem ato espacial: header temável desde o topo

// assinatura: mini buraco negro (look Inferno fixo do variant orb)
initBlackhole(document.getElementById("orb-sig"), { variant: "orb", starGain: 0.35, getIntensity: () => 0.8 });

initTerminal(document.getElementById("install-term"));

// tabs ARIA (setas + clique)
const tabs = [...document.querySelectorAll('[role="tab"]')];
function select(tab) {
  tabs.forEach((other) => {
    const on = other === tab;
    other.setAttribute("aria-selected", String(on));
    other.tabIndex = on ? 0 : -1;
    document.getElementById(other.getAttribute("aria-controls")).hidden = !on;
  });
  tab.focus();
}
tabs.forEach((tab) => {
  tab.addEventListener("click", () => select(tab));
  tab.addEventListener("keydown", (e) => {
    const i = tabs.indexOf(tab);
    if (e.key === "ArrowRight") select(tabs[(i + 1) % tabs.length]);
    if (e.key === "ArrowLeft") select(tabs[(i - 1 + tabs.length) % tabs.length]);
  });
});

// copy buttons
document.querySelectorAll(".copy-cmd").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const code = btn.parentElement.querySelector("[data-cmd]");
    try {
      await navigator.clipboard.writeText(code.dataset.cmd);
      btn.textContent = t("cta.copied");
      setTimeout(() => (btn.textContent = t("cta.copy")), 1800);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      getSelection().removeAllRanges();
      getSelection().addRange(range);
    }
  });
});

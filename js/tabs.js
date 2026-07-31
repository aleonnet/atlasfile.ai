/* Tabs ARIA compartilhadas (home CTA, install step 1 e step 5).
   ESCOPADAS POR TABLIST: a versão inline do install.js juntava todos os
   [role="tab"] da página numa lista só — um segundo grupo de abas faria as
   setas navegarem entre grupos e esconderem painéis alheios. */
export function initTabs(tablist, { onSelect } = {}) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  function select(tab) {
    tabs.forEach((other) => {
      const on = other === tab;
      other.setAttribute("aria-selected", String(on));
      other.tabIndex = on ? 0 : -1;
      document.getElementById(other.getAttribute("aria-controls")).hidden = !on;
    });
    if (onSelect) onSelect(tab);
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
}

export function initAllTabs(opts) {
  document.querySelectorAll('[role="tablist"]').forEach((tl) => initTabs(tl, opts));
}

/* Botões de copiar embutidos nas caixas de comando (.cmd-box > .copy-icon):
   copia o data-cmd do <code> irmão; feedback = ícone vira check. */

const CHECK_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

export function initCopyButtons(t) {
  document.querySelectorAll(".cmd-box").forEach((box) => {
    const btn = box.querySelector(".copy-icon");
    const code = box.querySelector("[data-cmd]");
    if (!btn || !code) return;
    const original = btn.innerHTML;
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.dataset.cmd);
        btn.classList.add("copied");
        btn.innerHTML = CHECK_SVG;
        btn.title = t("cta.copied");
        setTimeout(() => {
          btn.classList.remove("copied");
          btn.innerHTML = original;
          btn.title = t("cta.copy");
        }, 1600);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(code);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
      }
    });
  });
}

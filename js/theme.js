/* Toggle de tema. O anti-FOUC (leitura inicial) é inline no <head>; aqui vive
   o toggle manual + modo auto (segue o SO enquanto não houver escolha salva). */

const KEY = "atlasfile.theme";

function current() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function apply(theme) {
  if (theme === "light") document.documentElement.dataset.theme = "light";
  else delete document.documentElement.dataset.theme;
}

export function initTheme(btn) {
  btn?.addEventListener("click", () => {
    const next = current() === "light" ? "dark" : "light";
    localStorage.setItem(KEY, next);
    apply(next);
  });

  // Sem escolha salva → acompanha o SO ao vivo
  matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    if (!localStorage.getItem(KEY)) apply(e.matches ? "light" : "dark");
  });
}

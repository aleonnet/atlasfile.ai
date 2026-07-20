/* Motor do scrollytelling: UM relógio. O progresso do ato sticky (0..1) é
   suavizado por frame (feel gravitacional) e alimenta shader (uIntensity),
   debris (espiral) e fades. Reveals gerais via IntersectionObserver.
   ?progress=0.6 congela a coreografia (validação headless determinística). */

const q = new URLSearchParams(location.search);
const forced = q.has("progress") ? Math.max(0, Math.min(1, parseFloat(q.get("progress")) || 0)) : null;

let actTop = 0;
let actRange = 1;
let pSmooth = forced ?? 0;

export function measure(actEl) {
  const rect = actEl.getBoundingClientRect();
  actTop = rect.top + window.scrollY;
  actRange = Math.max(1, actEl.offsetHeight - window.innerHeight);
}

/** Chamado uma vez por frame (dentro do rAF do blackhole). Retorna pSmooth. */
export function tick() {
  if (forced !== null) return forced;
  const p = Math.max(0, Math.min(1, (window.scrollY - actTop) / actRange));
  pSmooth += (p - pSmooth) * 0.12;
  return pSmooth;
}

export function progress() { return forced ?? pSmooth; }

export function initReveals() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-in")),
    { threshold: 0.2 }
  );
  document.querySelectorAll(".reveal, .tree").forEach((el) => io.observe(el));
  if (forced !== null || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".reveal, .tree").forEach((el) => el.classList.add("is-in"));
  }
}

/* ?debug=fps — contador simples */
export function initFpsDebug() {
  if (q.get("debug") !== "fps") return () => {};
  const el = document.createElement("div");
  el.style.cssText = "position:fixed;bottom:8px;right:10px;z-index:99;font:12px monospace;color:#0f0;background:rgba(0,0,0,.6);padding:2px 8px;border-radius:6px";
  document.body.appendChild(el);
  let frames = 0;
  let last = performance.now();
  return () => {
    frames++;
    const now = performance.now();
    if (now - last >= 1000) {
      el.textContent = `${frames} fps`;
      frames = 0;
      last = now;
    }
  };
}

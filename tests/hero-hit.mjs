/**
 * Guarda de TELA dos CTAs do hero.
 *
 * Prova que "Install AtlasFile" e "Star on GitHub" recebem o clique de verdade,
 * usando document.elementFromPoint na arvore de layout de um Chromium real —
 * nao inspecao de fonte. O defeito que ela existe para travar: elementos
 * decorativos empatados em z-index com .hero-copy e vencendo por ordem de DOM
 * roubam o hit-test quando a altura do viewport encolhe.
 *
 * O limiar depende de ALTURA, LARGURA e IDIOMA: em PT a copy do hero e' mais
 * alta que em EN, e o limiar sobe de ~887px para ~940px. Por isso a matriz roda
 * nos dois idiomas — PT reprova em viewports onde EN passa.
 *
 *   npm --prefix tests install
 *   node tests/hero-hit.mjs              # matriz completa
 *   node tests/hero-hit.mjs --sweep-cue  # mede o limiar real do .scroll-cue
 *
 * Serve o repo por HTTP proprio (ES modules nao carregam via file://), entao
 * reprova ANTES do deploy. BASE_URL=<url> aponta para outro alvo.
 */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".webm": "video/webm", ".json": "application/json",
};

/* Viewports: a matriz cobre os DOIS limiares medidos, dos dois lados. Sem os
   pares em torno de 940 (PT) e 887 (EN) a guarda nao prova o limiar — so
   amostra pontos longe dele. */
const VIEWPORTS = [
  [1920, 945], // Windows 1080p maximizado @100% — em PT a folga cai para ~1.5px
  [1600, 945], // limiar PT, lado de cima
  [1600, 935], // limiar PT, lado de baixo
  [1600, 900],
  [1536, 875], // 1920x1200 @125% e 2560x1440 @150% caem aqui
  [1440, 890], // limiar EN, lado de cima
  [1440, 884], // limiar EN, lado de baixo — PT ja reprova aqui
  [1536, 779], // 1080p @125%
  [1366, 768],
  [1280, 720],
  [1280, 610], // 1080p @150%
  [390, 844],  // retrato: k muda de 0.28 para 0.24 (landing.css:37)
];
const LANGS = ["en", "pt"];

function serve() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    const rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
    const file = join(ROOT, rel === "/" ? "index.html" : rel);
    try {
      const body = await readFile(file);
      res.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  return new Promise((r) => server.listen(0, "127.0.0.1", () => r(server)));
}

/* Sonda de 9 pontos. O inset vem do border-radius calculado, nao de um 3
   fixo: com --radius-md 10px, um inset de 3 cai a 0.1px de dentro do arco do
   canto e os 4 cantos viram falso-positivo sob arredondamento a DPR fracionario. */
const PROBE = () => {
  const inset = (el) =>
    Math.max(4, Math.ceil(parseFloat(getComputedStyle(el).borderTopLeftRadius || "0") * 0.5));
  const nome = (n) =>
    !n ? "null" : n.tagName + (n.id ? "#" + n.id : "") +
      (typeof n.className === "string" && n.className ? "." + n.className.trim().split(/\s+/).join(".") : "");

  const btns = [...document.querySelectorAll(".hero-actions .btn")];
  const cap = document.getElementById("chaos-caption");
  const capRect = cap?.getBoundingClientRect();

  const alvos = btns.map((el) => {
    const r = el.getBoundingClientRect();
    const d = inset(el);
    const mortos = [];
    for (const x of [r.left + d, r.left + r.width / 2, r.right - d])
      for (const y of [r.top + d, r.top + r.height / 2, r.bottom - d]) {
        const t = document.elementFromPoint(x, y);
        if (!t || !(el.contains(t) || t === el)) mortos.push(nome(t));
      }
    return { texto: el.textContent.trim().slice(0, 18), mortos: mortos.length, ladroes: [...new Set(mortos)] };
  });

  // sobreposicao VISUAL: opacity nao muda a caixa, entao cruzar retangulos so
  // e' defeito se a legenda estiver efetivamente visivel
  const actRect = document.querySelector(".hero-actions")?.getBoundingClientRect();
  const cruza = !!(capRect && actRect &&
    capRect.top < actRect.bottom && capRect.bottom > actRect.top &&
    capRect.left < actRect.right && capRect.right > actRect.left);
  const capOpacity = cap ? getComputedStyle(cap).opacity : "0";

  return {
    lang: document.documentElement.lang,
    folga: capRect && btns[0] ? +(capRect.top - btns[0].getBoundingClientRect().bottom).toFixed(1) : null,
    alvos,
    cruzaRetangulos: cruza,
    capOpacity,
    cue: (() => {
      const c = document.querySelector(".scroll-cue");
      if (!c) return null;
      const r = c.getBoundingClientRect();
      return { top: +r.top.toFixed(1), visivel: getComputedStyle(c).display !== "none" };
    })(),
  };
};

async function medir(browser, base, { w, h, lang, reduced = false }) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/index.html?lang=${lang}`, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const out = await page.evaluate(PROBE);
  await ctx.close();
  return out;
}

async function sweepCue(browser, base) {
  console.log("\nVarredura do limiar do .scroll-cue (passo de 10px, EN e PT)\n");
  for (const lang of LANGS) {
    let limiar = null;
    for (let h = 900; h >= 560; h -= 10) {
      const r = await medir(browser, base, { w: 1440, h, lang });
      const roubaCue = r.alvos.some((a) => a.ladroes.some((l) => l.includes("scroll-cue")));
      if (roubaCue) { limiar = h; break; }
    }
    console.log(`  ${lang.toUpperCase()}: o .scroll-cue passa a roubar clique em vh <= ${limiar ?? "(nao ocorreu ate 560)"}`);
  }
}

const server = await serve();
const base = process.env.BASE_URL ?? `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
let falhas = 0, casos = 0;

try {
  if (process.argv.includes("--sweep-cue")) {
    await sweepCue(browser, base);
  } else {
    console.log(`\nGuarda de hit-test dos CTAs do hero  —  alvo: ${base}\n`);
    console.log("  viewport    lang  folga     Install   Star      veredito");
    console.log("  " + "-".repeat(68));
    for (const [w, h] of VIEWPORTS) {
      for (const lang of LANGS) {
        casos++;
        const r = await medir(browser, base, { w, h, lang });
        const [a, b] = r.alvos;
        const ok = a.mortos === 0 && b.mortos === 0;
        if (!ok) falhas++;
        const ladroes = [...new Set([...a.ladroes, ...b.ladroes])].join(" ");
        console.log(
          `  ${String(w + "x" + h).padEnd(11)} ${lang.padEnd(5)} ` +
          `${String(r.folga).padStart(7)}   ${(a.mortos + "/9").padEnd(9)} ${(b.mortos + "/9").padEnd(9)} ` +
          `${ok ? "ok" : "MORTO  <- " + ladroes}`
        );
      }
    }

    console.log("\n  reduced-motion — a legenda nao pode ficar VISIVEL sobre os botoes");
    console.log("  " + "-".repeat(68));
    for (const [w, h] of VIEWPORTS) {
      for (const lang of LANGS) {
        casos++;
        const r = await medir(browser, base, { w, h, lang, reduced: true });
        const [a, b] = r.alvos;
        const sobrepoeVisivel = r.cruzaRetangulos && r.capOpacity !== "0";
        const ok = a.mortos === 0 && b.mortos === 0 && !sobrepoeVisivel;
        if (!ok) falhas++;
        console.log(
          `  ${String(w + "x" + h).padEnd(11)} ${lang.padEnd(5)} ` +
          `${String(r.folga).padStart(7)}   ${(a.mortos + "/9").padEnd(9)} ${(b.mortos + "/9").padEnd(9)} ` +
          `${ok ? "ok" : sobrepoeVisivel ? `SOBREPOE (opacity ${r.capOpacity})` : "MORTO"}`
        );
      }
    }

    console.log(`\n  ${casos - falhas}/${casos} casos ok, ${falhas} falha(s)\n`);
  }
} finally {
  await browser.close();
  server.close();
}

process.exit(falhas > 0 ? 1 : 0);

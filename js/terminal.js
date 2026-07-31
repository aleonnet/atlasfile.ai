/* Terminal fake: digita o one-liner real e imprime o output fiel do
   install.sh (caixinha ╭─╮ com os endereços). Estado final instantâneo em
   reduced-motion ou ?progress. */

import { currentLang } from "./i18n.js";

const CMD = "curl -fsSL https://raw.githubusercontent.com/aleonnet/atlasfile/main/install.sh | bash -s -- --enable-auth";

// A caixinha final é UM bloco com borda CSS: Fragment Mono não tem glifos
// box-drawing (╭│) — cairiam em fonte fallback com largura diferente e as
// bordas desalinhariam.
/* Roteiro fiel ao install.sh vigente (caminho release, pós-Fase-4a): títulos
   [1/4]..[4/4] literais, bundle SHA-verificado, pull da imagem publicada,
   painel de 4 linhas (com MCP) e a linha da API key. Tempos REAIS medidos no
   E2E de 2026-07-31 na VM lima (install completo em 1m11s; pull 16s, subida
   19s, health 4s) — nunca um número inventado. Cortes declarados: as linhas
   de pré-requisito são condensadas numa só e o bloco "Next steps" fica fora.
   O idioma do instalador real é EN; a versão PT é tradução ilustrativa. */
function scriptLines(lang) {
  const pt = lang === "pt";
  return [
    { cls: "t-step", text: pt ? "[1/4] Verificando e preparando pré-requisitos" : "[1/4] Checking and preparing prerequisites" },
    { cls: "t-ok-line", text: pt ? "  ✓ curl · tar · docker (daemon de pé) · docker compose" : "  ✓ curl · tar · docker (daemon running) · docker compose" },
    { cls: "t-step", text: pt ? "[2/4] Obtendo o AtlasFile" : "[2/4] Getting AtlasFile" },
    { cls: "t-ok-line", text: pt ? "  ✓ bundle da release v1.0.0 baixado e verificado (checksum ok)" : "  ✓ release bundle v1.0.0 downloaded and verified (checksum ok)" },
    { cls: "t-step", text: pt ? "[3/4] Configurando" : "[3/4] Configuring" },
    { cls: "t-ok-line", text: pt ? "  ✓ .env criado (senha do OpenSearch gerada para esta instalação)" : "  ✓ .env created (OpenSearch password generated for this install)" },
    { cls: "t-step", text: pt ? "[4/4] Baixando as imagens e subindo a stack" : "[4/4] Getting the images and starting the stack" },
    { cls: "t-ok-line", text: pt ? "  ✓ pull da imagem publicada no ghcr.io (16s)" : "  ✓ pulling the app image (published on ghcr.io) (16s)" },
    { cls: "t-ok-line", text: pt ? "  ✓ 2 serviços no ar (19s) · API saudável (4s)" : "  ✓ starting the 2 services (19s) · API healthy (4s)" },
    { cls: "t-step", text: pt ? "Instalação concluída em 1m11s 🎉" : "Install finished in 1m11s 🎉" },
    { cls: "t-box2", text: "Interface   http://localhost:8000\nAPI         http://localhost:8000/health\nMCP         http://localhost:8000/mcp\n" + (pt ? "Projetos    " : "Projects    ") + "~/Documents/AtlasFileProjects" },
    { cls: "t-ok-line", text: pt ? "  🔑 API key (cole em Configuração → Acesso): atlas_sk_••••••••" : "  🔑 API key (paste it in Settings → Access): atlas_sk_••••••••" },
  ];
}

function frame(bodyHtml) {
  return `<div class="term-bar"><span></span><span></span><span></span><em class="mono">atlasfile — bash</em></div><pre class="term-body mono">${bodyHtml}</pre>`;
}

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function finalHtml(lang) {
  const lines = scriptLines(lang).map((l) => `<span class="${l.cls}">${esc(l.text)}</span>`).join("\n");
  return `<span class="t-prompt">$</span> ${esc(CMD)}\n${lines}\n<span class="t-prompt">$</span> <span class="t-caret"></span>`;
}

export function initTerminal(el, { instant = false } = {}) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    || new URLSearchParams(location.search).has("progress")
    || new URLSearchParams(location.search).get("motion") === "reduce";

  const render = () => { el.innerHTML = frame(finalHtml(currentLang())); };

  if (instant || reduced) {
    render();
    // trocar idioma re-renderiza o estado final no idioma novo
    document.addEventListener("atlasfile:langchange", render);
    return { rerender: render };
  }

  let played = false;
  const io = new IntersectionObserver((entries) => {
    if (!entries[0]?.isIntersecting || played) return;
    played = true;
    io.disconnect();
    play(el);
  }, { threshold: 0.4 });
  io.observe(el);

  // placeholder até tocar; após tocar, troca de idioma re-renderiza o final
  el.innerHTML = frame(`<span class="t-prompt">$</span> <span class="t-caret"></span>`);
  document.addEventListener("atlasfile:langchange", () => { if (played) render(); });
  return { rerender: () => { if (played) render(); } };

  function play(target) {
    const lang = currentLang();
    let body = `<span class="t-prompt">$</span> `;
    let i = 0;
    const typeCmd = () => {
      if (i < CMD.length) {
        // jitter de velocidade: às vezes digita 2 chars — imprimindo AMBOS
        const step = Math.random() < 0.25 ? 2 : 1;
        body += esc(CMD.slice(i, i + step));
        target.innerHTML = frame(body + `<span class="t-caret"></span>`);
        i += step;
        setTimeout(typeCmd, 22 + Math.random() * 40);
      } else {
        body += "\n";
        setTimeout(() => runLines(0), 420);
      }
    };
    const lines = scriptLines(lang);
    const runLines = (n) => {
      if (n >= lines.length) {
        body += `<span class="t-prompt">$</span> <span class="t-caret"></span>`;
        target.innerHTML = frame(body);
        return;
      }
      const l = lines[n];
      body += `<span class="${l.cls}">${esc(l.text)}</span>\n`;
      target.innerHTML = frame(body + `<span class="t-caret"></span>`);
      const isBox = l.cls === "t-box2";  // era "t-box", classe inexistente: o timing rápido nunca era aplicado
      setTimeout(() => runLines(n + 1), isBox ? 70 : 260 + Math.random() * 320);
    };
    typeCmd();
  }
}

export { CMD };

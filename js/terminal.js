/* Terminal fake: digita o one-liner real e imprime o output fiel do
   install.sh (caixinha ╭─╮ com os endereços). Estado final instantâneo em
   reduced-motion ou ?progress. */

import { currentLang } from "./i18n.js";

const CMD = "curl -fsSL https://raw.githubusercontent.com/aleonnet/atlasfile/main/install.sh | bash";

// A caixinha final é UM bloco com borda CSS: Fragment Mono não tem glifos
// box-drawing (╭│) — cairiam em fonte fallback com largura diferente e as
// bordas desalinhariam.
function scriptLines(lang) {
  const pt = lang === "pt";
  return [
    { cls: "t-step", text: pt ? "[1/5] Verificando pré-requisitos" : "[1/5] Checking prerequisites" },
    { cls: "t-ok-line", text: pt ? "  ✓ docker · git · portas livres" : "  ✓ docker · git · ports free" },
    { cls: "t-step", text: pt ? "[2/5] Clonando aleonnet/atlasfile" : "[2/5] Cloning aleonnet/atlasfile" },
    { cls: "t-step", text: pt ? "[3/5] Configurando" : "[3/5] Configuring" },
    { cls: "t-ok-line", text: pt ? "  ✓ .env criado — projetos em ~/Documents/AtlasFileProjects" : "  ✓ .env created — projects in ~/Documents/AtlasFileProjects" },
    { cls: "t-step", text: pt ? "[4/5] Construindo e subindo a stack" : "[4/5] Building and starting the stack" },
    { cls: "t-ok-line", text: pt ? "  ✓ 5 serviços no ar · API saudável" : "  ✓ 5 services up · API healthy" },
    { cls: "t-step", text: pt ? "[5/5] Instalação concluída em 58s 🎉" : "[5/5] Installed in 58s 🎉" },
    { cls: "t-box2", text: "Interface   http://localhost:5173\nAPI         http://localhost:8000/health\n" + (pt ? "Projetos    " : "Projects    ") + "~/Documents/AtlasFileProjects" },
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
        body += esc(CMD[i]);
        target.innerHTML = frame(body + `<span class="t-caret"></span>`);
        i += 1 + (Math.random() < 0.25 ? 1 : 0); // jitter: às vezes 2 chars
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
      const isBox = l.cls === "t-box";
      setTimeout(() => runLines(n + 1), isBox ? 70 : 260 + Math.random() * 320);
    };
    typeCmd();
  }
}

export { CMD };

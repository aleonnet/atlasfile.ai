/* i18n vanilla: EN canônico no HTML + dicionário duplo aplicado via data-i18n.
   Persistência em localStorage; primeira visita segue navigator.language;
   ?lang=pt|en é hook de teste/link compartilhável. */

const KEY = "atlasfile.lang";

const STRINGS = {
  en: {
    "meta.title.landing": "AtlasFile — Gravity, organized. Local-first document intelligence",
    "meta.title.install": "Install AtlasFile — one command, sixty seconds",
    "nav.skip": "Skip to content",
    "nav.features": "Features",
    "nav.install": "Install",
    "nav.themeToggle": "Toggle theme",

    "hero.eyebrow": "Local-first document intelligence",
    "hero.title1": "Your documents",
    "hero.title2": "have gravity.",
    "hero.lead": "Drop files anywhere. AtlasFile pulls them into orbit — extracted, classified, indexed and searchable. All on your machine.",
    "hero.ctaInstall": "Install in 60 seconds",
    "hero.ctaGithub": "Star on GitHub",
    "hero.scrollLabel": "roll the mouse",
    "hero.scrollCue": "Scroll to content",
    "chaos.caption": "Every messy folder ends the same way. Unless something pulls back.",

    "catalog.eyebrow": "On the other side of the horizon",
    "catalog.title": "From chaos to catalog.",
    "catalog.lead": "The same files — deduplicated by SHA-256, text-extracted (OCR included), classified by business domain and document type, renamed canonically and filed where they belong.",
    "catalog.treeAria": "Organized folder tree showing files classified into legal, corporate, finance and operations",
    "catalog.note": "low confidence? → human triage queue → every decision trains the classifier",

    "features.eyebrow": "The physics engine",
    "features.title": "Everything a document pipeline should be.",
    "features.search.title": "Hybrid search with citations",
    "features.search.body": "BM25 + vector kNN fused with RRF, optional cross-encoder rerank. Ask in one language, find documents in another — answers cite page, sheet and paragraph.",
    "features.assistant.title": "Assistant that knows your project",
    "features.assistant.body": "Chat scoped to each project's corpus: clickable citations, inline charts (8 types), SQL over your spreadsheets, cost tracking. OpenAI or Anthropic — your key, your machine.",
    "features.classifier.title": "A classifier that learns from you",
    "features.classifier.body": "Three modes — rules, TF-IDF, LLM — benchmarked against each other on your own decisions. Every triage click becomes training data. The champion earns the job.",
    "features.local.title": "Local-first, bilingual, yours",
    "features.local.body": "Five Docker services on your hardware. 25+ file formats with OCR. Full PT-BR / EN-US interface with live switching. No cloud, no telemetry, no lock-in.",

    "cta.eyebrow": "Cross the horizon",
    "cta.title": "One command. Sixty seconds.",
    "cta.lead": "The installer clones, configures, builds and boots the whole stack — then opens the interface for you.",
    "cta.termAria": "Terminal running the AtlasFile installer",
    "cta.btn": "Full install guide →",
    "cta.copy": "copy",
    "cta.copied": "copied ✓",

    "footer.tagline": "Gravity, organized.",
    "footer.credit": "black hole physics after Bruneton, via ghostty-blackhole (MIT)",

    "install.eyebrow": "Installation",
    "install.title": "Cross the event horizon.",
    "install.lead": "One command clones the repo, configures the environment, builds five Docker services and opens the interface. Idempotent: run it again anytime to update.",
    "install.req.title": "Before you start",
    "install.req.body.mac": "You need <a href=\"https://docs.docker.com/desktop/setup/install/mac-install/\" rel=\"noopener\">Docker Desktop</a> (macOS) or <a href=\"https://docs.docker.com/engine/install/\" rel=\"noopener\">Docker Engine + Compose</a> (Linux) running, <a href=\"https://git-scm.com/downloads\" rel=\"noopener\">git</a>, and ~4 GB free for images.",
    "install.req.body.win": "You need <a href=\"https://docs.docker.com/desktop/setup/install/windows-install/\" rel=\"noopener\">Docker Desktop</a> running with the <a href=\"https://learn.microsoft.com/windows/wsl/install\" rel=\"noopener\">WSL2 backend</a>, and ~4 GB free for images. The installer runs in PowerShell.",
    "install.step1.title": "Run the installer",
    "install.step1.body.mac": "The script asks where your project files should live (default: <code>~/Documents/AtlasFileProjects</code>) and takes it from there.",
    "install.step1.body.win": "The script asks where your project files should live (default: <code>Documents\\AtlasFileProjects</code> in your user profile) and takes it from there.",
    "install.tab.mac": "macOS / Linux",
    "install.tab.win": "Windows (PowerShell)",
    "install.step2.title": "Watch it boot",
    "install.step2.body": "Tests run, images build, services come up, the API reports healthy — and the installer prints your addresses:",
    "install.step3.title": "Optional flags",
    "install.flags.dir": "install location (default ~/AtlasFile)",
    "install.flags.projects": "where your documents live",
    "install.flags.auth": "generate an API key and require it",
    "install.flags.yes": "non-interactive (accept defaults)",
    "install.step4.title": "First steps",
    "install.step4.body": "The interface opens at localhost:5173 with an onboarding wizard: create your first project, optionally add an OpenAI/Anthropic key for the assistant, then drop files anywhere on the screen.",
    "install.trouble.title": "Troubleshooting",
    "install.trouble.docker.q": "“Cannot connect to the Docker daemon”",
    "install.trouble.docker.a": "Docker Desktop isn't running. Start it and re-run the installer — it resumes where it left off.",
    "install.trouble.ports.q": "Port 5173 or 8000 already in use",
    "install.trouble.ports.a": "Another stack is bound to those ports. Stop it, or install to a second instance with --dir and a different name.",
    "install.trouble.update.q": "How do I update?",
    "install.trouble.update.a": "Re-run the same one-liner. It pulls the latest main, rebuilds and restarts — your projects and data are preserved.",
    "install.back": "← back to the black hole",
  },

  pt: {
    "meta.title.landing": "AtlasFile — Gravidade, organizada. Inteligência documental local",
    "meta.title.install": "Instalar o AtlasFile — um comando, sessenta segundos",
    "nav.skip": "Pular para o conteúdo",
    "nav.features": "Recursos",
    "nav.install": "Instalar",
    "nav.themeToggle": "Alternar tema",

    "hero.eyebrow": "Inteligência documental local-first",
    "hero.title1": "Seus documentos",
    "hero.title2": "têm gravidade.",
    "hero.lead": "Solte arquivos em qualquer lugar. O AtlasFile os puxa para a órbita — extraídos, classificados, indexados e pesquisáveis. Tudo na sua máquina.",
    "hero.ctaInstall": "Instale em 60 segundos",
    "hero.ctaGithub": "Estrela no GitHub",
    "hero.scrollLabel": "role o mouse",
    "hero.scrollCue": "Rolar para o conteúdo",
    "chaos.caption": "Toda pasta bagunçada termina do mesmo jeito. A menos que algo puxe de volta.",

    "catalog.eyebrow": "Do outro lado do horizonte",
    "catalog.title": "Do caos ao catálogo.",
    "catalog.lead": "Os mesmos arquivos — deduplicados por SHA-256, com texto extraído (OCR incluso), classificados por domínio de negócio e tipo documental, renomeados canonicamente e arquivados no lugar certo.",
    "catalog.treeAria": "Árvore de pastas organizada mostrando arquivos classificados em jurídico, societário, financeiro e operações",
    "catalog.note": "confiança baixa? → fila de triagem humana → cada decisão treina o classificador",

    "features.eyebrow": "O motor de física",
    "features.title": "Tudo que um pipeline documental deveria ser.",
    "features.search.title": "Busca híbrida com citações",
    "features.search.body": "BM25 + kNN vetorial fundidos com RRF, rerank opcional por cross-encoder. Pergunte num idioma, encontre documentos em outro — as respostas citam página, planilha e parágrafo.",
    "features.assistant.title": "Assistente que conhece seu projeto",
    "features.assistant.body": "Chat com escopo por projeto: citações clicáveis, gráficos inline (8 tipos), SQL sobre suas planilhas, rastreamento de custo. OpenAI ou Anthropic — sua chave, sua máquina.",
    "features.classifier.title": "Um classificador que aprende com você",
    "features.classifier.body": "Três modos — regras, TF-IDF, LLM — em benchmark uns contra os outros sobre as SUAS decisões. Cada clique de triagem vira dado de treino. O campeão assume o posto.",
    "features.local.title": "Local-first, bilíngue, seu",
    "features.local.body": "Cinco serviços Docker no seu hardware. 25+ formatos de arquivo com OCR. Interface completa PT-BR / EN-US com troca ao vivo. Sem nuvem, sem telemetria, sem lock-in.",

    "cta.eyebrow": "Cruze o horizonte",
    "cta.title": "Um comando. Sessenta segundos.",
    "cta.lead": "O instalador clona, configura, builda e sobe a stack inteira — e abre a interface para você.",
    "cta.termAria": "Terminal executando o instalador do AtlasFile",
    "cta.btn": "Guia completo de instalação →",
    "cta.copy": "copiar",
    "cta.copied": "copiado ✓",

    "footer.tagline": "Gravidade, organizada.",
    "footer.credit": "física do buraco negro segundo Bruneton, via ghostty-blackhole (MIT)",

    "install.eyebrow": "Instalação",
    "install.title": "Cruze o horizonte de eventos.",
    "install.lead": "Um comando clona o repo, configura o ambiente, builda cinco serviços Docker e abre a interface. Idempotente: rode de novo quando quiser atualizar.",
    "install.req.title": "Antes de começar",
    "install.req.body.mac": "Você precisa do <a href=\"https://docs.docker.com/desktop/setup/install/mac-install/\" rel=\"noopener\">Docker Desktop</a> (macOS) ou <a href=\"https://docs.docker.com/engine/install/\" rel=\"noopener\">Docker Engine + Compose</a> (Linux) rodando, <a href=\"https://git-scm.com/downloads\" rel=\"noopener\">git</a>, e ~4 GB livres para as imagens.",
    "install.req.body.win": "Você precisa do <a href=\"https://docs.docker.com/desktop/setup/install/windows-install/\" rel=\"noopener\">Docker Desktop</a> rodando com o <a href=\"https://learn.microsoft.com/pt-br/windows/wsl/install\" rel=\"noopener\">backend WSL2</a>, e ~4 GB livres para as imagens. O instalador roda no PowerShell.",
    "install.step1.title": "Rode o instalador",
    "install.step1.body.mac": "O script pergunta onde seus arquivos de projeto devem morar (padrão: <code>~/Documents/AtlasFileProjects</code>) e cuida do resto.",
    "install.step1.body.win": "O script pergunta onde seus arquivos de projeto devem morar (padrão: <code>Documentos\\AtlasFileProjects</code> no seu perfil de usuário) e cuida do resto.",
    "install.tab.mac": "macOS / Linux",
    "install.tab.win": "Windows (PowerShell)",
    "install.step2.title": "Veja a stack subir",
    "install.step2.body": "Os testes rodam, as imagens buildam, os serviços sobem, a API reporta saudável — e o instalador imprime seus endereços:",
    "install.step3.title": "Flags opcionais",
    "install.flags.dir": "local da instalação (padrão ~/AtlasFile)",
    "install.flags.projects": "onde seus documentos moram",
    "install.flags.auth": "gera uma API key e a exige",
    "install.flags.yes": "não-interativo (aceita os padrões)",
    "install.step4.title": "Primeiros passos",
    "install.step4.body": "A interface abre em localhost:5173 com um wizard de onboarding: crie seu primeiro projeto, adicione (opcional) uma chave OpenAI/Anthropic para o assistente, e solte arquivos em qualquer lugar da tela.",
    "install.trouble.title": "Solução de problemas",
    "install.trouble.docker.q": "“Cannot connect to the Docker daemon”",
    "install.trouble.docker.a": "O Docker Desktop não está rodando. Inicie-o e rode o instalador de novo — ele retoma de onde parou.",
    "install.trouble.ports.q": "Porta 5173 ou 8000 já em uso",
    "install.trouble.ports.a": "Outra stack ocupa essas portas. Pare-a, ou instale uma segunda instância com --dir e outro nome.",
    "install.trouble.update.q": "Como atualizo?",
    "install.trouble.update.a": "Rode o mesmo one-liner de novo. Ele puxa o main mais recente, rebuilda e reinicia — seus projetos e dados são preservados.",
    "install.back": "← voltar ao buraco negro",
  },
};

let lang = "en";

export function currentLang() { return lang; }
export function t(key) { return STRINGS[lang][key] ?? STRINGS.en[key] ?? key; }

export function applyLang(next) {
  lang = next === "pt" ? "pt" : "en";
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  // Strings 100% nossas com markup embutido (links/código) — nunca input externo
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attr, key] = pair.split(":");
      if (attr && key) el.setAttribute(attr.trim(), t(key.trim()));
    });
  });

  const page = document.documentElement.dataset.page === "install" ? "install" : "landing";
  document.title = t(`meta.title.${page}`);

  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.textContent = lang === "pt" ? "EN" : "PT";
    langBtn.setAttribute("aria-pressed", String(lang === "pt"));
    langBtn.title = lang === "pt" ? "English (US)" : "Português (Brasil)";
  }

  // conteúdo renderizado por JS (ex.: terminal) escuta e se re-renderiza
  document.dispatchEvent(new CustomEvent("atlasfile:langchange"));
}

export function initI18n() {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "pt" || q === "en") localStorage.setItem(KEY, q);
  const saved = localStorage.getItem(KEY);
  const first = saved || (navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en");
  applyLang(first);

  document.getElementById("lang-toggle")?.addEventListener("click", () => {
    const next = lang === "pt" ? "en" : "pt";
    localStorage.setItem(KEY, next);
    applyLang(next);
  });
}

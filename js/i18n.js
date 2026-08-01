/* i18n vanilla: EN canônico no HTML + dicionário duplo aplicado via data-i18n.
   Persistência em localStorage; primeira visita segue navigator.language;
   ?lang=pt|en é hook de teste/link compartilhável. */

const KEY = "atlasfile.lang";

const STRINGS = {
  en: {
    "meta.title.landing": "AtlasFile — Gravity, organized. Local-first document intelligence",
    "meta.title.install": "Install AtlasFile — one command, your machine",
    "nav.skip": "Skip to content",
    "nav.features": "Features",
    "nav.install": "Install",
    "nav.themeToggle": "Toggle theme",

    "hero.eyebrow": "Local-first document intelligence",
    "hero.title1": "Your documents",
    "hero.title2": "have gravity.",
    "hero.lead": "Drop files anywhere. AtlasFile pulls them into orbit — extracted, classified, indexed and searchable. All on your machine.",
    "hero.ctaInstall": "Install AtlasFile",
    "hero.ctaGithub": "Star on GitHub",
    "hero.scrollLabel": "roll the mouse",
    "hero.scrollCue": "Scroll to content",
    "chaos.caption": "Every messy folder ends the same way. Unless something pulls back.",

    "catalog.eyebrow": "On the other side of the horizon",
    "catalog.title": "From chaos to catalog.",
    "catalog.lead": "The same files — deduplicated by SHA-256, text-extracted (OCR included), classified by business domain and document type, renamed canonically and filed where they belong.",
    "catalog.treeAria": "Organized folder tree showing files classified into legal, corporate, finance and operations",
    "catalog.note": "low confidence? → human triage queue → every decision trains the classifier",

    "hiw.eyebrow": "Real product, real footage",
    "hiw.title": "How it works.",
    "hiw.lead": "Four moments from an actual AtlasFile session — no mockups, no editing tricks. Drop, decide, find, ask.",
    "hiw.s1.kicker": "01 · Drop",
    "hiw.s1.title": "Drop files anywhere",
    "hiw.s1.body": "Drag files onto any screen and a gravity portal opens. The inbox is processed automatically: deduplication, text extraction and classification — the sidebar orb turns into a black hole while documents are being pulled in.",
    "hiw.s1.aria": "Screen recording: files dragged into AtlasFile open a portal and are processed into the triage queue",
    "hiw.s2.kicker": "02 · Decide",
    "hiw.s2.title": "Approve in one click",
    "hiw.s2.body": "Low-confidence documents wait in the triage queue with the classifier's suggestion and scores. One click approves, corrects or rejects — and every decision becomes training data.",
    "hiw.s2.aria": "Screen recording: a document in the triage queue is approved and indexed",
    "hiw.s3.kicker": "03 · Find",
    "hiw.s3.title": "Search from anywhere with ⌘K",
    "hiw.s3.body": "The command palette searches your whole corpus as you type — hybrid BM25 + vector search with highlighted evidence, scoped to the active project.",
    "hiw.s3.aria": "Screen recording: the command palette finds documents with highlighted snippets as the query is typed",
    "hiw.s4.kicker": "04 · Ask",
    "hiw.s4.title": "Ask the assistant",
    "hiw.s4.body": "Chat scoped to the project's documents. Answers come with clickable citations pointing at the exact source — page, sheet or paragraph.",
    "hiw.s4.aria": "Screen recording: the assistant answers a question with a citation to the source document",

    "features.eyebrow": "The physics engine",
    "features.title": "Everything a document pipeline should be.",
    "features.search.title": "Hybrid search with citations",
    "features.search.body": "BM25 + vector kNN fused with RRF, optional cross-encoder rerank. Ask in one language, find documents in another — answers cite page, sheet and paragraph.",
    "features.assistant.title": "Assistant that knows your project",
    "features.assistant.body": "Chat scoped to each project's corpus: clickable citations, inline charts (8 types), SQL over your spreadsheets, cost tracking. OpenAI, Anthropic or Moonshot (Kimi) — your key, your machine — or 100% local with Ollama, no key at all.",
    "features.classifier.title": "A classifier that learns from you",
    "features.classifier.body": "Three modes — rules, TF-IDF, LLM — benchmarked against each other on your own decisions. Every triage click becomes training data. The champion earns the job. Corrections also mine new vocabulary, suggested as taxonomy aliases for your approval.",
    "features.local.title": "Local-first, bilingual, yours",
    "features.local.body": "Two Docker services on your hardware, straight from a published image. 25+ file formats with OCR. Full PT-BR / EN-US interface with live switching. No cloud, no telemetry, no lock-in.",

    "cta.eyebrow": "Cross the horizon",
    "cta.title": "One command. Your machine.",
    "cta.lead": "The installer downloads the release, verifies it, pulls the published image and boots the stack — then opens the interface for you.",
    "cta.termAria": "Terminal running the AtlasFile installer",
    "cta.btn": "Full install guide →",
    "cta.copy": "copy",
    "cta.copied": "copied ✓",

    "footer.tagline": "Gravity, organized.",
    "footer.credit": "black hole physics after Bruneton, via ghostty-blackhole (MIT)",

    "install.eyebrow": "Installation",
    "install.title": "Cross the event horizon.",
    "install.lead": "One command installs the latest release: the bundle is downloaded and SHA256-verified, the published image is pulled — no compiler, no git — and the interface opens. Idempotent: run it again anytime to update.",
    "install.step1.title": "Run the installer",
    "install.step1.body.mac": "No prerequisites to prepare: the script detects what is missing (Docker) and offers to install it for you — git is only needed on the contributor path. It asks where your project files should live (default: <code>~/Documents/AtlasFileProjects</code>) and takes it from there.",
    "install.step1.body.win": "No prerequisites to prepare: the script offers to set up WSL2 and Docker Desktop (via winget) if they are missing. AtlasFile itself lives inside WSL, but your documents stay on the Windows disk (default: <code>Documents\\AtlasFileProjects</code>), visible in Explorer like any other folder.",
    "install.tab.mac": "macOS / Linux",
    "install.tab.win": "Windows (PowerShell)",
    "install.step2.title": "Watch it boot",
    "install.step2.body": "The release bundle is verified, the published image is pulled, the two services come up, the API reports healthy — and the installer prints your addresses and API key:",
    "install.step3.title": "Optional flags",
    "install.flags.dir": "install location (default ~/AtlasFile)",
    "install.flags.projects": "where your documents live",
    "install.flags.auth": "generate an API key and require it",
    "install.flags.yes": "non-interactive (accept defaults)",
    "install.flags.installdeps": "install missing prerequisites without prompting (Docker and git; on Windows, WSL2 and Docker Desktop)",
    "install.flags.port": "host port for the interface/API (default 8000; saved to the .env as ATLASFILE_PORT)",
    "install.flags.version": "pin a release instead of the latest one (not combined with --from-source: Windows refuses the pair, bash ignores the pin)",
    "install.flags.fromsource": "contributor path: clone the repository and build locally (--repo-url and --branch only apply here)",
    "install.flags.noopen": "do not open the browser at the end",
    "install.step4.title": "First steps",
    "install.step4.body": "The interface opens at localhost:8000 with an onboarding wizard — paste the API key the installer printed (Settings → Access), create your first project, optionally add an OpenAI/Anthropic/Moonshot key for the assistant (validated live). Want a 100% local model instead? Install Ollama afterwards, pull a model and point the assistant at it — the final panel shows the exact command. Then drop files anywhere on the screen.",
    "install.flags.revert": "Every reverting flag shows its plan and asks before touching anything — and your documents are never deleted. Uninstall is one command too:",
    "install.step5.dryrun": "show, don't do — what an install (or an uninstall) would change",
    "install.step5.doctor": "read-only report of this machine; on Windows it covers both sides, Windows and WSL",
    "install.step5.uninstall": "removal plan first, confirmation before executing; what already existed on the machine is preserved",
    "install.step5.keepdata": "uninstall: keep the search index (a future reinstall reuses it)",
    "install.step5.purgedata": "uninstall: also erase the search index — your documents are untouched either way",
    "install.step5.removedeps": "also revert the dependencies the installer itself installed",
    "install.flags.dashboards": "optional observability dashboard, off by default — opens at :5601 (DASHBOARDS_PORT remaps it)",
    "install.flags.nodashboards": "turns the dashboard back off and removes its container",
    "install.tab.aria": "Platform",
    "install.trouble.title": "Troubleshooting",
    "install.trouble.docker.q": "“Cannot connect to the Docker daemon”",
    "install.trouble.docker.a": "The installer now starts Docker for you and waits for the daemon. If it still fails, open Docker Desktop once (first-launch dialog) and re-run — it resumes where it left off.",
    "install.trouble.ports.q": "Port 8000 or 9200 already in use",
    "install.trouble.ports.a": "The installer detects the conflict before touching anything. Free the port, or install on another one: re-run with --port N (the .env keys are ATLASFILE_PORT and OPENSEARCH_PORT). Container names are fixed, so a second stack on the same machine needs the first one stopped.",
    "install.trouble.update.q": "How do I update?",
    "install.trouble.update.a": "Re-run the same one-liner. It updates the install to the latest release and restarts — your projects and data are preserved. Installs made by clone stay on the clone path.",
    "install.trouble.deleted.q": "I deleted my projects folder",
    "install.trouble.deleted.a": "The app detects it and offers one-click recovery: it restarts itself, Docker recreates the folder and the orphaned index is cleaned — no manual commands.",
    "install.back": "← back to the black hole",
  },

  pt: {
    "meta.title.landing": "AtlasFile — Gravidade, organizada. Inteligência documental local",
    "meta.title.install": "Instalar o AtlasFile — um comando, sua máquina",
    "nav.skip": "Pular para o conteúdo",
    "nav.features": "Recursos",
    "nav.install": "Instalar",
    "nav.themeToggle": "Alternar tema",

    "hero.eyebrow": "Inteligência documental local-first",
    "hero.title1": "Seus documentos",
    "hero.title2": "têm gravidade.",
    "hero.lead": "Solte arquivos em qualquer lugar. O AtlasFile os puxa para a órbita — extraídos, classificados, indexados e pesquisáveis. Tudo na sua máquina.",
    "hero.ctaInstall": "Instalar o AtlasFile",
    "hero.ctaGithub": "Estrela no GitHub",
    "hero.scrollLabel": "role o mouse",
    "hero.scrollCue": "Rolar para o conteúdo",
    "chaos.caption": "Toda pasta bagunçada termina do mesmo jeito. A menos que algo puxe de volta.",

    "catalog.eyebrow": "Do outro lado do horizonte",
    "catalog.title": "Do caos ao catálogo.",
    "catalog.lead": "Os mesmos arquivos — deduplicados por SHA-256, com texto extraído (OCR incluso), classificados por domínio de negócio e tipo documental, renomeados canonicamente e arquivados no lugar certo.",
    "catalog.treeAria": "Árvore de pastas organizada mostrando arquivos classificados em jurídico, societário, financeiro e operações",
    "catalog.note": "confiança baixa? → fila de triagem humana → cada decisão treina o classificador",

    "hiw.eyebrow": "Produto real, gravação real",
    "hiw.title": "Como funciona.",
    "hiw.lead": "Quatro momentos de uma sessão real do AtlasFile — sem mockups, sem truque de edição. Solte, decida, encontre, pergunte.",
    "hiw.s1.kicker": "01 · Solte",
    "hiw.s1.title": "Solte arquivos em qualquer tela",
    "hiw.s1.body": "Arraste arquivos para qualquer tela e um portal de gravidade se abre. O inbox é processado automaticamente: deduplicação, extração de texto e classificação — o orb da sidebar vira um buraco negro enquanto os documentos são puxados.",
    "hiw.s1.aria": "Gravação de tela: arquivos arrastados para o AtlasFile abrem um portal e são processados para a fila de triagem",
    "hiw.s2.kicker": "02 · Decida",
    "hiw.s2.title": "Aprove com um clique",
    "hiw.s2.body": "Documentos de baixa confiança esperam na fila de triagem com a sugestão e os scores do classificador. Um clique aprova, corrige ou rejeita — e cada decisão vira dado de treino.",
    "hiw.s2.aria": "Gravação de tela: um documento da fila de triagem é aprovado e indexado",
    "hiw.s3.kicker": "03 · Encontre",
    "hiw.s3.title": "Busque de qualquer lugar com ⌘K",
    "hiw.s3.body": "A paleta de comandos busca em todo o corpus enquanto você digita — busca híbrida BM25 + vetorial com evidências destacadas, no escopo do projeto ativo.",
    "hiw.s3.aria": "Gravação de tela: a paleta de comandos encontra documentos com trechos destacados enquanto a consulta é digitada",
    "hiw.s4.kicker": "04 · Pergunte",
    "hiw.s4.title": "Pergunte ao assistente",
    "hiw.s4.body": "Chat no escopo dos documentos do projeto. As respostas vêm com citações clicáveis apontando a fonte exata — página, planilha ou parágrafo.",
    "hiw.s4.aria": "Gravação de tela: o assistente responde a uma pergunta com citação do documento-fonte",

    "features.eyebrow": "O motor de física",
    "features.title": "Tudo que um pipeline documental deveria ser.",
    "features.search.title": "Busca híbrida com citações",
    "features.search.body": "BM25 + kNN vetorial fundidos com RRF, rerank opcional por cross-encoder. Pergunte num idioma, encontre documentos em outro — as respostas citam página, planilha e parágrafo.",
    "features.assistant.title": "Assistente que conhece seu projeto",
    "features.assistant.body": "Chat com escopo por projeto: citações clicáveis, gráficos inline (8 tipos), SQL sobre suas planilhas, rastreamento de custo. OpenAI, Anthropic ou Moonshot (Kimi) — sua chave, sua máquina — ou 100% local com Ollama, sem chave nenhuma.",
    "features.classifier.title": "Um classificador que aprende com você",
    "features.classifier.body": "Três modos — regras, TF-IDF, LLM — em benchmark uns contra os outros sobre as SUAS decisões. Cada clique de triagem vira dado de treino. O campeão assume o posto. As correções também mineram vocabulário novo, sugerido como alias da taxonomia para a sua aprovação.",
    "features.local.title": "Local-first, bilíngue, seu",
    "features.local.body": "Dois serviços Docker no seu hardware, direto de uma imagem publicada. 25+ formatos de arquivo com OCR. Interface completa PT-BR / EN-US com troca ao vivo. Sem nuvem, sem telemetria, sem lock-in.",

    "cta.eyebrow": "Cruze o horizonte",
    "cta.title": "Um comando. Sua máquina.",
    "cta.lead": "O instalador baixa a release, verifica, faz o pull da imagem publicada e sobe a stack — e abre a interface para você.",
    "cta.termAria": "Terminal executando o instalador do AtlasFile",
    "cta.btn": "Guia completo de instalação →",
    "cta.copy": "copiar",
    "cta.copied": "copiado ✓",

    "footer.tagline": "Gravidade, organizada.",
    "footer.credit": "física do buraco negro segundo Bruneton, via ghostty-blackhole (MIT)",

    "install.eyebrow": "Instalação",
    "install.title": "Cruze o horizonte de eventos.",
    "install.lead": "Um comando instala a última release: o bundle é baixado e verificado por SHA256, a imagem publicada vem por pull — sem compilador, sem git — e a interface abre. Idempotente: rode de novo quando quiser atualizar.",
    "install.step1.title": "Rode o instalador",
    "install.step1.body.mac": "Sem pré-requisitos para preparar: o script detecta o que falta (Docker) e oferece instalar para você — git só é necessário no caminho de contribuidor. O script pergunta onde seus arquivos de projeto devem morar (padrão: <code>~/Documents/AtlasFileProjects</code>) e cuida do resto.",
    "install.step1.body.win": "Sem pré-requisitos para preparar: o script oferece configurar o WSL2 e o Docker Desktop (via winget) se estiverem faltando. O AtlasFile mora dentro do WSL, mas seus documentos ficam no disco do Windows (padrão: <code>Documentos\\AtlasFileProjects</code>), visíveis no Explorer como qualquer outra pasta.",
    "install.tab.mac": "macOS / Linux",
    "install.tab.win": "Windows (PowerShell)",
    "install.step2.title": "Veja a stack subir",
    "install.step2.body": "O bundle da release é verificado, a imagem publicada vem por pull, os dois serviços sobem, a API reporta saudável — e o instalador imprime seus endereços e a API key:",
    "install.step3.title": "Flags opcionais",
    "install.flags.dir": "local da instalação (padrão ~/AtlasFile)",
    "install.flags.projects": "onde seus documentos moram",
    "install.flags.auth": "gera uma API key e a exige",
    "install.flags.yes": "não-interativo (aceita os padrões)",
    "install.flags.installdeps": "instala pré-requisitos que faltarem sem perguntar (Docker e git; no Windows, WSL2 e Docker Desktop)",
    "install.flags.port": "porta de host da interface/API (padrão 8000; gravada no .env como ATLASFILE_PORT)",
    "install.flags.version": "pina uma release em vez da última (não combina com --from-source: o Windows recusa o par, o bash ignora o pino)",
    "install.flags.fromsource": "caminho de contribuidor: clona o repositório e builda localmente (--repo-url e --branch valem só aqui)",
    "install.flags.noopen": "não abre o browser no final",
    "install.step4.title": "Primeiros passos",
    "install.step4.body": "A interface abre em localhost:8000 com um wizard de onboarding — cole a API key que o instalador imprimiu (Configuração → Acesso), crie seu primeiro projeto, adicione (opcional) uma chave OpenAI/Anthropic/Moonshot para o assistente (validada ao vivo). Quer um modelo 100% local? Instale o Ollama depois, puxe um modelo e aponte o assistente para ele — o painel final mostra o comando exato. Então solte arquivos em qualquer lugar da tela.",
    "install.flags.revert": "Toda flag de reversão mostra o plano e pergunta antes de tocar em qualquer coisa — e seus documentos nunca são apagados. Desinstalar também é um comando só:",
    "install.step5.dryrun": "mostre, não faça — o que uma instalação (ou desinstalação) mudaria",
    "install.step5.doctor": "relatório somente-leitura desta máquina; no Windows cobre os dois lados, Windows e WSL",
    "install.step5.uninstall": "plano de remoção primeiro, confirmação antes de executar; o que já existia na máquina é preservado",
    "install.step5.keepdata": "desinstalar: mantém o índice de busca (uma reinstalação futura o reaproveita)",
    "install.step5.purgedata": "desinstalar: apaga também o índice de busca — seus documentos ficam intocados de qualquer jeito",
    "install.step5.removedeps": "reverte também as dependências que o próprio instalador instalou",
    "install.flags.dashboards": "dashboard de observabilidade opcional, desligado por padrão — abre em :5601 (DASHBOARDS_PORT remapeia)",
    "install.flags.nodashboards": "desliga o dashboard de volta e remove o container dele",
    "install.tab.aria": "Plataforma",
    "install.trouble.title": "Solução de problemas",
    "install.trouble.docker.q": "“Cannot connect to the Docker daemon”",
    "install.trouble.docker.a": "O instalador agora inicia o Docker por você e espera o daemon. Se ainda falhar, abra o Docker Desktop uma vez (diálogo de primeiro uso) e rode de novo — ele retoma de onde parou.",
    "install.trouble.ports.q": "Porta 8000 ou 9200 já em uso",
    "install.trouble.ports.a": "O instalador detecta o conflito antes de tocar em qualquer coisa. Libere a porta, ou instale em outra: rode de novo com --port N (as chaves do .env são ATLASFILE_PORT e OPENSEARCH_PORT). Os nomes de container são fixos — uma segunda stack na mesma máquina exige parar a primeira.",
    "install.trouble.update.q": "Como atualizo?",
    "install.trouble.update.a": "Rode o mesmo one-liner de novo. Ele atualiza a instalação para a última release e reinicia — seus projetos e dados são preservados. Instalação feita por clone permanece no caminho de clone.",
    "install.trouble.deleted.q": "Excluí minha pasta de projetos",
    "install.trouble.deleted.a": "O app detecta e oferece recuperação em 1 clique: ele se reinicia, o Docker recria a pasta e o índice órfão é limpo — sem comandos manuais.",
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

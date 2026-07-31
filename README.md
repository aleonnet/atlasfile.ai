# atlasfile.ai — website

Landing scrollytelling + guia de instalação do [AtlasFile](https://github.com/aleonnet/atlasfile).
**Zero build**: HTML + CSS + ES modules artesanais. Push na `main` = deploy (GitHub Pages, branch `main`, pasta `/`).

O céu do hero roda o mesmo shader WebGL2 de buraco negro de Schwarzschild do produto
(port do [ghostty-blackhole](https://s13k.dev/blackhole/), MIT © s13k, sobre o modelo de Bruneton):
geodésicas nulas integradas por pixel, disco Shakura–Sunyaev, lente gravitacional sobre o starfield.

## Desenvolvimento

```bash
python3 -m http.server 8899   # ES modules não carregam via file://
# http://localhost:8899
```

Hooks de teste por querystring:

| Hook | Efeito |
|---|---|
| `?theme=light\|dark` | força tema (grava e aplica) |
| `?lang=pt\|en` | força idioma |
| `?progress=0..1` | congela a coreografia do scroll (screenshots determinísticos) |
| `?og=1` | composição limpa para gerar o card social |
| `?motion=reduce` | simula prefers-reduced-motion |
| `?debug=fps` | contador de FPS |

Validação visual de shader: **sempre** `chrome --headless=new` (GPU real) — renderizadores
de software mentem sobre compositing premultiplicado.

## Estrutura

- `index.html` — landing (5 atos: hero → caos puxado → catálogo → features → install CTA com tabs macOS/Linux × Windows)
- `install.html` — install-as-story (terminal animado, tabs macOS/Linux × Windows, flags em pares bash/PowerShell, flags de reversão no mesmo bloco + uninstall copiável, troubleshooting)
- `js/tabs.js` — tabs ARIA compartilhadas (escopadas por tablist; usadas pela home e pelo install)
- `js/shader.js` — GLSL portado 1:1 do produto (não editar a física aqui; a fonte é o repo do AtlasFile) + uniform `uZoom` de APRESENTAÇÃO (escala do raio no variant orb; física intacta)
- `js/blackhole.js` — runner WebGL2 + `bhCenter()` (os chips espiralam para o centro real do buraco)
- `js/i18n.js` — dicionário EN/PT completo (EN canônico no HTML)

## Checklist de migração para o domínio custom (atlasfile.ai)

1. Criar arquivo `CNAME` na raiz com `atlasfile.ai` (após configurar o DNS: A/AAAA ou ALIAS para GitHub Pages).
2. Trocar as URLs absolutas marcadas com `ABSOLUTE-URL` (grep pelo marcador): `og:image` em `index.html` e `install.html`, e o link da home em `404.html`.
3. Adicionar `<link rel="canonical">` nas 2 páginas e um `sitemap.xml`.
4. Settings → Pages → Enforce HTTPS.

Política permanente: **só URLs relativas** no site (gate: `grep -rn 'href="/\|src="/' *.html` vazio);
as únicas absolutas são as do checklist acima, todas marcadas com `ABSOLUTE-URL`.

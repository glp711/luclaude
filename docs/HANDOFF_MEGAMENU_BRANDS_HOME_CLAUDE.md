# Handoff: mega menu, marcas e nova home

Data: 2026-06-17
Commit base: `ec8739b` (Reformula navegacao, identidade da home e filtros do catalogo)
URL de producao: https://luperfumes.vercel.app
Marca publica: perfumes de ambiente decor

Este documento descreve a rodada de trabalho focada em reformular a navegacao
(mega menu grupo -> tipo -> marca), a primeira secao da home, e os filtros do
catalogo. Complementa `HANDOFF_COMPLETO_PARA_CLAUDE.md` (que continua valido).

## Contexto do pedido

O usuario pediu, com inspiracao em shopcarolrosa.com.br (so estrutura, nao copia),
um cabecalho com mega menu igual aos sites profissionais multimarca. A logica
exigida era:

- Grupo principal (ex.: Difusores)
- Tipo de produto (ex.: Difusor de Varetas)
- Marca (ex.: Via Aroma)
- URL final: `/produtos?categoria=difusor-de-varetas&marca=via-aroma`

A cliente LU validou a logica em audio de 2026-06-17 11h09:

> "Difusor de varetas — nao precisa colocar fragrancia, so o produto. Cliente
> clica em difusor de varetas → aparece as marcas que trabalham com difusor
> de varetas. Cliente clica em Via Aroma → vai pras difusores so da Via Aroma.
> Da mesma forma agua perfumada: clicou na abinha, vai aparecer somente as
> marcas que trabalham com agua perfumada."

A implementacao bate exatamente com a descricao da LU.

## Arquivos criados ou alterados nesta rodada

### Migration

- `supabase/migrations/0004_brands_and_groups.sql`
  - Cria tabela `brands` (11 marcas seedadas)
  - Adiciona `products.brand_id` (FK nullable)
  - Adiciona `categories.group_slug` e `categories.product_type_label`
  - Renomeia categorias existentes pros slugs do spec:
    - `difusores`     -> `difusor-de-varetas`     (grupo `difusores`)
    - `sabonetes`     -> `sabonete-liquido`       (grupo `sabonetes`)
    - `cremes`        -> `hidratantes`            (grupo `corpo-e-perfumaria`)
    - `home-spray`    (slug igual)                (grupo `aromatizacao`)
    - `agua-perfumada` (slug igual)               (grupo `aromatizacao`)
    - `kits`          (slug igual)                (grupo `presentes`)
  - Seed de 18 categorias novas (tipos do spec: sache, essencia, gesso, etc.)
  - Backfill: todos os 243 produtos -> `brand_id = dani-fernandes`
  - RLS: leitura publica + escrita admin
  - Idempotente (re-rodar nao quebra; usa `on conflict (slug) do update set ...`)

**Esta migration precisa ser rodada manualmente no Supabase Studio.** Sem ela:
- Filtro `?marca=...` no catalogo eh ignorado (coluna nao existe)
- `/marcas` retorna lista vazia (tabela nao existe)
- Mega menu nao quebra mas links de marca caem em empty state

Caminho: https://supabase.com/dashboard/project/phkpwvdbmeotyqchybch/sql/new

### Bibliotecas (config sem JSX)

- `src/lib/navigation.ts` (NOVO)
  - Fonte unica do mega menu
  - Tipos: `MenuGroup`, `MenuType`, `BrandLink`, `MenuFeature`, `NavItem`
  - Constantes exportadas:
    - `MENU_GROUPS` (6 grupos: Aromatizacao, Difusores, Sabonetes,
      Velas e Aromas, Corpo e Perfumaria, Maison Berger)
    - `NAV_ITEMS` (grupos + links diretos "Marcas" e "Ofertas")
    - `ALL_BRANDS` (11 marcas)
  - Funcao `getGroupBySlug(slug)`
  - Cada grupo tem um campo opcional `feature` (MenuFeature) para destaque
    na coluna lateral do painel do mega menu (imagem + CTA). Nenhum grupo
    tem feature definido por enquanto, mas a estrutura esta pronta.

- `src/lib/url.ts` (NOVO)
  - Helpers `buildProductsUrl({categoria, marca, busca, sort, page, ofertas})`
  - `buildProductsUrlWithout(filters, key)` para remover um filtro
  - `slugify(input)` utilitario
  - Tipo `CatalogFilters`
  - Todos os links que apontam pro catalogo passam por aqui

- `src/lib/home-content.ts` (NOVO)
  - Constantes `HERO`, `BENEFITS`, `CATEGORY_SHORTCUTS`
  - Edicao de textos da home sem mexer em componentes

### Header (todos NOVOS dentro de `src/components/Header/`)

- `Header.tsx` (server component)
  - 3 linhas: PromoBar / Brand+Busca+Icones / Nav com MegaMenu
  - Recebe `user` por prop (server-side)
  - Compoe componentes client (MegaMenu, MobileMenuDrawer, SearchInput)
    sem se tornar client

- `MegaMenu.tsx` (client)
  - Painel hover + foco + click
  - Bridge invisivel (altura 8px) evita fechamento ao mover cursor
    entre item da nav e painel
  - ESC fecha, click fora fecha
  - ARIA: aria-expanded, aria-haspopup, aria-controls
  - Ring de foco coral no focus-visible
  - Renderiza `feature` lateral quando definida no grupo
  - `lg:hidden`/`hidden lg:block` para nao competir com o drawer mobile

- `MobileMenuDrawer.tsx` (client)
  - Drawer lateral via `createPortal` (escapa do `backdrop-blur` do header
    que cria containing block para `position: fixed`)
  - Acordeao 3 niveis: Grupo -> Tipo -> Marcas
  - Apenas um grupo aberto + um tipo aberto por vez
  - Scroll lock no body, ESC, click no backdrop
  - Trigger button (hamburger) `lg:hidden`
  - Recebe `userArea` por prop (renderizado no rodape do drawer)

- `SearchInput.tsx` (client)
  - Form `role="search"`
  - Submit -> `router.push('/produtos?busca=...')` ou `/produtos` quando vazio
  - Pre-fill com `?busca=` atual via `useSearchParams`
  - Icone de lupa SVG inline

### Home (todos NOVOS dentro de `src/components/Home/`)

- `HeroBanner.tsx` (server)
  - 2 colunas: texto + imagem
  - Usa `next/image` com `priority` e `sizes`
  - Imagem default: `/founder/perfumesdeambientedecor-founder-diffuser.png`
  - Textos vem de `HERO` em `home-content.ts`
  - Focus-visible ring nos CTAs

- `BenefitsBar.tsx` (server)
  - Faixa de 4 beneficios em SVG inline (sem emoji)
  - Icones: shipping, secure, payment, support
  - Textos genericos vindos de `BENEFITS`

- `CategoryShortcuts.tsx` (server)
  - 7 atalhos de categoria em grid 2/3/7
  - Cada card aponta pra `/produtos?categoria=<slug>` via `buildProductsUrl`

### Paginas alteradas

- `src/app/(site)/layout.tsx`
  - Remove header inline (2 linhas)
  - Usa `<Header user={user} />`
  - Footer mantido (link de "Difusores" trocado pra slug novo
    `difusor-de-varetas`, link novo `/marcas`)

- `src/app/(site)/page.tsx`
  - Substitui hero antigo + grid de 6 categorias por
    `<HeroBanner />` + `<BenefitsBar />` + `<CategoryShortcuts />`
  - Mantem secoes "Novidades", "Por que perfumes de ambiente decor"
    e "Sobre a fundadora"
  - Texto da secao da fundadora trocado para "curadoria da marca"
    (era "LU" no original)

- `src/app/(site)/produtos/page.tsx`
  - Aceita filtros combinados: `categoria + marca + busca + sort + page + ofertas`
  - Mantem `?q=` como alias de compatibilidade (versoes anteriores do site
    usavam `?q=`; agora o canonical eh `?busca=`)
  - Sidebar mostra:
    - Form de busca (input com hidden inputs preservando filtros atuais)
    - Lista de marcas (vinda do banco, tabela `brands`, ordenada por position)
  - Chips removiveis independentes para cada filtro
  - Empty state contextual: se filtro de marca nao tem produtos, mostra
    "Estamos preparando o catalogo desta marca" (em vez de "Nada por aqui")
  - Titulo combina categoria + marca: "Agua Perfumada · M. Victoria"
  - Sidebar de categorias antiga foi removida (mega menu cobre isso)

- `src/app/(site)/marcas/page.tsx` (NOVO)
  - Lista todas as marcas ativas em grid 2/3/4
  - Cada card aponta pra `/produtos?marca=<slug>`

## Validacao executada

```
npm run typecheck    -> verde
npm run lint         -> verde
npm run build        -> 30/30 paginas geradas
git push origin main -> commit ec8739b
deploy automatico Vercel -> READY
```

Smoke test pos-deploy:

```
200  /
200  /produtos
200  /produtos?categoria=difusor-de-varetas
200  /produtos?marca=dani-fernandes
200  /produtos?categoria=agua-perfumada&marca=m-victoria
200  /produtos?busca=tenue
200  /marcas
```

## Decisoes importantes que NAO devem ser revertidas

1. **Identidade visual mantida**: paleta cream/coral/sage, Cormorant Garamond,
   Inter, ink dark. Spec do usuario disse "use identidade existente como base".

2. **Marcas sem produto nao quebram**: empty state explica "estamos preparando".
   Spec disse "nao inventar produtos".

3. **Reformulada APENAS a primeira secao da home**: hero + beneficios + atalhos.
   Mantive PILLARS ("Por que perfumes de ambiente decor") e "Sobre a fundadora"
   porque o spec pediu apenas a primeira secao.

4. **Slug `difusores` virou `difusor-de-varetas`**: parte da migration 0004.
   Os 243 produtos atuais (Refis de Difusor da Dani Fernandes) ficam classificados
   como "Difusor de Varetas". Re-classificar em "Refil para Difusor de Varetas"
   eh trabalho futuro caso necessario.

5. **Sem fragrancia como nivel de menu**: LU validou em audio que nao queria
   fragrancia no menu. So produto e marca.

6. **Slugs canonicos** dos filtros: `categoria`, `marca`, `busca`. O alias
   `?q=` continua aceito por compatibilidade.

## Pendencias que dependem do usuario

1. **CRITICO antes de qualquer demo**: rodar `0004_brands_and_groups.sql` no
   Supabase Studio. Sem isso, filtros de marca nao funcionam e `/marcas`
   retorna vazio. (E idempotente, pode rodar sem medo.)

2. Cadastrar produtos das outras 10 marcas conforme a loja for adquirindo.
   O admin atual nao tem campo `brand_id` no formulario de produto — vai
   precisar ser adicionado quando a LU comecar a comprar de outras marcas.
   Por enquanto da pra setar via SQL direto.

3. Comprar dominio proprio (sugerido: `perfumesdeambientedecor.com.br`).
   Quando comprar, atualizar:
   - Vercel Domains (vincular)
   - Variavel `NEXT_PUBLIC_SITE_URL` (Vercel + .env.local)
   - URLs no painel do Mercado Pago (webhook e back_urls)
   - Resend (verificar dominio para sair de `onboarding@resend.dev`)

4. Imagens institucionais para banner principal. O default usa a foto da
   fundadora com difusor. Se a LU enviar fotos novas, trocar `HERO.imageSrc`
   em `src/lib/home-content.ts`.

5. Texto/campanha para o destaque lateral (`MenuFeature`) do mega menu.
   Hoje nenhum grupo tem feature definida. Quando definir, edita o objeto
   `MENU_GROUPS[n].feature` em `src/lib/navigation.ts`.

## Como editar a navegacao no futuro

Tudo passa por `src/lib/navigation.ts`. Para adicionar uma marca nova num
tipo de produto, basta editar o array `brands` daquele `MenuType`. Para
adicionar um tipo de produto novo, criar uma entrada em `MENU_GROUPS[n].types`
e tambem rodar SQL adicional inserindo em `public.categories`.

Para adicionar um grupo novo na barra superior:
1. Adicionar entrada em `MENU_GROUPS`
2. Rodar SQL pro `categories.group_slug` correspondente
3. O `NAV_ITEMS` deriva automaticamente de `MENU_GROUPS`, nao precisa editar

## Estrutura final do mega menu (referencia)

```
Aromatizacao
  Agua Perfumada    -> M. Victoria, Kailash, Lenvie, Dani Fernandes, Doce Aroma, Chantree
  Home Spray        -> M. Victoria, Kailash, Lenvie, Dani Fernandes, Doce Aroma, Chantree
  Sache Perfumado   -> Kailash
  Essencia Concentrada -> Lenvie, M. Victoria, Bubas, Via Aroma
  Aroma para Carro  -> Maison Berger, Bubas
  Gesso Perfumado   -> Dani Fernandes, Doce Aroma, M. Victoria
  Monograma         -> M. Victoria

Difusores
  Difusor de Varetas             -> M. Victoria, Kailash, Lenvie, Dani Fernandes, Doce Aroma, Via Aroma, Chantree
  Refil para Difusor de Varetas  -> Lenvie, Dani Fernandes, M. Victoria, Kailash, Doce Aroma
  Difusor Eletrico               -> M. Victoria, Via Aroma

Sabonetes
  Sabonete Liquido              -> M. Victoria, Kailash, Lenvie, Dani Fernandes, Doce Aroma, Via Aroma, La Florentina, Chantree
  Sabonete em Barra             -> La Florentina, Kailash
  Refil de Sabonete Liquido     -> M. Victoria, Lenvie
  Sabonete Espumador            -> Dani Fernandes
  Refil de Sabonete Espumador   -> Dani Fernandes

Velas e Aromas
  Vela Perfumada       -> Lenvie, Dani Fernandes, Kailash
  Cera Perfumada       -> Six Senses, Lenvie
  Luminaria Aromatica  -> Six Senses

Corpo e Perfumaria
  Hidratantes   -> Dani Fernandes, Chantree, Lenvie
  Body Splash   -> Dani Fernandes, Lenvie
  Parfum        -> Dani Fernandes

Maison Berger
  Lampe Berger              -> Maison Berger
  Refil para Lampe Berger   -> Maison Berger

Marcas  (link direto para /marcas)
Ofertas (link direto para /produtos?ofertas=1)
```

## Slugs canonicos

### Grupos
`aromatizacao`, `difusores`, `sabonetes`, `velas-e-aromas`,
`corpo-e-perfumaria`, `maison-berger`

### Tipos de produto (categories.slug)
`agua-perfumada`, `home-spray`, `sachet-perfumado`, `essencia-concentrada`,
`aroma-para-carro`, `gesso-perfumado`, `monograma`,
`difusor-de-varetas`, `refil-para-difusor-de-varetas`, `difusor-eletrico`,
`sabonete-liquido`, `sabonete-em-barra`, `refil-de-sabonete-liquido`,
`sabonete-espumador`, `refil-de-sabonete-espumador`,
`vela-perfumada`, `cera-perfumada`, `luminaria-aromatica`,
`hidratantes`, `body-splash`, `parfum`,
`lampe-berger`, `refil-para-lampe-berger`,
`kits`

### Marcas (brands.slug)
`m-victoria`, `kailash`, `lenvie`, `dani-fernandes`, `doce-aroma`,
`chantree`, `via-aroma`, `bubas`, `la-florentina`, `maison-berger`,
`six-senses`

## Observacoes tecnicas

- O catalogo aceita `?q=` como alias de `?busca=` apenas pra nao quebrar
  links antigos. Se nao houver mais links com `?q=`, da pra remover esse
  alias na proxima limpeza.

- `MobileMenuDrawer` usa `createPortal(document.body)` porque o header tem
  `backdrop-blur` que cria containing block para `position: fixed`. Sem o
  portal o drawer ficaria preso dentro do header. Esse mesmo problema ja
  havia sido resolvido no commit antigo `571779b` para o `MobileNav` antigo.

- Tabela `brands` segue o mesmo padrao de RLS de `categories`:
  leitura publica, escrita apenas admin (`public.is_admin()`).

- A migration 0004 esta escrita pra ser idempotente. Usa `on conflict (slug)
  do update set ...` em todos os seeds. Pode rodar varias vezes sem corromper
  dados.

- Validacao funcionou em SSR. As paginas de catalogo sao server-rendered e
  filtram no banco (sem hidratacao no cliente). Mega menu e drawer sao
  client components separados.

- Build: 30 paginas, todas dynamic (`ƒ`) exceto `/_not-found` e `/robots.txt`
  (ambas static). Nao ha staticc generation de produto.

## Arquivos NAO tocados nesta rodada (sao do trabalho anterior, preservados)

- Checkout transparente Mercado Pago (`/api/checkout/transparent`, `CheckoutForm`)
- Webhook MP que trata evento `order` (com `mpOrderStatusToOrderStatus`)
- Admin redesign (header dark, financeiro, guia)
- ProductForm em etapas
- Emails Resend
- Auth pages (login/cadastro/recuperar/redefinir)

Esses arquivos foram modificados em rodadas anteriores documentadas em
`HANDOFF_COMPLETO_PARA_CLAUDE.md`. Esta rodada nao os tocou.

-- =============================================================================
-- 0004_brands_and_groups.sql
--
-- Estrutura nova de taxonomia pro mega menu:
--   GRUPO (top nav)  →  TIPO DE PRODUTO (categoria)  →  MARCA  →  PRODUTOS
--
-- Mudancas:
--   1. Cria tabela `brands` (11 marcas: M. Victoria, Kailash, Lenvie, etc.)
--   2. Adiciona `products.brand_id` (FK nullable)
--   3. Adiciona `categories.group_slug` (texto) — agrupa tipos no menu
--      (ex.: "difusor-de-varetas" e "refil-para-difusor-de-varetas" sao tipos
--       do grupo "difusores")
--   4. Renomeia categorias existentes pros slugs do spec (sem perder produtos —
--      FK eh em `category_id`, nao em slug)
--   5. Backfill: todos os 243 produtos atuais → brand = "Dani Fernandes"
--   6. Seed: 11 marcas + todos os tipos de produto do spec (com group_slug)
--
-- Compativel com codigo atual: codigo le `categories.slug` e `products.category_id`.
-- Codigo novo lera `categories.group_slug` e `products.brand_id`.
-- =============================================================================

-- 1) Tabela brands
create table if not exists public.brands (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  position    int  not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists brands_active_idx on public.brands(active, position);

alter table public.brands enable row level security;

-- leitura publica
do $$ begin
  create policy brands_public_read on public.brands for select using (true);
exception when duplicate_object then null; end $$;

-- escrita admin
do $$ begin
  create policy brands_admin_write on public.brands for all using (public.is_admin());
exception when duplicate_object then null; end $$;

-- 2) products.brand_id
alter table public.products
  add column if not exists brand_id uuid references public.brands(id) on delete set null;

create index if not exists products_brand_idx on public.products(brand_id);

-- 3) categories.group_slug + label legivel do tipo
alter table public.categories
  add column if not exists group_slug text,
  add column if not exists product_type_label text;

create index if not exists categories_group_idx on public.categories(group_slug);

-- 4) Renomeia categorias existentes pros nomes do spec.
--    Idempotente: usa where slug = ... entao re-rodar nao quebra.
--
--    Antes  → Depois (slug)  | grupo
--    ----------------------- | --------
--    difusores               → difusor-de-varetas        | difusores
--    home-spray              → home-spray                | aromatizacao
--    sabonetes               → sabonete-liquido          | sabonetes
--    agua-perfumada          → agua-perfumada            | aromatizacao
--    cremes                  → hidratantes               | corpo-e-perfumaria
--    kits                    → kits                      | (sem grupo, opcional)
--    acessorios              → acessorios                | (sem grupo)

update public.categories set
  slug = 'difusor-de-varetas',
  name = 'Difusor de Varetas',
  product_type_label = 'Difusor de Varetas',
  group_slug = 'difusores'
  where slug = 'difusores';

update public.categories set
  product_type_label = 'Home Spray',
  group_slug = 'aromatizacao'
  where slug = 'home-spray';

update public.categories set
  slug = 'sabonete-liquido',
  name = 'Sabonete Liquido',
  product_type_label = 'Sabonete Liquido',
  group_slug = 'sabonetes'
  where slug = 'sabonetes';

update public.categories set
  product_type_label = 'Agua Perfumada',
  group_slug = 'aromatizacao'
  where slug = 'agua-perfumada';

update public.categories set
  slug = 'hidratantes',
  name = 'Hidratantes',
  product_type_label = 'Hidratantes',
  group_slug = 'corpo-e-perfumaria'
  where slug = 'cremes';

update public.categories set
  product_type_label = 'Kits',
  group_slug = 'presentes'
  where slug = 'kits';

-- 5) Seed das 11 marcas
insert into public.brands (slug, name, position) values
  ('m-victoria',     'M. Victoria',     10),
  ('kailash',        'Kailash',         20),
  ('lenvie',         'Lenvie',          30),
  ('dani-fernandes', 'Dani Fernandes',  40),
  ('doce-aroma',     'Doce Aroma',      50),
  ('chantree',       'Chantree',        60),
  ('via-aroma',      'Via Aroma',       70),
  ('bubas',          'Bubas',           80),
  ('la-florentina',  'La Florentina',   90),
  ('maison-berger',  'Maison Berger',  100),
  ('six-senses',     'Six Senses',     110)
on conflict (slug) do update set
  name     = excluded.name,
  position = excluded.position;

-- 6) Seed dos tipos de produto novos do spec (alem dos ja existentes acima)
--
-- Cada tipo eh uma `category` com seu group_slug. Slug eh idempotente.
insert into public.categories (slug, name, product_type_label, group_slug, position) values
  -- Aromatizacao
  ('sachet-perfumado',           'Sache Perfumado',            'Sache Perfumado',         'aromatizacao', 110),
  ('essencia-concentrada',       'Essencia Concentrada',       'Essencia Concentrada',    'aromatizacao', 120),
  ('aroma-para-carro',           'Aroma para Carro',           'Aroma para Carro',        'aromatizacao', 130),
  ('gesso-perfumado',            'Gesso Perfumado',            'Gesso Perfumado',         'aromatizacao', 140),
  ('monograma',                  'Monograma',                  'Monograma',               'aromatizacao', 150),
  -- Difusores
  ('refil-para-difusor-de-varetas','Refil para Difusor de Varetas','Refil para Difusor de Varetas','difusores',210),
  ('difusor-eletrico',           'Difusor Eletrico',           'Difusor Eletrico',        'difusores',    220),
  -- Sabonetes
  ('sabonete-em-barra',          'Sabonete em Barra',          'Sabonete em Barra',       'sabonetes',    310),
  ('refil-de-sabonete-liquido',  'Refil de Sabonete Liquido',  'Refil de Sabonete Liquido','sabonetes',   320),
  ('sabonete-espumador',         'Sabonete Espumador',         'Sabonete Espumador',      'sabonetes',    330),
  ('refil-de-sabonete-espumador','Refil de Sabonete Espumador','Refil de Sabonete Espumador','sabonetes', 340),
  -- Velas e Aromas
  ('vela-perfumada',             'Vela Perfumada',             'Vela Perfumada',          'velas-e-aromas',410),
  ('cera-perfumada',             'Cera Perfumada',             'Cera Perfumada',          'velas-e-aromas',420),
  ('luminaria-aromatica',        'Luminaria Aromatica',        'Luminaria Aromatica',     'velas-e-aromas',430),
  -- Corpo e Perfumaria
  ('body-splash',                'Body Splash',                'Body Splash',             'corpo-e-perfumaria',510),
  ('parfum',                     'Parfum',                     'Parfum',                  'corpo-e-perfumaria',520),
  -- Maison Berger
  ('lampe-berger',               'Lampe Berger',               'Lampe Berger',            'maison-berger',610),
  ('refil-para-lampe-berger',    'Refil para Lampe Berger',    'Refil para Lampe Berger', 'maison-berger',620)
on conflict (slug) do update set
  name = excluded.name,
  product_type_label = excluded.product_type_label,
  group_slug = excluded.group_slug,
  position = excluded.position;

-- 7) Backfill: todos os produtos atuais → marca = Dani Fernandes
--    (todos os 243 vieram do scrape danifernandes.com.br)
update public.products
   set brand_id = (select id from public.brands where slug = 'dani-fernandes')
 where brand_id is null;

-- Tabela pra capturar e-mails da newsletter
-- Aceita inscricoes sem login; admin le tudo.

create table public.newsletter_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  source       text default 'site',
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  confirmed    boolean not null default false
);

create unique index newsletter_email_uniq on public.newsletter_subscriptions (lower(email));
create index newsletter_active_idx on public.newsletter_subscriptions(subscribed_at desc) where unsubscribed_at is null;

alter table public.newsletter_subscriptions enable row level security;

-- Qualquer um pode se inscrever (insert via API publica)
create policy newsletter_anon_insert on public.newsletter_subscriptions
  for insert to anon, authenticated
  with check (true);

-- Apenas admin le
create policy newsletter_admin_select on public.newsletter_subscriptions
  for select using (public.is_admin());

create policy newsletter_admin_update on public.newsletter_subscriptions
  for update using (public.is_admin());

# Codex - Ajuste de redirecionamento de e-mail/Supabase

Data: 2026-06-25

## Problema

Ao confirmar o e-mail, o Supabase confirmava a conta corretamente, mas o usuario era redirecionado para `localhost` ou para uma URL temporaria/confusa.

## Causa provavel

1. O `.env.local` estava com:

```env
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

2. A Vercel ainda tinha `NEXT_PUBLIC_SITE_URL` apontando para o dominio antigo:

```env
https://luperfumes.vercel.app
```

3. No Supabase, o painel de Auth tambem precisa estar com o dominio oficial em `Site URL` e com os redirects permitidos.

## Arquivos alterados

- `src/lib/auth/paths.ts`
- `src/app/cadastro/page.tsx`
- `src/app/recuperar-senha/actions.ts`
- `src/app/logout/route.ts`
- `.env.local`

## O que foi feito no codigo

1. `siteOrigin()` agora normaliza URLs de autenticacao.
   - Se a variavel estiver como `localhost`, `127.0.0.1` ou `luperfumes.vercel.app`, o app usa:

```txt
https://www.perfumesdeambiente.com
```

2. Cadastro e reenvio de confirmacao continuam usando:

```txt
/auth/callback?next=/minha-conta?confirmed=1
```

3. Recuperacao de senha deixou de montar URL manualmente com fallback para `localhost`.
   - Agora usa o mesmo helper de auth:

```txt
/auth/callback?next=/redefinir-senha
```

4. Logout tambem passou a usar o helper de dominio oficial.

5. A tela de cadastro ficou mais clara depois do envio do e-mail.
   - Explica que ao clicar no botao do e-mail a cliente volta para a area da cliente.
   - Adiciona botao `Ja confirmei, entrar`.
   - Mantem botao `Reenviar confirmacao`.

## O que foi atualizado na Vercel

Comando aplicado:

```bash
npx vercel env add NEXT_PUBLIC_SITE_URL production --value "https://www.perfumesdeambiente.com" --force --yes --no-sensitive
npx vercel env add NEXT_PUBLIC_SITE_URL preview --value "https://www.perfumesdeambiente.com" --force --yes --no-sensitive
npx vercel env add NEXT_PUBLIC_SITE_URL development --value "https://www.perfumesdeambiente.com" --force --yes --no-sensitive
```

Observacao: a Vercel passou a guardar essa variavel como `encrypted`, entao o `vercel env ls` nao mostra mais o valor, mas os comandos confirmaram `Overrode NEXT_PUBLIC_SITE_URL`.

## Ajuste necessario no Supabase

No projeto Supabase `luperfumes` (`phkpwvdbmeotyqchybch`), abrir:

```txt
Authentication > URL Configuration
```

Configurar:

```txt
Site URL:
https://www.perfumesdeambiente.com
```

Adicionar em `Redirect URLs`:

```txt
https://www.perfumesdeambiente.com/**
https://perfumesdeambiente.com/**
https://www.perfumesdeambiente.com/auth/callback
https://perfumesdeambiente.com/auth/callback
https://luperfumes.vercel.app/**
http://localhost:3000/**
```

## Ajuste importante no template de e-mail do Supabase

Abrir:

```txt
Authentication > Email Templates > Confirm signup
```

Se o botao do e-mail estiver usando `{{ .SiteURL }}`, trocar para o link padrao de confirmacao:

```html
<a href="{{ .ConfirmationURL }}">Confirmar e-mail</a>
```

Isso e importante porque `{{ .ConfirmationURL }}` carrega o `redirect_to` enviado pelo app.

Se o template tiver sido construido manualmente com `{{ .SiteURL }}`, ele pode ignorar o `emailRedirectTo` do codigo e cair no `Site URL` antigo.

## Referencias Supabase

- Redirect URLs: https://supabase.com/docs/guides/auth/redirect-urls
- Email templates: https://supabase.com/docs/guides/auth/auth-email-templates


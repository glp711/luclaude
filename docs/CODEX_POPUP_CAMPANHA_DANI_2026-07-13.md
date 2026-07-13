# Popup promocional por campanha - Dani Fernandes

Data: 2026-07-13

## Objetivo

Criar um exemplo de popup promocional para visitantes que chegam ao site por uma publicidade ou link de campanha da Dani Fernandes.

O popup nao aparece para todo visitante. Ele depende de um identificador na URL, evitando interromper a navegacao organica da loja.

## Comportamento implementado

- O popup pode aparecer em qualquer pagina publica da loja.
- Nao aparece no carrinho, checkout, pedidos ou area da conta.
- Em campanhas normais, abre 2,2 segundos depois do carregamento.
- Aparece apenas uma vez por sessao do navegador.
- Pode ser fechado pelo botao `X`, pelo fundo, pelo link `Continuar navegando` ou pela tecla `Esc`.
- O foco fica preso dentro do modal enquanto ele esta aberto.
- O scroll do fundo e bloqueado durante a exibicao.
- O layout foi preparado para desktop e mobile.
- O CTA leva diretamente ao catalogo filtrado por Dani Fernandes.
- O link do CTA inclui UTMs internas para identificar a origem `popup`.

## Oferta usada

Foi utilizada uma condicao que ja existe no projeto:

```txt
Frete gratis acima de R$ 250 para todo o Brasil.
```

Nao foi criado cupom ou desconto ficticio. Para anunciar desconto percentual no futuro, o checkout e o cadastro da promocao precisam aplicar a mesma regra.

## Como ativar em uma publicidade

Exemplo de URL para Instagram ou outra campanha:

```txt
https://www.perfumesdeambiente.com/?promo=dani&utm_source=instagram&utm_medium=paid_social&utm_campaign=dani_fernandes
```

O popup tambem e reconhecido quando `utm_campaign`, `utm_content`, `utm_term` ou `campaign` contiver a palavra `dani`.

## URL de demonstracao

O parametro abaixo ignora o historico da sessao e abre rapidamente para apresentacao:

```txt
http://localhost:3000/?promo=dani&preview=popup-dani
```

Depois do deploy, a demonstracao pode usar:

```txt
https://www.perfumesdeambiente.com/?promo=dani&preview=popup-dani
```

## Conteudo visual

- Imagem existente: `public/hero/dani-fernandes-tenue-banner-2026-06-29.png`.
- Paleta: cream, coral, verde-salvia e grafite.
- Titulo: `Um gesto de aconchego para sua casa.`
- CTA principal: `Explorar Dani Fernandes`.
- CTA secundario: `Continuar navegando`.
- Cards e modal usam raio maximo de 8px, seguindo a linguagem visual atual.

## Arquivos alterados

- `src/components/CampaignPopup.tsx`
- `src/app/(site)/layout.tsx`
- `docs/CODEX_POPUP_CAMPANHA_DANI_2026-07-13.md`

## Observacoes

- Nenhuma regra de frete, preco, produto, checkout ou Supabase foi alterada.
- O popup apenas comunica a regra de frete gratis ja existente.
- A campanha pode ser trocada depois por outra marca mudando imagem, texto, parametros e URL de destino.

## Validacoes realizadas

- Inspecao visual em desktop com viewport de `1440 x 900`.
- Inspecao visual em mobile com viewport de `390 x 844`.
- Confirmacao de foco inicial no botao de fechar e fechamento pela tecla `Esc`.
- Confirmacao do CTA ate o catalogo filtrado da Dani Fernandes.
- Verificacao de que a URL de destino preserva os parametros internos de campanha.
- `npm run lint`.
- `npm run typecheck`.
- `npm run build`.

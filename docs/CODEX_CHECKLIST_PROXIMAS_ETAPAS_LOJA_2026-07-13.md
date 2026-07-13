# Checklist das proximas etapas da loja

Data: 2026-07-13

Este documento organiza as proximas entregas da Perfumes de Ambiente Decor em uma ordem segura de execucao. Os itens devem ser marcados somente depois de testados em desktop, mobile e producao.

## Ordem recomendada

### 1. Adicionar os produtos restantes

- [ ] Reunir nome, marca, categoria, descricao, preco, estoque, SKU, peso e dimensoes de cada produto.
- [ ] Separar e nomear as fotos por produto.
- [ ] Confirmar com a cliente os precos e estoques antes da publicacao.
- [ ] Cadastrar cada produto com a marca original correta.
- [ ] Associar cada produto a categoria correta do menu.
- [ ] Conferir imagem principal, galeria, descricao e valor na pagina do produto.
- [ ] Testar filtros por categoria e marca no desktop e mobile.
- [ ] Remover produtos de teste ou manter estoque zero ate a confirmacao comercial.

**Concluido quando:** todos os produtos enviados pela cliente aparecem corretamente no catalogo e podem ser encontrados pelos filtros esperados.

### 2. Montar kits com a identidade da Perfumes de Ambiente Decor

- [ ] Definir quais produtos de marcas diferentes podem compor cada kit.
- [ ] Confirmar disponibilidade e custo de cada item do kit.
- [ ] Definir nome, proposta, embalagem, preco e quantidade disponivel.
- [ ] Criar fotos proprias dos kits com a identidade visual da curadoria.
- [ ] Deixar claro na descricao quais marcas e produtos fazem parte de cada composicao.
- [ ] Configurar o estoque do kit sem perder o controle dos produtos individuais.
- [ ] Criar uma categoria ou colecao chamada `Kits da Curadoria`.
- [ ] Destacar os kits na pagina inicial e em campanhas sazonais.

**Concluido quando:** cada kit possui composicao, preco, estoque, fotos e embalagem aprovados pela cliente, sem alterar o nome das marcas originais.

### 3. Automatizar notificacoes de venda pelo webhook do Mercado Pago

- [ ] Confirmar a URL oficial do webhook em producao.
- [ ] Configurar a URL no painel da aplicacao oficial do Mercado Pago.
- [ ] Validar a assinatura e a origem de cada notificacao.
- [ ] Tornar o processamento idempotente para evitar pedido pago duas vezes.
- [ ] Consultar o pagamento diretamente na API do Mercado Pago antes de atualizar o pedido.
- [ ] Atualizar o status do pedido no Supabase depois da confirmacao real.
- [ ] Registrar o ID do pagamento e o horario da confirmacao.
- [ ] Enviar notificacao de nova venda para a administradora.
- [ ] Enviar confirmacao de pagamento para o cliente.
- [ ] Testar Pix, cartao aprovado, pagamento recusado e notificacao repetida.
- [ ] Conferir logs da Vercel, painel do Mercado Pago e pedido no Supabase.

**Concluido quando:** uma compra real ou controlada atualiza o pedido automaticamente, gera apenas uma confirmacao e deixa rastros verificaveis nos tres sistemas.

### 4. Configurar as credenciais oficiais da perfumaria

- [ ] Receber o CNPJ e os dados cadastrais oficiais da empresa.
- [ ] Criar ou validar a aplicacao oficial da loja no Mercado Pago.
- [ ] Configurar as credenciais de producao do Mercado Pago na Vercel.
- [ ] Confirmar a conta de recebimento e os dados do titular.
- [ ] Criar ou validar o contrato oficial de frete da loja.
- [ ] Configurar credenciais de Correios ou Melhor Envio, conforme a operacao escolhida.
- [ ] Atualizar remetente, endereco de postagem e dados fiscais.
- [ ] Executar uma cotacao real de frete em producao.
- [ ] Executar uma cobranca controlada e confirmar o recebimento.
- [ ] Revogar credenciais antigas ou de teste que nao serao mais utilizadas.

**Seguranca obrigatoria:** tokens, senhas e chaves privadas devem ficar somente nas variaveis protegidas da Vercel. Nunca salvar credenciais reais em arquivos do projeto, documentos, prints ou commits do GitHub.

**Concluido quando:** pagamento e frete usam as contas oficiais da cliente e funcionam de ponta a ponta em producao.

### 5. Melhorar o cadastro de produtos no painel administrativo

- [ ] Adicionar um seletor de marca visivel no formulario de novo produto.
- [ ] Carregar apenas marcas ativas cadastradas no Supabase.
- [ ] Tornar a marca obrigatoria antes da publicacao.
- [ ] Manter categoria e marca como campos separados.
- [ ] Exibir uma previa da imagem principal.
- [ ] Organizar o formulario em blocos: identificacao, classificacao, preco, estoque, frete, imagens e publicacao.
- [ ] Explicar a diferenca entre preco atual e preco anterior/promocional.
- [ ] Validar SKU duplicado, campos obrigatorios, peso e dimensoes.
- [ ] Mostrar mensagens claras de sucesso e erro.
- [ ] Testar criacao e edicao de produto no desktop e mobile.

**Concluido quando:** a administradora consegue cadastrar um produto completo, escolher marca e categoria e publica-lo sem precisar editar o banco manualmente.

### 6. Transformar `Best Sellers` em `Mais Vendidos`

- [ ] Trocar o titulo visivel `Best Sellers` por `Mais Vendidos`.
- [ ] Substituir `sets` por uma chamada comercial em portugues.
- [ ] Criar uma frase curta e apelativa sem perder o tom premium da marca.
- [ ] Exibir produtos com imagem, preco, desconto real e CTA claro.
- [ ] Destacar apenas promocoes que estejam realmente configuradas no produto e no checkout.
- [ ] Mostrar preco anterior riscado somente quando for maior que o preco atual.
- [ ] Adicionar selo de economia percentual quando houver promocao valida.
- [ ] Incluir um CTA para ver todas as ofertas.
- [ ] Melhorar setas, paginacao e gesto de arrastar no carrossel.
- [ ] Garantir que os primeiros produtos tenham foto, estoque e apelo comercial.
- [ ] Testar a secao imediatamente depois dos heroes no desktop e mobile.

**Direcao sugerida de texto:**

- Titulo: `Mais vendidos`.
- Apoio: `Os aromas que conquistaram mais casas.`
- Chamada promocional: `Escolhas da curadoria com condicoes especiais por tempo limitado.`
- CTA: `Ver ofertas`.

**Regra de confianca:** o termo `Mais vendidos` deve usar dados reais de pedidos pagos ou uma selecao manual claramente assumida como curadoria. Nao inventar volume de vendas. Promocao so deve ser anunciada quando o preco promocional estiver realmente aplicado.

**Concluido quando:** a secao prende a atencao logo depois dos heroes, leva ao catalogo e comunica ofertas reais sem confundir o cliente.

### 7. Adicionar o mapa do endereco no final do site

- [ ] Confirmar se o endereco pode ser divulgado publicamente como loja ou ponto de atendimento.
- [ ] Adicionar o mapa antes do rodape ou dentro da pagina de contato.
- [ ] Usar o endereco `Av. das Araucarias, 1525 - Aguas Claras, Brasilia - DF, 72025-065`.
- [ ] Adicionar botao `Como chegar` abrindo o Google Maps.
- [ ] Aplicar carregamento tardio no mapa para nao prejudicar a velocidade da pagina.
- [ ] Incluir titulo acessivel e alternativa textual com o endereco completo.
- [ ] Ajustar altura e enquadramento para desktop e mobile.
- [ ] Confirmar se o marcador aponta para o local correto.

**Concluido quando:** o mapa aparece no final do site, nao atrasa o carregamento inicial e abre a rota correta no Google Maps.

## Sequencia de execucao sugerida

1. Produtos restantes.
2. Painel administrativo com selecao de marca.
3. Credenciais oficiais.
4. Webhook e notificacoes de venda.
5. Mais Vendidos e estrategia promocional.
6. Kits da Curadoria.
7. Mapa do endereco.

## Validacao final antes do lancamento

- [ ] Catalogo revisado pela cliente.
- [ ] Estoques e precos confirmados.
- [ ] Compra real controlada concluida.
- [ ] Webhook confirmado nos logs.
- [ ] Frete calculado com a conta oficial.
- [ ] Pedido recebido no painel administrativo.
- [ ] E-mail de confirmacao recebido pelo cliente.
- [ ] Notificacao de venda recebida pela administradora.
- [ ] Site revisado em celular e computador.
- [ ] Credenciais de teste removidas ou isoladas.
- [ ] Backup e documentacao entregues ao Claude.

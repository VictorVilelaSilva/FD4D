# Guia de refatoração de interface FD4D

Este documento fornece diretrizes para a refatoração de interfaces no FD4D, garantindo consistência, usabilidade e manutenção eficiente do código.

## Princípios Gerais

### Ui e UX
- **Consistência Visual**: Utilize cores, fontes e estilos de botões padronizados conforme o guia de estilo do FD4D.
- **Feedback do Usuário**: Sempre forneça feedback visual para ações do usuário, como cliques em botões ou carregamento de dados.
- **Acessibilidade**: Certifique-se de que a interface seja acessível para todos os usuários, incluindo aqueles com deficiências.
### Código Limpo
- **Nomenclatura Clara**: Use nomes descritivos para variáveis, funções e componentes.
- **Modularidade**: Divida o código em componentes reutilizáveis e mantenha a lógica separada da apresentação.
- **Comentários Úteis**: Adicione comentários apenas quando necessário, explicando o "porquê" do código, não o "o quê".

## Diretrizes Específicas
- Sempre devemos olhar para a biblioteca de componentes Magic UI( que é possivel ser acessada por MCP) para ver se ja existe algum componente que atenda a necessidade antes de criar um novo componente do zero.
- Vamos manter as cores ja definidas no design system do FD4D, evitando criar novas paletas de cores.
- Utilize icones ao inves de emojis para representar ações ou estados na interface.
- A intenção prinpical é ter uma interface limpa, simples e objetiva, evitando poluição visual.
- como é um app focado em produtividade, devemos evitar animações desnecessarias que possam distrair o usuario.
- sempre vamos tenha atenção com relação a responsividade da interface, garantindo que funcione bem em diferentes tamanhos de tela.

## componentes de Interface

### cards 
- Os cards da aplicação devem usar ter Border Beam da biblioteca de componentes Magic UI( que é possivel ser acessada por MCP).
- O campo de de onde vai ser puxado os cpf ou cnpj deve usar Typing Animation da biblioteca de componentes Magic UI( que é possivel ser acessada por MCP).

### Botões
- Utilize os botões padrão da biblioteca Magic UI para garantir consistência.
- Eles devem estar de tamanhos agradeveis e com textos claros.

### Backgrounds
- Na home page do app o backgound que deve ser usado é o Retro Grid da biblioteca de componentes Magic UI( que é possivel ser acessada por MCP).
- Nas outras páginas o background deve ser o Dot Pattern da biblioteca de componentes Magic UI( que é possivel ser acessada por MCP).

## Tipografia
- as fontes devem puxar mais para um lado de fontes dos botões, titulos devem utilizar fira code.

## Dock

- O dock deve ser simples, com icones claros e de fácil entendimento.
- Utilize o Dock Bar da biblioteca de componentes Magic UI( que é possivel ser acessada por MCP) para manter a consistência visual.
- tente pegar icones o mais descritivos possiveis para as funcionalidades presentes no dock.


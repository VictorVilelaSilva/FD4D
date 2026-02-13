# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [3.0.3] - 2026-02-13

### Adicionado
- **JsonViewer Component**: Novo componente para visualização de JSON com syntax highlighting e suporte completo a light/dark mode (PR #20)
- **Tema Claro**: Implementado suporte completo ao tema claro com alternância animada entre dark/light mode (PR #19)
- **Theme Toggler**: Componente de alternância de tema animado (`animated-theme-toggler`) para transição suave entre temas (PR #19)
- **Estado de Máscara Separado**: Gerador de CPF e CNPJ agora mantém estados de máscara independentes para cada tipo de documento (PR #18)
- **Variáveis CSS RGB**: Adicionadas variantes RGB de todas as cores em `variables.css` para uso com `rgba()` e maior flexibilidade (PR #20)

### Corrigido
- **JsonViewer - Regex de Tokens**: Melhorado o regex para captura de tokens JSON, incluindo tratamento correto de strings vazias (`""`) (PR #20)
- **JsonViewer - Verificação Falsy**: Corrigida verificação de strings vazias que eram ignoradas devido a serem valores falsy em JavaScript (PR #20)
- **Background Windows**: Ajustes no background para melhor compatibilidade com o tema claro (PR #19)

### Alterado
- **Shadows**: Atualizado sistema de sombras para melhor profundidade e claridade, especialmente no light mode com sombras duplas e maior opacidade (PR #20)
- **CSS Padronizado**: Padronizadas todas as cores hardcoded em 7 arquivos CSS (~47 substituições) para uso de variáveis CSS centralizadas (PR #20)
- **Background Light Mode**: Alterada cor de fundo do tema claro para `#F4F5FA` para melhor contraste e legibilidade (PR #20)
- **Estrutura de Componentes**: Melhorada estrutura de wrapper de ferramentas para suporte consistente a temas (PR #19)

## [3.0.2] - 2026-02-13

### Adicionado
- Implementado cache de estado para as ferramentas: Agora, ao alternar entre as ferramentas, o estado de cada uma (inputs, resultados, etc.) é preservado, melhorando a experiência do usuário. Isso foi feito mantendo os componentes das ferramentas montados no DOM e controlando sua visibilidade via CSS.

## [3.0.0] - 2026-02-10

### Alterado
- Refatora todo o projeto para Tauri


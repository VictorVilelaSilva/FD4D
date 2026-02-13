# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [3.0.2] - 2026-02-13

### Adicionado
- Implementado cache de estado para as ferramentas: Agora, ao alternar entre as ferramentas, o estado de cada uma (inputs, resultados, etc.) é preservado, melhorando a experiência do usuário. Isso foi feito mantendo os componentes das ferramentas montados no DOM e controlando sua visibilidade via CSS.

## [3.0.0] - 2026-02-10

### Alterado
- Refatora todo o projeto para Tauri


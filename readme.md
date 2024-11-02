
# Projeto FD4D

![img][banner]


## Sobre o Projeto
Estre projeto foi desenvolvido com intuito de facilitar a vida de quem trabalha com desenvolvimento de software, fornecendo ferramentas para geração de CPF e CNPJ válidos, além da disponibilização de uma ferramenta para captura de cores.

### atalhos de teclado
- **ctrl+1**: Gera um CPF válido.
- **ctrl+2**: Gera um CNPJ válido.
- **ctrl+3**: Gera um RG válido.
- **ctrl+4**: Gera um UUID.
- **ctrl+**: Alterna entre máscara de CPF e CNPJ.
- **ctrl+alt+h**: Copia a cor hexadecimal para a área de transferência.
- **ctrl+alt+r**: Copia a cor RGB para a área de transferência.
- **ctrl+alt+c**: Copia a cor CMYK para a área de transferência.
asdsadasdasdasd


### Descrição dos Arquivos

- **assets/constants/Constants.py**: Contém constantes utilizadas no projeto.
- **assets/functions/ColorPickFuntions.py**: Funções relacionadas à captura de cores.
- **assets/functions/GeneratorFunctions.py**: Funções para geração de CPF e CNPJ.
- **helpers/TkinterFonts.py**: Configurações de fontes para a interface `tkinter`.
- **main.py**: Arquivo principal para execução da aplicação.
- **monitor.py**: Monitoramento de cores do pixel sob o mouse.
- **requirements.txt**: Arquivo com as dependências do projeto.
- **main.spec**: Arquivo de configuração para geração de executável com o `PyInstaller`.


## Instalação

1. Clone o repositório:
    ```sh
    git clone <URL_DO_REPOSITORIO>
    ```
2. Navegue até o diretório do projeto:
    ```sh
    cd <NOME_DO_DIRETORIO>
    ```
3. Instale as dependências:
    ```sh
    pip install -r requirements.txt
    ```

## Uso

Para iniciar a aplicação, execute o arquivo `main.py`:

Windows:
```sh
python main.py
```
Unix:
```sh
python3 main.py
```

## Geração de Executável

Caso deseje gerar um executável, execute o comando abaixo:

```sh
pyinstaller main.spec
```
[banner]: assets/Images/Banner.png

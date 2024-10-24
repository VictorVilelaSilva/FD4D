
# Projeto FD4D - Ferramentas para Desenvolvedores
![img][banner]


## Sobre o Projeto
Este projeto foi desenvolvido com o intuito de facilitar a vida de quem trabalha com desenvolvimento de software, fornecendo ferramentas para a geração de CPF, CNPJ, RG válidos, assim como a geração de UUID, além de uma ferramenta para captura de cores.
> [!NOTE]
>Ainda há muito a ser adicionado, mas, por enquanto, é apenas um ponto de partida, com as funcionalidades que mais utilizo no dia a dia.
### Bibliotecas Utilizadas
- Tkinter - Para a interface gráfica
- PyInstaller - Para gerar executáveis
- Pyperclip - Para copiar dados para a área de transferência
- threading - Para executar funções em paralelo
- pyautogui - Para capturar a posição do mouse
- PIL - Para capturar a cor do pixel onde o mouse está

## Download
Abaixo estão os links para download dos executáveis para cada sistema operacional:

- [Windows](https://github.com/VictorVilelaSilva/FD4D/releases/download/2.0.2/FD4D_windows.zip)
- [Linux](https://github.com/VictorVilelaSilva/FD4D/releases/download/2.0.2/FD4D_ubuntu.zip)

> [!NOTE]
> So consegui testar o exeutavel para windows, então se tiver algum problema com os outros sistemas operacionais por favor abrir uma issue para que eu possa corrigir.

> [!IMPORTANT]
> É comum que o sistema operacional exiba avisos ao executar arquivos .exe gerados com o PyInstaller. Você pode desconsiderar essa mensagem, mas se ainda assim não se sentir seguro, pode rodar o código-fonte, que está disponível no repositório.


### Atalhos disponíveis
- **ctrl+1**: Gera um RG válido.
- **ctrl+2**: Gera um CPF válido.
- **ctrl+3**: Gera um CNPJ válido.
- **ctrl+4**: Gera um UUID.
- **ctrl+***: Alterna entre máscara de CPF e CNPJ.
- **ctrl+alt+h**: Copia a cor hexadecimal para a área de transferência.
- **ctrl+alt+r**: Copia a cor RGB para a área de transferência.
- **ctrl+alt+c**: Copia a cor CMYK para a área de transferência.

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

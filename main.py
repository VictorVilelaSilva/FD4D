from json import tool
import os
from turtle import width
from assets.functions.ColorPickFuntions import (
    get_mouse_hex_color,
    hex_to_rgb,
    rgb_to_cmyk,
)
from assets.functions.GeneratorFunctions import generate_cnpj, generate_cpf, generate_rg
from assets.constants.Constants import BACKGROUND_COLOR, HEIGHT_ROOT_LINUX, HEIGHT_ROOT_WINDOWS, WIDTH_ROOT_LINUX, WIDTH_ROOT_WINDOWS
from PIL import Image, ImageTk
from tktooltip import ToolTip
from assets.functions.tools import local_path
from pathlib import Path
import tkinter as tk
import pyperclip
import threading
from pynput import keyboard
import uuid
import time

# Resolve o bug de diretorio base ao compilar com o pyinstaller
base_path = local_path()


class MainWindow:
    mask: bool = False
    hexColor: str = ""
    hex_to_rgb: tuple = ()
    rgb_to_cmyk: tuple = ()

    def get_cpf(self) -> None:
        string_cpf = generate_cpf(self.mask)
        self.result_label.config(text="Gerado CPF: " + string_cpf)
        pyperclip.copy(string_cpf)

    def get_cnpj(self) -> None:
        string_cnpj = generate_cnpj(self.mask)
        self.result_label.config(text="Gerado CNPJ: " + string_cnpj)
        pyperclip.copy(string_cnpj)

    def get_rg(self) -> None:
        rg = generate_rg(self.mask)
        self.result_label.config(text="Gerado RG: " + rg)
        pyperclip.copy(rg)

    def get_uuid(self) -> None:
        uuid_generated = str(uuid.uuid4())
        self.result_label.config(text="Gerado UUID: " + uuid_generated)
        pyperclip.copy(uuid_generated)

    def toggle_mask(self) -> None:
        self.mask = not self.mask

    def get_color_mouse(self) -> None:
        while True:
            self.hexColor = get_mouse_hex_color()
            self.rgbColor = hex_to_rgb(self.hexColor)
            self.cmykColor = rgb_to_cmyk(self.rgbColor)
            self.colorScreen.config(bg=self.hexColor)
            self.colorTextHex.config(text=f"{self.hexColor}")
            self.colorTextRgb.config(text=f"{self.rgbColor}")
            self.colorTextCmyk.config(text=f"{self.cmykColor}")
            time.sleep(0.05)

    def __init__(self, root, width, height):
        self.mask = False
        containersSize = {
            "width": (width / 2) - 2,
            "height": height,
        }
        image_path = base_path / Path("assets/Images/Logo.png")

        root.configure(bg=BACKGROUND_COLOR)
        root.title("FD4D")

        # region  Header container
        # Criação do container do cabeçalho
        self.header = tk.Frame(
            root,
            background=BACKGROUND_COLOR,
            border=1,
            relief="flat",
            width=width,
            height=100,
        )
        self.image = Image.open(image_path)
        self.image = self.image.resize((80, 80), Image.LANCZOS)
        self.image = ImageTk.PhotoImage(self.image)
        self.imageLabel = tk.Label(self.header, image=self.image, bg=BACKGROUND_COLOR)
        self.headerText = tk.Label(
            self.header,
            text="Funcionalidades Básicas",
            font=("Fira Code SemiBold", 20),
            bg=BACKGROUND_COLOR,
            fg="#fff",
        )
        self.header.pack(side="top", fill="x")
        self.imageLabel.pack(side="left")
        self.headerText.pack(side="top", fill="x", pady=20)
        # endregion

        # Definir o tamanho desejado para o main_container
        self.main_container = tk.Frame(
            root,
            background=BACKGROUND_COLOR,
            width=width,
        )
        self.main_container.pack(side="top", fill="both", expand=True)

        # region Gerador
        self.container1 = tk.Frame(
            self.main_container,
            background=BACKGROUND_COLOR,
            border=1,
            relief="sunken",
            width=containersSize["width"],
            height=containersSize["height"],
        )
        # self.container1.pack_propagate(0)  # Evita que o container se ajuste ao conteúdo
        self.container1.pack(side="left", expand=True, fill="both")
        self.result_label = tk.Label(self.container1, text="TDFD")
        self.result_label.config(bg="#fff", borderwidth=2.5)
        self.result_label.pack(pady=20)

        self.rg_button = tk.Button(
            self.container1, text="Gerar RG", width=16, command=self.get_rg
        )
        ToolTip(self.rg_button, "Ctrl + 1")
        self.rg_button.pack(pady=(15, 0))
        self.cpf_button = tk.Button(
            self.container1, text="Gerar CPF", width=16, command=self.get_cpf
        )
        ToolTip(self.cpf_button, "Ctrl + 2")
        self.cpf_button.pack(pady=(15, 0))
        self.cnpj_button = tk.Button(
            self.container1, text="Gerar CNPJ", width=16, command=self.get_cnpj
        )
        ToolTip(self.cnpj_button, "Ctrl + 3")
        self.cnpj_button.pack(pady=(15, 0))
        self.uuid_button = tk.Button(
            self.container1, text="Gerar UUID", width=16, command=self.get_uuid
        )
        ToolTip(self.uuid_button, "Ctrl + 4")
        self.uuid_button.pack(pady=(15, 0))
        self.mask_button = tk.Button(
            self.container1, text="Toggle Mask", width=16, command=self.toggle_mask
        )
        ToolTip(self.mask_button, "Ctrl + *")
        self.mask_button.pack(pady=(15, 0))
        # endregion

        # region Monitor de cores
        self.container2 = tk.Frame(
            self.main_container,
            background=BACKGROUND_COLOR,
            border=1,
            relief="sunken",
            width=containersSize["width"],
            height=containersSize["height"],
        )
        # self.container2.pack_propagate(0)  # Evita que o container se ajuste ao conteúdo
        self.container2.pack(side="left", expand=True, fill="both")
        self.colorScreen = tk.Label(
            self.container2,
            text="",
            width=10,
            height=4,
            border=2,
            borderwidth=3,
            relief="groove",
        )
        self.colorScreen.pack(side="top", pady=(30, 50))

        self.hexContainer = tk.Frame(
            self.container2,
            background=BACKGROUND_COLOR,
            relief="flat",
        )
        self.hexContainer.pack(side="top")
        self.copyHexButton = tk.Button(
            self.hexContainer,
            text="Copiar Hex",
            height=1,
            width=10,
            command=lambda: pyperclip.copy(self.hexColor),
        )
        ToolTip(self.copyHexButton, "Ctrl + Alt + H")
        self.copyHexButton.pack(side="left", padx=1)
        self.colorTextHex = tk.Label(
            self.hexContainer,
            bg="#fff",
            fg="#000",
            height=1,
            width=20,
            justify="center",
        )
        self.colorTextHex.pack(side="left", padx=1)

        self.rgbContainer = tk.Frame(
            self.container2,
            background=BACKGROUND_COLOR,
            relief="flat",
        )
        self.rgbContainer.pack(side="top", pady=10)
        self.copyRgbButton = tk.Button(
            self.rgbContainer,
            text="Copiar RGB",
            height=1,
            width=10,
            command=lambda: pyperclip.copy(self.rgbColor),
        )
        ToolTip(self.copyRgbButton, "Ctrl + Alt + R")
        self.copyRgbButton.pack(
            side="left",
            padx=1,
        )
        self.colorTextRgb = tk.Label(
            self.rgbContainer,
            bg="#fff",
            fg="#000",
            height=1,
            width=20,
            justify="center",
        )
        self.colorTextRgb.pack(side="left", padx=1)

        self.cmykContainer = tk.Frame(
            self.container2,
            background=BACKGROUND_COLOR,
            relief="flat",
        )
        self.cmykContainer.pack(side="top")
        self.copyCmykButton = tk.Button(
            self.cmykContainer,
            text="Copiar CMYK",
            height=1,
            width=10,
            command=lambda: pyperclip.copy(self.cmykColor),
        )
        ToolTip(self.copyCmykButton, "Ctrl + Alt + C")
        self.copyCmykButton.pack(side="left", padx=1)
        self.colorTextCmyk = tk.Label(
            self.cmykContainer,
            bg="#fff",
            fg="#000",
            height=1,
            width=20,
            justify="center",
        )
        self.colorTextCmyk.pack(side="left", padx=1)
        # endregion

        # Criar novo container na parte inferior
        self.container_bottom = tk.Frame(
            root,
            background=BACKGROUND_COLOR,
            border=1,
            relief="sunken",
            width=width+500,
            height=1000,
        )
        # self.container_bottom.pack_propagate(0)  # Evita que o container se ajuste ao conteúdo
        self.container_bottom.pack(side="bottom", fill="x")

        # Adicionar widgets ao novo container, se necessário
        label_bottom = tk.Label(
            self.container_bottom,
            text="Novo Container Inferior",
            bg=BACKGROUND_COLOR,
            fg="#fff",
            font=("Fira Code SemiBold", 14),
        )
        label_bottom.pack(pady=10)

        # region Hotkeys
        listener = keyboard.GlobalHotKeys({
            '<ctrl>+1': self.get_rg,
            '<ctrl>+2': self.get_cpf,
            '<ctrl>+3': self.get_cnpj,
            '<ctrl>+4': self.get_uuid,
            '<ctrl>+*': self.toggle_mask,
            '<ctrl>+<alt>+h': lambda: pyperclip.copy(self.hexColor),
            '<ctrl>+<alt>+r': lambda: pyperclip.copy(self.rgbColor),
            '<ctrl>+<alt>+c': lambda: pyperclip.copy(self.cmykColor),

        })
        listener.start()
        # endregion

        thread = threading.Thread(target=self.get_color_mouse)
        thread.daemon = True
        thread.start()


if __name__ == "__main__":
    root = tk.Tk()
    root.title("FD4D")
    sistema_operacional = os.name
    width = WIDTH_ROOT_LINUX if sistema_operacional == "posix" else WIDTH_ROOT_WINDOWS
    height = HEIGHT_ROOT_LINUX if sistema_operacional == "posix" else HEIGHT_ROOT_WINDOWS
    root.geometry("{0}x{1}".format(width, height))
    if sistema_operacional == "posix":
        root.iconphoto(True, tk.PhotoImage("assets/Images/Logo.png"))
    elif sistema_operacional == "nt":
        root.iconbitmap(base_path / Path("assets/Images/Logo.ico"))
    # root.resizable(False, False)

    generator = MainWindow(root, width, height)
    root.mainloop()

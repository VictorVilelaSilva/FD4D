import tkinter as tk

def open_new_window():
    new_window = tk.Toplevel(root)
    new_window.geometry("400x400")
    new_window.title("Nova Janela")

root = tk.Tk()
root.geometry("400x400")
root.title("Janela Principal")

open_button = tk.Button(root, text="Abrir Nova Janela", command=open_new_window)
open_button.pack(pady=20)

root.mainloop()
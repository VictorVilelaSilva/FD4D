import tkinter as tk
from tkinter import filedialog
import pandas as pd

def convert_excel_to_csv():
    file_path = filedialog.askopenfilename(filetypes=[("Excel files", "*.xlsx;*.xls")])
    if file_path:
        df = pd.read_excel(file_path)
        save_path = filedialog.asksaveasfilename(defaultextension=".csv", filetypes=[("CSV files", "*.csv")])
        if save_path:
            df.to_csv(save_path, index=False)
            tk.messagebox.showinfo("Success", "File converted successfully!")

app = tk.Tk()
app.title("Excel to CSV Converter")

convert_button = tk.Button(app, text="Select Excel File and Convert", command=convert_excel_to_csv)
convert_button.pack(pady=20)

app.mainloop()

import pyautogui


def get_mouse_hex_color()->str:
    """Retorna a cor HEX do pixel sob o mouse, considerando múltiplos monitores."""
    x,y = pyautogui.position()
    return rgb_to_hex(pyautogui.pixel(x, y))

def hex_to_rgb(hex_color:tuple)->tuple:
    """Converte uma cor em formato HEX diretamente para RGB."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgbTuple:tuple)->str:
    """Converte uma cor em formato RGB para HEX."""
    return '#%02x%02x%02x' % rgbTuple


def cmyk_to_percentage(cmykTuple:tuple)->tuple:
    """Converte uma cor em formato CMYK para porcentagem."""
    c, m, y, k = cmykTuple
    return f"{round(c*100)}%", f"{round(m*100)}%", f"{round(y*100)}%", f"{round(k*100)}%"

def rgb_to_cmyk(rgbTuple:tuple)->tuple:
    """Converte uma cor em formato RGB para CMYK."""
    r, g, b = rgbTuple
    if (r == 0) and (g == 0) and (b == 0):
        return 0, 0, 0, 1

    r = r / 255
    g = g / 255
    b = b / 255

    k = 1 - max(r, g, b)
    c = (1 - r - k) / (1 - k)
    m = (1 - g - k) / (1 - k)
    y = (1 - b - k) / (1 - k)

    cymkTupe = (round(c, 2), round(m, 2), round(y, 2), round(k, 2))

    return ', '.join(cmyk_to_percentage(cymkTupe))

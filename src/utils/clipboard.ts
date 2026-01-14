/**
 * Clipboard Utility Functions
 *
 * Cross-platform clipboard operations with proper error handling
 */

/**
 * Copy text to clipboard
 *
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 *
 * @example
 * ```ts
 * const success = await copyToClipboard('Hello, World!')
 * if (success) {
 *   console.log('Copied to clipboard!')
 * }
 * ```
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Modern Clipboard API (preferred method)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // Fallback method for older browsers or non-secure contexts
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    const successful = document.execCommand('copy')
    textArea.remove()

    return successful
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Read text from clipboard
 *
 * @returns Promise that resolves to the clipboard text or empty string if failed
 *
 * @example
 * ```ts
 * const text = await readFromClipboard()
 * console.log('Clipboard content:', text)
 * ```
 */
export async function readFromClipboard(): Promise<string> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      const text = await navigator.clipboard.readText()
      return text
    }
    return ''
  } catch (error) {
    console.error('Failed to read from clipboard:', error)
    return ''
  }
}

/**
 * Check if clipboard API is available
 *
 * @returns true if clipboard API is available, false otherwise
 */
export function isClipboardAvailable(): boolean {
  return !!(navigator.clipboard && window.isSecureContext)
}

# Example: Adding a New Tool (Base64 Encoder/Decoder)

This is a complete, step-by-step example showing how to add a Base64 Encoder/Decoder tool to FD4D.

## Step 1: Create the Tool Directory

```bash
mkdir -p src/tools/Base64Encoder
```

## Step 2: Create Utility Functions (Optional)

Create `src/utils/base64.ts`:

```typescript
/**
 * Base64 encoding and decoding utilities
 */

/**
 * Encode a string to Base64
 * @param input - String to encode
 * @returns Base64 encoded string
 */
export function encodeBase64(input: string): string {
  try {
    return btoa(input)
  } catch (error) {
    throw new Error('Invalid characters for encoding')
  }
}

/**
 * Decode a Base64 string
 * @param input - Base64 string to decode
 * @returns Decoded string
 */
export function decodeBase64(input: string): string {
  try {
    return atob(input)
  } catch (error) {
    throw new Error('Invalid Base64 string')
  }
}

/**
 * Check if a string is valid Base64
 * @param input - String to validate
 * @returns true if valid Base64
 */
export function isValidBase64(input: string): boolean {
  try {
    return btoa(atob(input)) === input
  } catch {
    return false
  }
}

/**
 * Encode a string to Base64 URL-safe format
 * @param input - String to encode
 * @returns URL-safe Base64 string
 */
export function encodeBase64UrlSafe(input: string): string {
  return encodeBase64(input)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Decode a Base64 URL-safe string
 * @param input - URL-safe Base64 string
 * @returns Decoded string
 */
export function decodeBase64UrlSafe(input: string): string {
  // Add padding if needed
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  return decodeBase64(base64)
}
```

## Step 3: Create the Tool Component

Create `src/tools/Base64Encoder/Base64Encoder.tsx`:

```typescript
import React, { useState } from 'react'
import { theme } from '../../theme/theme'
import { ToolCard } from '../../components/shared/ToolCard'
import { Button } from '../../components/shared/Button'
import { CopyButton } from '../../components/shared/CopyButton'
import { encodeBase64, decodeBase64, isValidBase64 } from '../../utils/base64'

type Mode = 'encode' | 'decode'

export const Base64Encoder: React.FC = () => {
  const [mode, setMode] = useState<Mode>('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [urlSafe, setUrlSafe] = useState(false)

  const handleProcess = () => {
    setError('')

    if (!input.trim()) {
      setError('Please enter some text')
      setOutput('')
      return
    }

    try {
      if (mode === 'encode') {
        setOutput(encodeBase64(input))
      } else {
        if (!isValidBase64(input)) {
          setError('Invalid Base64 string')
          setOutput('')
          return
        }
        setOutput(decodeBase64(input))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setOutput('')
    }
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const handleSwap = () => {
    setInput(output)
    setOutput('')
    setMode(mode === 'encode' ? 'decode' : 'encode')
  }

  // Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xl,
  }

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  }

  const radioGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.lg,
  }

  const radioLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    cursor: 'pointer',
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: theme.typography.fontSize.base,
  }

  const radioStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: theme.colors.primary,
  }

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '200px',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border.default}`,
    background: theme.colors.background.tertiary,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.mono,
    lineHeight: theme.typography.lineHeight.relaxed,
    resize: 'vertical',
    outline: 'none',
  }

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
  }

  const errorStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    background: theme.colors.errorLight,
    border: `1px solid ${theme.colors.error}`,
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.primary,
  }

  const infoBoxStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    background: theme.colors.primaryAlpha,
    border: `1px solid ${theme.colors.primary}`,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.relaxed,
  }

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.lg,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    background: theme.colors.background.tertiary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
  }

  return (
    <div style={containerStyle}>
      {/* Controls */}
      <ToolCard>
        <div style={controlsStyle}>
          {/* Mode Selection */}
          <div>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.tertiary,
              marginBottom: theme.spacing.sm,
              fontWeight: theme.typography.fontWeight.medium,
            }}>
              Mode
            </div>
            <div style={radioGroupStyle}>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'encode'}
                  onChange={() => setMode('encode')}
                  style={radioStyle}
                />
                Encode
              </label>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="mode"
                  checked={mode === 'decode'}
                  onChange={() => setMode('decode')}
                  style={radioStyle}
                />
                Decode
              </label>
            </div>
          </div>

          {/* Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.tertiary,
              marginBottom: theme.spacing.sm,
              fontWeight: theme.typography.fontWeight.medium,
            }}>
              Input
            </label>
            <textarea
              style={textareaStyle}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode'
                ? 'Enter text to encode...'
                : 'Enter Base64 string to decode...'
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  handleProcess()
                }
              }}
            />
            {input && (
              <div style={statsStyle}>
                <span>Characters: {input.length}</span>
                <span>Bytes: {new Blob([input]).size}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={buttonGroupStyle}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleProcess}
              disabled={!input.trim()}
            >
              {mode === 'encode' ? '🔒 Encode' : '🔓 Decode'}
            </Button>
            {output && (
              <Button
                variant="secondary"
                size="lg"
                onClick={handleSwap}
              >
                🔄 Swap & Switch Mode
              </Button>
            )}
            <Button
              variant="ghost"
              size="lg"
              onClick={handleClear}
            >
              🗑️ Clear
            </Button>
          </div>
        </div>
      </ToolCard>

      {/* Error Display */}
      {error && (
        <ToolCard>
          <div style={errorStyle}>
            <strong>Error:</strong> {error}
          </div>
        </ToolCard>
      )}

      {/* Output Display */}
      {output && !error && (
        <ToolCard title="Result">
          <textarea
            style={{
              ...textareaStyle,
              minHeight: '150px',
            }}
            value={output}
            readOnly
          />
          {output && (
            <div style={statsStyle}>
              <span>Characters: {output.length}</span>
              <span>Bytes: {new Blob([output]).size}</span>
            </div>
          )}
          <div style={{ marginTop: theme.spacing.lg, ...buttonGroupStyle }}>
            <CopyButton text={output} size="lg" />
          </div>
        </ToolCard>
      )}

      {/* Info */}
      <ToolCard>
        <div style={infoBoxStyle}>
          <strong>About Base64:</strong> Base64 is a binary-to-text encoding scheme that
          represents binary data in an ASCII string format. It's commonly used to encode
          binary data for transmission over media designed to handle text, such as email
          or JSON. Each Base64 digit represents 6 bits of data.
          <br /><br />
          <strong>Tip:</strong> Press <kbd>Ctrl/Cmd + Enter</kbd> while in the input field
          to quickly {mode === 'encode' ? 'encode' : 'decode'}.
        </div>
      </ToolCard>
    </div>
  )
}
```

## Step 4: Register the Tool

Edit `src/App.tsx` and add the import and registration:

```typescript
// Add import at the top
import { Base64Encoder } from './tools/Base64Encoder/Base64Encoder'

// Add to the toolRegistry.registerMany() array
toolRegistry.registerMany([
  // ... existing tools ...

  createTool({
    id: 'base64-encoder',
    name: 'Base64 Encoder',
    description: 'Encode and decode Base64 strings',
    icon: '🔐',
    category: 'encoder',
    component: Base64Encoder,
    tags: ['base64', 'encode', 'decode', 'conversion', 'binary'],
    shortcut: 'ctrl+shift+b',
  }),
])
```

## Step 5: Test the Tool

1. Run the development server:
   ```bash
   npm run electron:dev
   ```

2. The new "Base64 Encoder" tool should appear in the sidebar under "Encoders"

3. Test the functionality:
   - Encode some text
   - Decode the result
   - Try the swap function
   - Test error handling with invalid Base64
   - Test the clear function

## Step 6: Done!

Your new tool is now fully integrated into FD4D!

## Key Takeaways

1. **Isolated Development**: The tool was developed independently
2. **Reusable Components**: Used shared components (Button, CopyButton, ToolCard)
3. **Theme Consistency**: All styles use the theme system
4. **Type Safety**: Full TypeScript support
5. **User Experience**: Error handling, keyboard shortcuts, visual feedback
6. **No Core Changes**: Added functionality without modifying core code

## Optional Enhancements

You could further enhance this tool with:

- **File Upload**: Allow encoding/decoding files
- **Batch Processing**: Process multiple strings at once
- **URL-Safe Mode**: Toggle for URL-safe Base64
- **Format Options**: Different output formats (with/without line breaks)
- **History**: Keep track of recent encodings/decodings
- **Validation**: More sophisticated Base64 validation
- **Performance**: Handle very large strings efficiently

This example demonstrates the full power and simplicity of FD4D's extensible architecture!

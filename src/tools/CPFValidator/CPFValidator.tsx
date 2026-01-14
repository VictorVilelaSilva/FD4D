import React, { useState } from 'react'
import { theme } from '../../theme/theme'
import { ToolCard } from '../../components/shared/ToolCard'
import { Button } from '../../components/shared/Button'
import { validateCPF, formatCPF, unformatCPF } from '../../utils/cpf'

interface ValidationResult {
  isValid: boolean
  formatted: string
  unformatted: string
  length: number
  hasValidLength: boolean
  hasValidCheckDigits: boolean
  isAllSameDigit: boolean
  message: string
}

export const CPFValidator: React.FC = () => {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)

  const handleValidate = () => {
    if (!input.trim()) {
      setResult(null)
      return
    }

    const cleaned = unformatCPF(input)
    const isValid = validateCPF(input)
    const allSameDigit = /^(\d)\1+$/.test(cleaned)

    const validationResult: ValidationResult = {
      isValid,
      formatted: cleaned.length === 11 ? formatCPF(cleaned) : input,
      unformatted: cleaned,
      length: cleaned.length,
      hasValidLength: cleaned.length === 11,
      hasValidCheckDigits: cleaned.length === 11 && !allSameDigit && isValid,
      isAllSameDigit: allSameDigit,
      message: isValid
        ? '✓ Valid CPF'
        : cleaned.length !== 11
        ? '✗ Invalid length (must be 11 digits)'
        : allSameDigit
        ? '✗ All digits are the same (invalid CPF)'
        : '✗ Invalid check digits',
    }

    setResult(validationResult)
  }

  const handleClear = () => {
    setInput('')
    setResult(null)
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xl,
  }

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
  }

  const labelStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.primary,
    marginBottom: theme.spacing.xs,
  }

  const inputStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border.default}`,
    background: theme.colors.background.tertiary,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.mono,
    outline: 'none',
    textAlign: 'center',
    letterSpacing: '0.05em',
  }

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
  }

  const resultContainerStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    border: `2px solid ${result?.isValid ? theme.colors.success : theme.colors.error}`,
    background: result?.isValid
      ? theme.colors.successAlpha
      : theme.colors.errorAlpha,
  }

  const resultHeaderStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: result?.isValid ? theme.colors.success : theme.colors.error,
    marginBottom: theme.spacing.lg,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.primary,
  }

  const detailsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  }

  const detailItemStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    background: theme.colors.background.card,
    border: `1px solid ${theme.colors.border.default}`,
  }

  const detailLabelStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily.primary,
  }

  const detailValueStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.mono,
    fontWeight: theme.typography.fontWeight.medium,
  }

  const checkItemStyle = (status: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    background: theme.colors.background.tertiary,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.primary,
  })

  const iconStyle = (status: boolean): React.CSSProperties => ({
    fontSize: theme.typography.fontSize.lg,
    color: status ? theme.colors.success : theme.colors.error,
  })

  const infoBoxStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    background: theme.colors.primaryAlpha,
    border: `1px solid ${theme.colors.primary}`,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.relaxed,
  }

  return (
    <div style={containerStyle}>
      <ToolCard>
        <div style={inputContainerStyle}>
          <div>
            <label style={labelStyle}>Enter CPF to validate:</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="000.000.000-00 or 00000000000"
              style={inputStyle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleValidate()
                }
              }}
              maxLength={14}
            />
          </div>

          <div style={buttonGroupStyle}>
            <Button variant="primary" size="lg" onClick={handleValidate} disabled={!input.trim()}>
              🔍 Validate CPF
            </Button>
            <Button variant="ghost" size="lg" onClick={handleClear}>
              🗑️ Clear
            </Button>
          </div>
        </div>
      </ToolCard>

      {result && (
        <ToolCard>
          <div style={resultContainerStyle}>
            <div style={resultHeaderStyle}>
              <span style={{ fontSize: '32px' }}>
                {result.isValid ? '✓' : '✗'}
              </span>
              <span>{result.message}</span>
            </div>

            <div style={detailsGridStyle}>
              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Formatted</div>
                <div style={detailValueStyle}>{result.formatted}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Unformatted</div>
                <div style={detailValueStyle}>{result.unformatted}</div>
              </div>

              <div style={detailItemStyle}>
                <div style={detailLabelStyle}>Length</div>
                <div style={detailValueStyle}>
                  {result.length} {result.hasValidLength ? '✓' : '✗'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: theme.spacing.lg }}>
              <div style={{
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.tertiary,
                marginBottom: theme.spacing.sm,
                fontWeight: theme.typography.fontWeight.medium,
              }}>
                Validation Checks:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
                <div style={checkItemStyle(result.hasValidLength)}>
                  <span style={iconStyle(result.hasValidLength)}>
                    {result.hasValidLength ? '✓' : '✗'}
                  </span>
                  <span>Has 11 digits</span>
                </div>
                <div style={checkItemStyle(!result.isAllSameDigit)}>
                  <span style={iconStyle(!result.isAllSameDigit)}>
                    {!result.isAllSameDigit ? '✓' : '✗'}
                  </span>
                  <span>Not all same digit</span>
                </div>
                <div style={checkItemStyle(result.hasValidCheckDigits)}>
                  <span style={iconStyle(result.hasValidCheckDigits)}>
                    {result.hasValidCheckDigits ? '✓' : '✗'}
                  </span>
                  <span>Valid check digits</span>
                </div>
              </div>
            </div>
          </div>
        </ToolCard>
      )}

      <ToolCard>
        <div style={infoBoxStyle}>
          <strong>About CPF Validation:</strong> The CPF validator checks if a CPF number is
          mathematically valid by verifying:
          <ul style={{ marginTop: theme.spacing.sm, marginLeft: theme.spacing.lg }}>
            <li>Length is exactly 11 digits</li>
            <li>Not all digits are the same (e.g., 111.111.111-11 is invalid)</li>
            <li>The last two check digits are correctly calculated</li>
          </ul>
          <br />
          <strong>Tip:</strong> You can paste CPF numbers with or without formatting. Press Enter to
          validate quickly.
        </div>
      </ToolCard>
    </div>
  )
}

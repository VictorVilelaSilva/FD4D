import React, { useState } from 'react'
import { theme } from '../../theme/theme'
import { ToolCard } from '../../components/shared/ToolCard'
import { Button } from '../../components/shared/Button'
import { validateCNPJ, formatCNPJ, unformatCNPJ } from '../../utils/cnpj'

interface ValidationResult {
  isValid: boolean
  formatted: string
  unformatted: string
  length: number
  hasValidLength: boolean
  hasValidCheckDigits: boolean
  isAllSameDigit: boolean
  baseNumber: string
  branchNumber: string
  message: string
}

export const CNPJValidator: React.FC = () => {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)

  const handleValidate = () => {
    if (!input.trim()) {
      setResult(null)
      return
    }

    const cleaned = unformatCNPJ(input)
    const isValid = validateCNPJ(input)
    const allSameDigit = /^(\d)\1+$/.test(cleaned)

    const validationResult: ValidationResult = {
      isValid,
      formatted: cleaned.length === 14 ? formatCNPJ(cleaned) : input,
      unformatted: cleaned,
      length: cleaned.length,
      hasValidLength: cleaned.length === 14,
      hasValidCheckDigits: cleaned.length === 14 && !allSameDigit && isValid,
      isAllSameDigit: allSameDigit,
      baseNumber: cleaned.length === 14 ? cleaned.slice(0, 8) : '',
      branchNumber: cleaned.length === 14 ? cleaned.slice(8, 12) : '',
      message: isValid
        ? '✓ Valid CNPJ'
        : cleaned.length !== 14
        ? '✗ Invalid length (must be 14 digits)'
        : allSameDigit
        ? '✗ All digits are the same (invalid CNPJ)'
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
    background: theme.colors.secondaryAlpha,
    border: `1px solid ${theme.colors.secondary}`,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.relaxed,
  }

  return (
    <div style={containerStyle}>
      <ToolCard>
        <div style={inputContainerStyle}>
          <div>
            <label style={labelStyle}>Enter CNPJ to validate:</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="00.000.000/0000-00 or 00000000000000"
              style={inputStyle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleValidate()
                }
              }}
              maxLength={18}
            />
          </div>

          <div style={buttonGroupStyle}>
            <Button variant="secondary" size="lg" onClick={handleValidate} disabled={!input.trim()}>
              🔍 Validate CNPJ
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

              {result.baseNumber && (
                <>
                  <div style={detailItemStyle}>
                    <div style={detailLabelStyle}>Base Number</div>
                    <div style={detailValueStyle}>{result.baseNumber}</div>
                  </div>

                  <div style={detailItemStyle}>
                    <div style={detailLabelStyle}>Branch Number</div>
                    <div style={detailValueStyle}>
                      {result.branchNumber}
                      {result.branchNumber === '0001' && (
                        <span style={{ fontSize: theme.typography.fontSize.xs, marginLeft: theme.spacing.xs }}>
                          (Headquarters)
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
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
                  <span>Has 14 digits</span>
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
          <strong>About CNPJ Validation:</strong> The CNPJ validator checks if a CNPJ number is
          mathematically valid by verifying:
          <ul style={{ marginTop: theme.spacing.sm, marginLeft: theme.spacing.lg }}>
            <li>Length is exactly 14 digits</li>
            <li>Not all digits are the same (e.g., 11.111.111/1111-11 is invalid)</li>
            <li>The last two check digits are correctly calculated using the CNPJ algorithm</li>
          </ul>
          <br />
          <strong>CNPJ Structure:</strong> The CNPJ is divided into base number (8 digits), branch
          number (4 digits), and check digits (2 digits). Branch 0001 typically indicates the
          company's headquarters.
          <br /><br />
          <strong>Tip:</strong> You can paste CNPJ numbers with or without formatting. Press Enter to
          validate quickly.
        </div>
      </ToolCard>
    </div>
  )
}

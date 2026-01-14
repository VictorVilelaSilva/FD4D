import React, { useState } from 'react'
import { theme } from '../../theme/theme'
import { ToolCard } from '../../components/shared/ToolCard'
import { Button } from '../../components/shared/Button'
import { CopyButton } from '../../components/shared/CopyButton'
import { generateCNPJ, generateMultipleCNPJs, validateCNPJ } from '../../utils/cnpj'

export const CNPJGenerator: React.FC = () => {
  const [cnpj, setCnpj] = useState('')
  const [formatted, setFormatted] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [multipleCnpjs, setMultipleCnpjs] = useState<string[]>([])

  const handleGenerate = () => {
    if (quantity === 1) {
      const newCnpj = generateCNPJ(formatted)
      setCnpj(newCnpj)
      setMultipleCnpjs([])
    } else {
      const newCnpjs = generateMultipleCNPJs(quantity, formatted)
      setMultipleCnpjs(newCnpjs)
      setCnpj('')
    }
  }

  const handleCopyAll = () => {
    return multipleCnpjs.join('\n')
  }

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

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    alignItems: 'center',
    flexWrap: 'wrap',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.primary,
  }

  const inputStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border.default}`,
    background: theme.colors.background.tertiary,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.primary,
    outline: 'none',
    width: '100px',
  }

  const checkboxContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    cursor: 'pointer',
  }

  const checkboxStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  }

  const resultStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    background: theme.colors.background.tertiary,
    border: `1px solid ${theme.colors.border.default}`,
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.secondary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.semibold,
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const multipleResultsStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    background: theme.colors.background.tertiary,
    border: `1px solid ${theme.colors.border.default}`,
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.secondary,
    maxHeight: '400px',
    overflowY: 'auto',
  }

  const cnpjItemStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} 0`,
    borderBottom: `1px solid ${theme.colors.border.dark}`,
  }

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
        <div style={controlsStyle}>
          <div style={rowStyle}>
            <label style={labelStyle}>
              Quantity:
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                style={{ ...inputStyle, marginLeft: theme.spacing.sm }}
              />
            </label>

            <label style={checkboxContainerStyle}>
              <input
                type="checkbox"
                checked={formatted}
                onChange={(e) => setFormatted(e.target.checked)}
                style={checkboxStyle}
              />
              <span style={labelStyle}>Format (XX.XXX.XXX/XXXX-XX)</span>
            </label>
          </div>

          <div style={rowStyle}>
            <Button variant="secondary" size="lg" onClick={handleGenerate}>
              Generate CNPJ{quantity > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </ToolCard>

      {cnpj && (
        <ToolCard title="Generated CNPJ">
          <div style={resultStyle}>{cnpj}</div>
          <div style={{ marginTop: theme.spacing.lg, display: 'flex', gap: theme.spacing.md }}>
            <CopyButton text={cnpj} size="lg" variant="secondary" />
            <Button
              variant="ghost"
              size="lg"
              onClick={() => alert(`Valid: ${validateCNPJ(cnpj) ? 'Yes ✓' : 'No ✗'}`)}
            >
              🔍 Validate
            </Button>
          </div>
        </ToolCard>
      )}

      {multipleCnpjs.length > 0 && (
        <ToolCard title={`Generated ${multipleCnpjs.length} CNPJs`}>
          <div style={multipleResultsStyle}>
            {multipleCnpjs.map((cnpjItem, index) => (
              <div key={index} style={cnpjItemStyle}>
                {index + 1}. {cnpjItem}
              </div>
            ))}
          </div>
          <div style={{ marginTop: theme.spacing.lg }}>
            <CopyButton
              text={handleCopyAll()}
              size="lg"
              variant="secondary"
              successMessage="All CNPJs Copied!"
            />
          </div>
        </ToolCard>
      )}

      <ToolCard>
        <div style={infoBoxStyle}>
          <strong>About CNPJ:</strong> CNPJ (Cadastro Nacional da Pessoa Jurídica) is the Brazilian
          company taxpayer registry identification. It consists of 14 digits where the last 2 are
          verification digits calculated using a specific algorithm. The generated CNPJs use branch
          number 0001 (headquarters) and are mathematically valid but randomly generated and not
          registered in any official database.
        </div>
      </ToolCard>
    </div>
  )
}

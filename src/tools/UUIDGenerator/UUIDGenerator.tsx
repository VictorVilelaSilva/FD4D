import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { theme } from '../../theme/theme'
import { ToolCard } from '../../components/shared/ToolCard'
import { Button } from '../../components/shared/Button'
import { CopyButton } from '../../components/shared/CopyButton'

export const UUIDGenerator: React.FC = () => {
  const [uuid, setUuid] = useState('')
  const [uppercase, setUppercase] = useState(false)
  const [removeDashes, setRemoveDashes] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [multipleUuids, setMultipleUuids] = useState<string[]>([])

  const formatUuid = (rawUuid: string): string => {
    let formatted = rawUuid
    if (removeDashes) {
      formatted = formatted.replace(/-/g, '')
    }
    if (uppercase) {
      formatted = formatted.toUpperCase()
    }
    return formatted
  }

  const handleGenerate = () => {
    if (quantity === 1) {
      const newUuid = formatUuid(uuidv4())
      setUuid(newUuid)
      setMultipleUuids([])
    } else {
      const newUuids = Array.from({ length: quantity }, () => formatUuid(uuidv4()))
      setMultipleUuids(newUuids)
      setUuid('')
    }
  }

  const handleCopyAll = () => {
    return multipleUuids.join('\n')
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
    color: theme.colors.accent,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.semibold,
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    wordBreak: 'break-all',
  }

  const multipleResultsStyle: React.CSSProperties = {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    background: theme.colors.background.tertiary,
    border: `1px solid ${theme.colors.border.default}`,
    fontFamily: theme.typography.fontFamily.mono,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.accent,
    maxHeight: '400px',
    overflowY: 'auto',
  }

  const uuidItemStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} 0`,
    borderBottom: `1px solid ${theme.colors.border.dark}`,
    wordBreak: 'break-all',
  }

  const infoBoxStyle: React.CSSProperties = {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    background: theme.colors.accentAlpha,
    border: `1px solid ${theme.colors.accent}`,
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
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                style={checkboxStyle}
              />
              <span style={labelStyle}>Uppercase</span>
            </label>

            <label style={checkboxContainerStyle}>
              <input
                type="checkbox"
                checked={removeDashes}
                onChange={(e) => setRemoveDashes(e.target.checked)}
                style={checkboxStyle}
              />
              <span style={labelStyle}>Remove Dashes</span>
            </label>
          </div>

          <div style={rowStyle}>
            <Button variant="success" size="lg" onClick={handleGenerate}>
              Generate UUID{quantity > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </ToolCard>

      {uuid && (
        <ToolCard title="Generated UUID">
          <div style={resultStyle}>{uuid}</div>
          <div style={{ marginTop: theme.spacing.lg }}>
            <CopyButton text={uuid} size="lg" />
          </div>
        </ToolCard>
      )}

      {multipleUuids.length > 0 && (
        <ToolCard title={`Generated ${multipleUuids.length} UUIDs`}>
          <div style={multipleResultsStyle}>
            {multipleUuids.map((uuidItem, index) => (
              <div key={index} style={uuidItemStyle}>
                {index + 1}. {uuidItem}
              </div>
            ))}
          </div>
          <div style={{ marginTop: theme.spacing.lg }}>
            <CopyButton text={handleCopyAll()} size="lg" successMessage="All UUIDs Copied!" />
          </div>
        </ToolCard>
      )}

      <ToolCard>
        <div style={infoBoxStyle}>
          <strong>About UUID:</strong> UUID (Universally Unique Identifier) is a 128-bit identifier
          used to uniquely identify information in computer systems. This generator creates UUID v4,
          which are randomly generated. The probability of generating a duplicate UUID is extremely low,
          making them suitable for distributed systems where coordination is impractical.
          <br />
          <br />
          <strong>Format:</strong> xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx (where x is any hexadecimal
          digit and y is one of 8, 9, A, or B)
        </div>
      </ToolCard>
    </div>
  )
}

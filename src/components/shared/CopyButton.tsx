import React, { useState } from 'react'
import { Button } from './Button'
import { copyToClipboard } from '../../utils/clipboard'

interface CopyButtonProps {
  text: string
  onCopy?: () => void
  successMessage?: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  onCopy,
  successMessage = 'Copied!',
  variant = 'primary',
  size = 'md',
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    if (success) {
      setCopied(true)
      onCopy?.()

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }

  return (
    <Button
      variant={copied ? 'success' : variant}
      size={size}
      onClick={handleCopy}
      disabled={!text}
    >
      {copied ? (
        <>
          <span>✓</span>
          <span>{successMessage}</span>
        </>
      ) : (
        <>
          <span>📋</span>
          <span>Copy to Clipboard</span>
        </>
      )}
    </Button>
  )
}

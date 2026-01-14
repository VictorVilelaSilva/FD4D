/**
 * CPF (Cadastro de Pessoas Físicas) Utility Functions
 *
 * Brazilian individual taxpayer registry identification number generator and validator.
 * CPF consists of 11 digits in the format: XXX.XXX.XXX-XX
 * The last two digits are check digits calculated from the first 9 digits.
 */

/**
 * Calculate a CPF check digit
 *
 * @param cpfArray - Array of CPF digits (9 for first check digit, 10 for second)
 * @returns The calculated check digit
 */
function calculateCheckDigit(cpfArray: number[]): number {
  const length = cpfArray.length + 1
  const sum = cpfArray.reduce((acc, digit, index) => {
    return acc + digit * (length - index)
  }, 0)

  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

/**
 * Generate a valid random CPF number
 *
 * @param formatted - If true, returns formatted CPF (XXX.XXX.XXX-XX), otherwise returns only digits
 * @returns A valid CPF number
 *
 * @example
 * ```ts
 * generateCPF() // Returns: '12345678901'
 * generateCPF(true) // Returns: '123.456.789-01'
 * ```
 */
export function generateCPF(formatted: boolean = false): string {
  // Generate 9 random digits
  const cpfDigits: number[] = []
  for (let i = 0; i < 9; i++) {
    cpfDigits.push(Math.floor(Math.random() * 10))
  }

  // Calculate first check digit
  const firstCheckDigit = calculateCheckDigit(cpfDigits)
  cpfDigits.push(firstCheckDigit)

  // Calculate second check digit
  const secondCheckDigit = calculateCheckDigit(cpfDigits)
  cpfDigits.push(secondCheckDigit)

  const cpfString = cpfDigits.join('')

  if (formatted) {
    return formatCPF(cpfString)
  }

  return cpfString
}

/**
 * Generate multiple valid CPF numbers
 *
 * @param count - Number of CPF numbers to generate
 * @param formatted - If true, returns formatted CPFs
 * @returns Array of valid CPF numbers
 */
export function generateMultipleCPFs(count: number, formatted: boolean = false): string[] {
  const cpfs: string[] = []
  for (let i = 0; i < count; i++) {
    cpfs.push(generateCPF(formatted))
  }
  return cpfs
}

/**
 * Format a CPF string with dots and dash
 *
 * @param cpf - CPF string (only digits)
 * @returns Formatted CPF string (XXX.XXX.XXX-XX)
 *
 * @example
 * ```ts
 * formatCPF('12345678901') // Returns: '123.456.789-01'
 * ```
 */
export function formatCPF(cpf: string): string {
  // Remove any non-digit characters
  const cleaned = cpf.replace(/\D/g, '')

  if (cleaned.length !== 11) {
    return cpf // Return original if invalid length
  }

  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`
}

/**
 * Remove formatting from a CPF string
 *
 * @param cpf - Formatted CPF string
 * @returns CPF string with only digits
 */
export function unformatCPF(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

/**
 * Validate a CPF number
 *
 * @param cpf - CPF string to validate (can be formatted or not)
 * @returns true if the CPF is valid, false otherwise
 *
 * @example
 * ```ts
 * validateCPF('123.456.789-01') // Returns: true or false
 * validateCPF('12345678901') // Returns: true or false
 * ```
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = unformatCPF(cpf)

  // Check if it has 11 digits
  if (cleaned.length !== 11) {
    return false
  }

  // Check if all digits are the same (invalid CPF)
  if (/^(\d)\1+$/.test(cleaned)) {
    return false
  }

  // Convert to array of numbers
  const digits = cleaned.split('').map(Number)

  // Validate first check digit
  const firstCheck = calculateCheckDigit(digits.slice(0, 9))
  if (firstCheck !== digits[9]) {
    return false
  }

  // Validate second check digit
  const secondCheck = calculateCheckDigit(digits.slice(0, 10))
  if (secondCheck !== digits[10]) {
    return false
  }

  return true
}

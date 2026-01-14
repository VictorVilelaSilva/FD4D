/**
 * CNPJ (Cadastro Nacional da Pessoa Jurídica) Utility Functions
 *
 * Brazilian company taxpayer registry identification number generator and validator.
 * CNPJ consists of 14 digits in the format: XX.XXX.XXX/XXXX-XX
 * The last two digits are check digits calculated from the first 12 digits.
 */

/**
 * Calculate a CNPJ check digit
 *
 * @param cnpjArray - Array of CNPJ digits (12 for first check digit, 13 for second)
 * @returns The calculated check digit
 */
function calculateCheckDigit(cnpjArray: number[]): number {
  const weights = cnpjArray.length === 12
    ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  const sum = cnpjArray.reduce((acc, digit, index) => {
    return acc + digit * weights[index]
  }, 0)

  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

/**
 * Generate a valid random CNPJ number
 *
 * @param formatted - If true, returns formatted CNPJ (XX.XXX.XXX/XXXX-XX), otherwise returns only digits
 * @returns A valid CNPJ number
 *
 * @example
 * ```ts
 * generateCNPJ() // Returns: '12345678000190'
 * generateCNPJ(true) // Returns: '12.345.678/0001-90'
 * ```
 */
export function generateCNPJ(formatted: boolean = false): string {
  // Generate 8 random digits for the base number
  const cnpjDigits: number[] = []
  for (let i = 0; i < 8; i++) {
    cnpjDigits.push(Math.floor(Math.random() * 10))
  }

  // Add 4 digits for branch (0001 is common for headquarters)
  cnpjDigits.push(0, 0, 0, 1)

  // Calculate first check digit
  const firstCheckDigit = calculateCheckDigit(cnpjDigits)
  cnpjDigits.push(firstCheckDigit)

  // Calculate second check digit
  const secondCheckDigit = calculateCheckDigit(cnpjDigits)
  cnpjDigits.push(secondCheckDigit)

  const cnpjString = cnpjDigits.join('')

  if (formatted) {
    return formatCNPJ(cnpjString)
  }

  return cnpjString
}

/**
 * Generate multiple valid CNPJ numbers
 *
 * @param count - Number of CNPJ numbers to generate
 * @param formatted - If true, returns formatted CNPJs
 * @returns Array of valid CNPJ numbers
 */
export function generateMultipleCNPJs(count: number, formatted: boolean = false): string[] {
  const cnpjs: string[] = []
  for (let i = 0; i < count; i++) {
    cnpjs.push(generateCNPJ(formatted))
  }
  return cnpjs
}

/**
 * Format a CNPJ string with dots, slash, and dash
 *
 * @param cnpj - CNPJ string (only digits)
 * @returns Formatted CNPJ string (XX.XXX.XXX/XXXX-XX)
 *
 * @example
 * ```ts
 * formatCNPJ('12345678000190') // Returns: '12.345.678/0001-90'
 * ```
 */
export function formatCNPJ(cnpj: string): string {
  // Remove any non-digit characters
  const cleaned = cnpj.replace(/\D/g, '')

  if (cleaned.length !== 14) {
    return cnpj // Return original if invalid length
  }

  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`
}

/**
 * Remove formatting from a CNPJ string
 *
 * @param cnpj - Formatted CNPJ string
 * @returns CNPJ string with only digits
 */
export function unformatCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '')
}

/**
 * Validate a CNPJ number
 *
 * @param cnpj - CNPJ string to validate (can be formatted or not)
 * @returns true if the CNPJ is valid, false otherwise
 *
 * @example
 * ```ts
 * validateCNPJ('12.345.678/0001-90') // Returns: true or false
 * validateCNPJ('12345678000190') // Returns: true or false
 * ```
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleaned = unformatCNPJ(cnpj)

  // Check if it has 14 digits
  if (cleaned.length !== 14) {
    return false
  }

  // Check if all digits are the same (invalid CNPJ)
  if (/^(\d)\1+$/.test(cleaned)) {
    return false
  }

  // Convert to array of numbers
  const digits = cleaned.split('').map(Number)

  // Validate first check digit
  const firstCheck = calculateCheckDigit(digits.slice(0, 12))
  if (firstCheck !== digits[12]) {
    return false
  }

  // Validate second check digit
  const secondCheck = calculateCheckDigit(digits.slice(0, 13))
  if (secondCheck !== digits[13]) {
    return false
  }

  return true
}

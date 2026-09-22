export function validateHospitalName(value) {
  if (!value.trim()) return 'Hospital name is required.'
  if (value.trim().length < 3) return 'Hospital name must be at least 3 characters.'
  return ''
}

export function validateCacNumber(value) {
  if (!value.trim()) return 'CAC registration number is required.'
  if (!/^[A-Za-z0-9\-\/]{4,20}$/.test(value.trim())) {
    return 'Enter a valid CAC number (letters, numbers, - or / only).'
  }
  return ''
}

export function validateMdcnNumber(value) {
  if (!value.trim()) return 'MDCN license number is required.'
  if (!/^[A-Za-z0-9\-\/]{4,20}$/.test(value.trim())) {
    return 'Enter a valid MDCN number (letters, numbers, - or / only).'
  }
  return ''
}

export function validateEmail(value) {
  if (!value.trim()) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return 'Enter a valid email address.'
  }
  return ''
}

export function validatePassword(value) {
  if (!value) return 'Password is required.'
  if (value.length < 6) return 'Password must be at least 6 characters.'
  return ''
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password.'
  if (password !== confirmPassword) return 'Passwords do not match.'
  return ''
}

export function validateNin(value) {
  if (!value.trim()) return 'NIN is required.'
  if (!/^\d{11}$/.test(value.trim())) return 'NIN must be exactly 11 digits.'
  return ''
}

export function validateRequiredName(value, label) {
  if (!value.trim()) return `${label} is required.`
  return ''
}

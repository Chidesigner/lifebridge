// Small helpers for showing dates and names nicely.

export function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function initials(first = '', last = '') {
  return `${first.trim().charAt(0)}${last.trim().charAt(0)}`.toUpperCase() || '?'
}

export function nameInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return (parts[0]?.charAt(0) ?? '') + (parts[1]?.charAt(0) ?? '') || '?'
}

export function timeAgo(value) {
  const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  return new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function longDate(value) {
  return new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function ageFrom(dateOfBirth) {
  if (!dateOfBirth) return null
  const dob = new Date(dateOfBirth)
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const beforeBirthday =
    now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())
  if (beforeBirthday) age -= 1
  return age
}

// Count how many dates fall on each of the last `days` days (oldest first).
export function countByDay(dates, days = 7) {
  const buckets = Array.from({ length: days }, () => 0)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  dates.forEach((value) => {
    const diff = Math.floor((startOfToday - new Date(new Date(value).setHours(0, 0, 0, 0))) / 86400000)
    if (diff >= 0 && diff < days) buckets[days - 1 - diff] += 1
  })
  return buckets
}

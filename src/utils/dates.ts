/** Local midnight on the Monday of the week containing `date`. */
export function startOfWeek(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const daysSinceMonday = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - daysSinceMonday)
  return start
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

/** The YYYY-MM-DD key the API uses for a calendar day. */
export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function weekKeys(anchor: Date): string[] {
  const monday = startOfWeek(anchor)
  return Array.from({ length: 7 }, (_, index) => dateKey(addDays(monday, index)))
}

export function formatDayLabel(key: string): { weekday: string; date: string } {
  const day = parseDateKey(key)
  return {
    weekday: day.toLocaleDateString('en-GB', { weekday: 'short' }),
    date: day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  }
}

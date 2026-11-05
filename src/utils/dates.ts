/** Local midnight on the Sunday of the week containing `date`. */
export function startOfWeek(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  start.setDate(start.getDate() - start.getDay())
  return start
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

/** The YYYY-MM-DD key the API uses for a calendar day. */
export function dateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function weekKeys(anchor: Date): string[] {
  const sunday = startOfWeek(anchor)
  return Array.from({ length: 7 }, (_, index) => dateKey(addDays(sunday, index)))
}

export function formatDayLabel(key: string): { weekday: string; date: string } {
  const day = parseDateKey(key)
  return {
    weekday: day.toLocaleDateString('en-GB', { weekday: 'short' }),
    date: day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  }
}

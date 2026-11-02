import { describe, expect, it } from 'vitest'
import { addDays, formatDayLabel, parseDateKey, startOfWeek } from '../src/utils/dates.ts'

describe('startOfWeek', () => {
  it('returns the Monday of the same week', () => {
    const wednesday = new Date(2026, 10, 4, 15, 30)
    const monday = startOfWeek(wednesday)
    expect(monday.getDay()).toBe(1)
    expect(monday.getDate()).toBe(2)
    expect(monday.getHours()).toBe(0)
  })

  it('treats Sunday as the end of the week', () => {
    const sunday = new Date(2026, 10, 8, 9, 0)
    expect(startOfWeek(sunday).getDate()).toBe(2)
  })
})

describe('date keys', () => {
  it('parses a key to local midnight', () => {
    const day = parseDateKey('2026-11-04')
    expect([day.getFullYear(), day.getMonth(), day.getDate(), day.getHours()]).toEqual([2026, 10, 4, 0])
  })

  it('adds days across a month end', () => {
    const next = addDays(new Date(2026, 9, 30), 3)
    expect([next.getMonth(), next.getDate()]).toEqual([10, 2])
  })

  it('labels a day with a short weekday and date', () => {
    expect(formatDayLabel('2026-11-04')).toEqual({ weekday: 'Wed', date: '4 Nov' })
  })
})

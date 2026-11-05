import { describe, expect, it } from 'vitest'
import { addDays, dateKey, formatDayLabel, parseDateKey, startOfWeek, weekKeys } from '../src/utils/dates.ts'

describe('startOfWeek', () => {
  it('returns the Sunday of the same week', () => {
    const wednesday = new Date(2026, 10, 4, 15, 30)
    const sunday = startOfWeek(wednesday)
    expect(sunday.getDay()).toBe(0)
    expect(sunday.getDate()).toBe(1)
    expect(sunday.getHours()).toBe(0)
  })

  it('treats Sunday as the start of its own week', () => {
    const sunday = new Date(2026, 10, 8, 9, 0)
    expect(startOfWeek(sunday).getDate()).toBe(8)
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

  it('builds week keys Sunday to Saturday for a midweek anchor', () => {
    const anchor = new Date(2026, 10, 4) // Wednesday 4 Nov 2026
    expect(weekKeys(anchor)).toEqual([
      '2026-11-01',
      '2026-11-02',
      '2026-11-03',
      '2026-11-04',
      '2026-11-05',
      '2026-11-06',
      '2026-11-07',
    ])
  })

  it('starts the week on Sunday when the anchor is a Sunday', () => {
    const anchor = new Date(2026, 10, 8) // Sunday 8 Nov 2026
    expect(weekKeys(anchor)[0]).toBe('2026-11-08')
  })

  it('uses local calendar date in Africa/Lagos', () => {
    const originalTz = process.env.TZ
    process.env.TZ = 'Africa/Lagos'
    try {
      const anchor = new Date(2026, 10, 8, 0, 30) // Sunday 8 Nov 2026 00:30 local Lagos
      expect(dateKey(anchor)).toBe('2026-11-08')
      expect(weekKeys(anchor)[0]).toBe('2026-11-08')
    } finally {
      if (originalTz === undefined) {
        delete process.env.TZ
      } else {
        process.env.TZ = originalTz
      }
    }
  })
})

import { describe, expect, it } from 'vitest'
import { formatIngredient, formatMinutes, formatQuantity, scaleIngredients } from '../src/utils/units.ts'

describe('formatQuantity', () => {
  it('shows small metric amounts as-is', () => {
    expect(formatQuantity(250, 'g')).toBe('250 g')
    expect(formatQuantity(400, 'ml')).toBe('400 ml')
    expect(formatQuantity(2.5, 'g')).toBe('2.5 g')
  })

  it('promotes grams to kilograms', () => {
    expect(formatQuantity(1500, 'g')).toBe('1.5 kg')
    expect(formatQuantity(1000, 'g')).toBe('1 kg')
  })

  it('shows counted items without a unit', () => {
    expect(formatQuantity(3, 'pcs')).toBe('3')
    expect(formatQuantity(1.5, 'pcs')).toBe('1.5')
  })
})

describe('formatIngredient', () => {
  it('puts the amount before the name', () => {
    expect(formatIngredient({ name: 'red lentils', quantity: 250, unit: 'g' })).toBe('250 g red lentils')
  })
})

describe('scaleIngredients', () => {
  it('scales every ingredient by the serving ratio', () => {
    const scaled = scaleIngredients([{ name: 'rice', quantity: 300, unit: 'g' }], 4, 2)
    expect(scaled[0].quantity).toBe(150)
  })
})

describe('formatMinutes', () => {
  it('formats minutes and hours', () => {
    expect(formatMinutes(45)).toBe('45 min')
    expect(formatMinutes(60)).toBe('1 h')
    expect(formatMinutes(75)).toBe('1 h 15 min')
  })
})

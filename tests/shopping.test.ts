import { describe, expect, it } from 'vitest'
import { mergeIngredients, normaliseName, validateNewItem } from '../server/shopping.ts'
import type { ShoppingItem } from '../server/types.ts'

function idCounter(start = 100) {
  let id = start
  return () => ++id
}

const baseList: ShoppingItem[] = [
  { id: 1, name: 'onion', quantity: 2, unit: 'pcs', checked: false, recipeIds: [] },
  { id: 2, name: 'milk', quantity: 500, unit: 'ml', checked: false, recipeIds: [] },
]

describe('normaliseName', () => {
  it('trims, collapses spaces and lower-cases', () => {
    expect(normaliseName('  Red   Onion ')).toBe('red onion')
  })
})

describe('validateNewItem', () => {
  it('accepts a whole quantity', () => {
    expect(validateNewItem({ name: 'Bread', quantity: 2, unit: 'pcs' })).toEqual({
      ok: true,
      value: { name: 'bread', quantity: 2, unit: 'pcs' },
    })
  })

  it('rejects a missing name', () => {
    expect(validateNewItem({ name: '  ', quantity: 1 }).ok).toBe(false)
  })

  it('rejects zero and negative quantities', () => {
    expect(validateNewItem({ name: 'rice', quantity: 0 }).ok).toBe(false)
    expect(validateNewItem({ name: 'rice', quantity: -2 }).ok).toBe(false)
  })

  it('rejects unknown units', () => {
    expect(validateNewItem({ name: 'rice', quantity: 1, unit: 'cups' }).ok).toBe(false)
  })
})

describe('mergeIngredients', () => {
  it('adds new ingredients as unticked lines', () => {
    const list = mergeIngredients(baseList, [{ name: 'Rice', quantity: 500, unit: 'g' }], idCounter(), 7)
    expect(list).toHaveLength(3)
    expect(list[2]).toMatchObject({ id: 101, name: 'rice', quantity: 500, checked: false, recipeIds: [7] })
  })

  it('folds a duplicate into the existing line', () => {
    const list = mergeIngredients(baseList, [{ name: 'onion', quantity: 1, unit: 'pcs' }], idCounter(), 4)
    expect(list).toHaveLength(2)
    expect(list[0]).toMatchObject({ quantity: 3, recipeIds: [4] })
  })

  it('keeps different units on separate lines', () => {
    const list = mergeIngredients(baseList, [{ name: 'milk', quantity: 1, unit: 'l' }], idCounter())
    expect(list).toHaveLength(3)
  })

  it('does not mutate the original list', () => {
    mergeIngredients(baseList, [{ name: 'onion', quantity: 1, unit: 'pcs' }], idCounter())
    expect(baseList[0].quantity).toBe(2)
  })
})

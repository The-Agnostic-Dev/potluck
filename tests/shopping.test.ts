import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mergeIngredients, normaliseName, validateNewItem } from '../server/shopping.ts'
import type { ShoppingItem } from '../server/types.ts'
import { createPinia, setActivePinia } from 'pinia'
import { useShoppingStore } from '../src/stores/shopping.ts'
import * as api from '@/api'

vi.mock('@/api', async () => {
  const { seedShoppingList } = await import('../server/seed.ts')
  return {
    fetchShoppingList: vi.fn(async () => seedShoppingList()),
    setItemChecked: vi.fn(async (id: number, checked: boolean) => {
      const item = seedShoppingList().find((i) => i.id === id)
      return { ...item!, checked }
    }),
    addShoppingItem: vi.fn(),
    removeCheckedItems: vi.fn(),
    updateShoppingItem: vi.fn(),
    deleteShoppingItem: vi.fn(),
  }
})

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

describe('shopping store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('counts unticked items and updates when toggled', async () => {
    const shopping = useShoppingStore()
    await shopping.load()
    expect(shopping.remainingCount).toBe(5)

    await shopping.setChecked(1, true)
    expect(shopping.remainingCount).toBe(4)

    await shopping.setChecked(3, false)
    expect(shopping.remainingCount).toBe(5)
  })

  it('toggle uses item id and flips checked state', async () => {
    const shopping = useShoppingStore()
    await shopping.load()

    const eggs = shopping.items.find((item) => item.id === 3)!
    await shopping.toggle(eggs)
    expect(shopping.remainingCount).toBe(6)
    expect(api.setItemChecked).toHaveBeenCalledWith(3, false)

    const tomatoes = shopping.items.find((item) => item.id === 1)!
    await shopping.toggle(tomatoes)
    expect(shopping.remainingCount).toBe(5)
    expect(api.setItemChecked).toHaveBeenCalledWith(1, true)
  })
})

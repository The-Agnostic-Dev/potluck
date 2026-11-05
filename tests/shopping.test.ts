import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mergeIngredients, normaliseName, validateNewItem } from '../server/shopping.ts'
import { useShoppingStore } from '../src/stores/shopping.ts'
import { setItemChecked } from '@/api'
import type { ShoppingItem } from '../server/types.ts'

vi.mock('@/api', () => ({
  setItemChecked: vi.fn(),
}))

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
  const storeBase: ShoppingItem[] = [
    { id: 1, name: 'eggs', quantity: 6, unit: 'pcs', checked: true, recipeIds: [] },
    { id: 2, name: 'milk', quantity: 1, unit: 'l', checked: false, recipeIds: [] },
    { id: 3, name: 'bread', quantity: 1, unit: 'pcs', checked: false, recipeIds: [] },
    { id: 4, name: 'butter', quantity: 250, unit: 'g', checked: false, recipeIds: [] },
    { id: 5, name: 'cheese', quantity: 200, unit: 'g', checked: false, recipeIds: [] },
  ]

  let store: ReturnType<typeof useShoppingStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useShoppingStore()
    store.items = storeBase.map(item => ({ ...item, recipeIds: [...item.recipeIds] }))
    vi.mocked(setItemChecked).mockReset()
    vi.mocked(setItemChecked).mockImplementation(async (id: number, checked: boolean) => ({
      id,
      name: '',
      quantity: 0,
      unit: 'pcs',
      checked,
      recipeIds: [],
    }))
  })

  it('remainingCount counts unchecked items', () => {
    expect(store.remainingCount).toBe(4)
  })

  it('decreases when an unchecked item is ticked', async () => {
    await store.setChecked(2, true)
    expect(store.remainingCount).toBe(3)
    expect(store.items.find(i => i.id === 2)?.checked).toBe(true)
  })

  it('increases when a checked item is unticked', async () => {
    await store.setChecked(1, false)
    expect(store.remainingCount).toBe(5)
    expect(store.items.find(i => i.id === 1)?.checked).toBe(false)
  })

  it('toggles the right item when sorted order differs', async () => {
    await store.setChecked(3, true)
    const items = store.items
    expect(items.find(i => i.id === 3)?.checked).toBe(true)
    expect(items.find(i => i.id === 1)?.checked).toBe(true)
    expect(items.find(i => i.id === 2)?.checked).toBe(false)
    expect(items.find(i => i.id === 4)?.checked).toBe(false)
    expect(items.find(i => i.id === 5)?.checked).toBe(false)
    expect(store.remainingCount).toBe(3)
  })
})

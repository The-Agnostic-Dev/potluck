import type { Ingredient, ShoppingItem, Unit } from './types.ts'

export const UNITS: Unit[] = ['g', 'kg', 'ml', 'l', 'pcs']

export interface NewItemInput {
  name?: unknown
  quantity?: unknown
  unit?: unknown
}

export type ValidationResult =
  | { ok: true; value: Ingredient }
  | { ok: false; error: string }

export function normaliseName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase()
}

export function validateNewItem(input: NewItemInput): ValidationResult {
  const name = typeof input.name === 'string' ? normaliseName(input.name) : ''
  if (!name) {
    return { ok: false, error: 'Please give the item a name.' }
  }
  if (name.length > 60) {
    return { ok: false, error: 'Item names can be at most 60 characters.' }
  }

  const quantity = Number(input.quantity)
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { ok: false, error: 'Quantity must be a positive number.' }
  }

  const unit = (input.unit ?? 'pcs') as Unit
  if (!UNITS.includes(unit)) {
    return { ok: false, error: `Unit must be one of ${UNITS.join(', ')}.` }
  }

  return { ok: true, value: { name, quantity, unit } }
}

function roundQuantity(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Adds ingredients to the list, folding each one into an existing line with
 * the same name and unit so the list stays short.
 */
export function mergeIngredients(
  list: ShoppingItem[],
  ingredients: Ingredient[],
  nextId: () => number,
  recipeId?: number,
): ShoppingItem[] {
  const result = list.map((item) => ({ ...item, recipeIds: [...item.recipeIds] }))

  for (const ingredient of ingredients) {
    const name = normaliseName(ingredient.name)
    const existing = result.find((item) => item.name === name && item.unit === ingredient.unit)

    if (existing) {
      existing.quantity = roundQuantity(existing.quantity + ingredient.quantity)
      if (recipeId !== undefined && !existing.recipeIds.includes(recipeId)) {
        existing.recipeIds.push(recipeId)
      }
      continue
    }

    result.push({
      id: nextId(),
      name,
      quantity: roundQuantity(ingredient.quantity),
      unit: ingredient.unit,
      checked: false,
      recipeIds: recipeId === undefined ? [] : [recipeId],
    })
  }

  return result
}

export function removeChecked(list: ShoppingItem[]): ShoppingItem[] {
  return list.filter((item) => item.checked)
}

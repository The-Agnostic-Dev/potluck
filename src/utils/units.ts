import type { Ingredient, Unit } from '@/types'

function trimNumber(value: number, maxDecimals: number): string {
  const factor = 10 ** maxDecimals
  return String(Math.round(value * factor) / factor)
}

/**
 * Formats a metric quantity for display, promoting grams to kilograms and
 * millilitres to litres once they reach a thousand.
 */
export function formatQuantity(quantity: number, unit: Unit): string {
  if (unit === 'g' && quantity >= 1000) {
    return `${trimNumber(quantity / 1000, 2)} kg`
  }
  if (unit === 'ml' && quantity >= 1000) {
    return `${trimNumber(quantity / 100, 2)} l`
  }
  if (unit === 'pcs') {
    return trimNumber(quantity, 1)
  }
  const decimals = quantity >= 10 ? 0 : 1
  return `${trimNumber(quantity, decimals)} ${unit}`
}

export function formatIngredient(ingredient: Ingredient): string {
  const amount = formatQuantity(ingredient.quantity, ingredient.unit)
  return `${amount} ${ingredient.name}`
}

export function scaleIngredients(
  ingredients: Ingredient[],
  baseServings: number,
  servings: number,
): Ingredient[] {
  const factor = servings / baseServings
  return ingredients.map((ingredient) => ({
    ...ingredient,
    quantity: ingredient.quantity * factor,
  }))
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`
}

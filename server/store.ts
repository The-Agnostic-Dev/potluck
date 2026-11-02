import { seedFavourites, seedPlan, seedRecipes, seedShoppingList } from './seed.ts'
import type { Recipe, ShoppingItem } from './types.ts'

/**
 * In-memory household data. Potluck is single-household for now, so one
 * process holds one kitchen. Restarting the server restores the demo data.
 */
export interface Kitchen {
  recipes: Recipe[]
  shopping: ShoppingItem[]
  favourites: number[]
  plan: Record<string, number>
  nextItemId: () => number
}

export function createKitchen(): Kitchen {
  const shopping = seedShoppingList()
  let lastId = shopping.reduce((max, item) => Math.max(max, item.id), 0)

  return {
    recipes: seedRecipes(),
    shopping,
    favourites: [...seedFavourites],
    plan: seedPlan(),
    nextItemId: () => ++lastId,
  }
}

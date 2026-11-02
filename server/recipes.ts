import type { Recipe, RecipePage, RecipeQuery } from './types.ts'

export const DEFAULT_PAGE_SIZE = 8

const sortKeys = {
  title: 'title',
  time: 'totalMinutes',
} as const

type SortName = keyof typeof sortKeys

function isSortName(value: string | undefined): value is SortName {
  return value !== undefined && value in sortKeys
}

function sortBy(recipes: Recipe[], key: 'title' | 'totalMinutes'): Recipe[] {
  return [...recipes].sort((a, b) => String(a[key]).localeCompare(String(b[key])))
}

function matchesSearch(recipe: Recipe, term: string): boolean {
  if (!term) return true
  const inTitle = recipe.title.toLowerCase().includes(term)
  const inIngredients = recipe.ingredients.some((ingredient) => ingredient.name.includes(term))
  return inTitle || inIngredients
}

export function listRecipes(all: Recipe[], query: RecipeQuery = {}): RecipePage {
  const term = (query.q ?? '').trim()
  const pageSize = Math.max(1, query.pageSize ?? DEFAULT_PAGE_SIZE)

  let results = all.filter((recipe) => matchesSearch(recipe, term))

  if (query.course) {
    results = results.filter((recipe) => recipe.course === query.course)
  }

  const sortName: SortName = isSortName(query.sort) ? query.sort : 'title'
  results = sortBy(results, sortKeys[sortName])

  const total = results.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(1, query.page ?? 1), pageCount)
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1

  return {
    items: results.slice(start, end),
    total,
    page,
    pageSize,
    pageCount,
  }
}

export function findRecipe(all: Recipe[], id: number): Recipe | undefined {
  return all.find((recipe) => recipe.id === id)
}

export function relatedRecipes(all: Recipe[], recipe: Recipe, limit = 3): Recipe[] {
  return all
    .filter((other) => other.course === recipe.course && other.id !== recipe.id)
    .slice(0, limit)
}

export function scaleIngredients(recipe: Recipe, servings: number) {
  const factor = servings / recipe.servings
  return recipe.ingredients.map((ingredient) => ({
    ...ingredient,
    quantity: Math.round(ingredient.quantity * factor * 100) / 100,
  }))
}

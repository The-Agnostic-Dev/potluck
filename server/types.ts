export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'pcs'

export type Course = 'breakfast' | 'mains' | 'soups' | 'salads' | 'desserts'

export interface Ingredient {
  name: string
  quantity: number
  unit: Unit
}

export interface Recipe {
  id: number
  title: string
  course: Course
  summary: string
  servings: number
  prepMinutes: number
  cookMinutes: number
  totalMinutes: number
  ingredients: Ingredient[]
  steps: string[]
}

export interface ShoppingItem {
  id: number
  name: string
  quantity: number
  unit: Unit
  checked: boolean
  recipeIds: number[]
}

export interface RecipeQuery {
  q?: string
  course?: string
  sort?: string
  page?: number
  pageSize?: number
}

export interface RecipePage {
  items: Recipe[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

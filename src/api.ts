import type { RecipeDetail, RecipePage, ShoppingItem, Unit } from './types'

export class ApiError extends Error {
  readonly status: number
  constructor(
    message: string,
    status: number,
  ) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new ApiError(body.error ?? `Request failed (${response.status})`, response.status)
  }
  return body as T
}

export interface RecipeFilters {
  q?: string
  category?: string
  sort?: string
  page?: number
  pageSize?: number
}

export function fetchRecipes(filters: RecipeFilters): Promise<RecipePage> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') params.set(key, String(value))
  }
  return request<RecipePage>(`/recipes?${params}`)
}

export function fetchRecipe(id: number): Promise<RecipeDetail> {
  return request<RecipeDetail>(`/recipes/${id}`)
}

export async function fetchFavourites(): Promise<number[]> {
  const { ids } = await request<{ ids: number[] }>('/favourites')
  return ids
}

export async function setFavourite(id: number, favourite: boolean): Promise<number[]> {
  const { ids } = await request<{ ids: number[] }>(`/favourites/${id}`, {
    method: favourite ? 'PUT' : 'DELETE',
  })
  return ids
}

type ItemsResponse = { items: ShoppingItem[] }

export async function fetchShoppingList(): Promise<ShoppingItem[]> {
  return (await request<ItemsResponse>('/shopping')).items
}

export async function addShoppingItem(name: string, quantity: number, unit: Unit) {
  return (
    await request<ItemsResponse>('/shopping/items', {
      method: 'POST',
      body: JSON.stringify({ name, quantity, unit }),
    })
  ).items
}

export async function addRecipeToList(recipeId: number, servings: number) {
  return (
    await request<ItemsResponse>('/shopping/recipes', {
      method: 'POST',
      body: JSON.stringify({ recipeId, servings }),
    })
  ).items
}

export async function setItemChecked(id: number, checked: boolean): Promise<ShoppingItem> {
  return (
    await request<{ item: ShoppingItem }>(`/shopping/items/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ checked }),
    })
  ).item
}

export async function deleteShoppingItem(id: number) {
  return (await request<ItemsResponse>(`/shopping/items/${id}`, { method: 'DELETE' })).items
}

export async function clearCheckedItems() {
  return (await request<ItemsResponse>('/shopping/checked', { method: 'DELETE' })).items
}

type PlanResponse = { plan: Record<string, number> }

export async function fetchPlan() {
  return (await request<PlanResponse>('/plan')).plan
}

export async function setPlannedRecipe(date: string, recipeId: number) {
  return (
    await request<PlanResponse>(`/plan/${date}`, {
      method: 'PUT',
      body: JSON.stringify({ recipeId }),
    })
  ).plan
}

export async function clearPlannedDay(date: string) {
  return (await request<PlanResponse>(`/plan/${date}`, { method: 'DELETE' })).plan
}

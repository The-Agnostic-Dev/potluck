import { describe, expect, it } from 'vitest'
import { findRecipe, listRecipes, relatedRecipes, scaleIngredients } from '../server/recipes.ts'
import { seedRecipes } from '../server/seed.ts'

const recipes = seedRecipes()

describe('listRecipes', () => {
  it('sorts by title by default', () => {
    const { items } = listRecipes(recipes, { pageSize: 3 })
    const titles = items.map((recipe) => recipe.title)
    expect(titles[0]).toBe('Akara (Bean Fritters)')
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)))
  })

  it('reports the total and page count for the full result', () => {
    const page = listRecipes(recipes, {})
    expect(page.total).toBe(recipes.length)
    expect(page.pageCount).toBe(Math.ceil(recipes.length / page.pageSize))
  })

  it('finds recipes by a lower-case word in the title', () => {
    const { items } = listRecipes(recipes, { q: 'soup' })
    expect(items.map((recipe) => recipe.title)).toContain('Roasted Tomato Soup')
  })

  it('finds recipes by ingredient', () => {
    const { items } = listRecipes(recipes, { q: 'lentils' })
    expect(items.map((recipe) => recipe.id)).toEqual([8])
  })

  it('narrows by course', () => {
    const { items } = listRecipes(recipes, { course: 'salads' })
    expect(items.every((recipe) => recipe.course === 'salads')).toBe(true)
    expect(items.length).toBeGreaterThan(0)
  })

  it('clamps out-of-range pages', () => {
    const page = listRecipes(recipes, { page: 99 })
    expect(page.page).toBe(page.pageCount)
  })
})

describe('recipe lookups', () => {
  it('finds a recipe by id', () => {
    expect(findRecipe(recipes, 10)?.title).toBe('Roasted Tomato Soup')
    expect(findRecipe(recipes, 999)).toBeUndefined()
  })

  it('suggests other recipes from the same course', () => {
    const soup = findRecipe(recipes, 10)!
    const related = relatedRecipes(recipes, soup)
    expect(related.length).toBeGreaterThan(0)
    expect(related.every((recipe) => recipe.course === 'soups' && recipe.id !== 10)).toBe(true)
  })

  it('scales ingredient quantities by servings', () => {
    const dal = findRecipe(recipes, 8)!
    const scaled = scaleIngredients(dal, 2)
    expect(scaled.find((ingredient) => ingredient.name === 'red lentils')?.quantity).toBe(125)
  })
})

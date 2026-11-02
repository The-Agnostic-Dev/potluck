import express, { type Request, type Response } from 'express'
import { DEFAULT_PAGE_SIZE, findRecipe, listRecipes, relatedRecipes, scaleIngredients } from './recipes.ts'
import { mergeIngredients, removeChecked, validateNewItem } from './shopping.ts'
import { createKitchen, type Kitchen } from './store.ts'

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/

function queryString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function idParam(req: Request): number {
  return Number(req.params.id)
}

export function createApi(kitchen: Kitchen = createKitchen()) {
  const api = express.Router()
  api.use(express.json())

  api.get('/recipes', (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1
    const pageSize = Math.min(Number(req.query.pageSize) || DEFAULT_PAGE_SIZE, 100)
    res.json(
      listRecipes(kitchen.recipes, {
        q: queryString(req.query.q),
        course: queryString(req.query.course),
        sort: queryString(req.query.sort),
        page,
        pageSize,
      }),
    )
  })

  api.get('/recipes/:id', (req, res) => {
    const recipe = findRecipe(kitchen.recipes, idParam(req))
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' })
      return
    }
    res.json({ recipe, related: relatedRecipes(kitchen.recipes, recipe) })
  })

  api.get('/favourites', (_req, res) => {
    res.json({ ids: kitchen.favourites })
  })

  api.put('/favourites/:id', (req, res) => {
    const id = idParam(req)
    if (!findRecipe(kitchen.recipes, id)) {
      res.status(404).json({ error: 'Recipe not found' })
      return
    }
    if (!kitchen.favourites.includes(id)) kitchen.favourites.push(id)
    res.json({ ids: kitchen.favourites })
  })

  api.delete('/favourites/:id', (req, res) => {
    const id = idParam(req)
    kitchen.favourites = kitchen.favourites.filter((favourite) => favourite !== id)
    res.json({ ids: kitchen.favourites })
  })

  api.get('/shopping', (_req, res) => {
    res.json({ items: kitchen.shopping })
  })

  api.post('/shopping/items', (req, res) => {
    const result = validateNewItem(req.body ?? {})
    if (!result.ok) {
      res.status(422).json({ error: result.error })
      return
    }
    kitchen.shopping = mergeIngredients(kitchen.shopping, [result.value], kitchen.nextItemId)
    res.status(201).json({ items: kitchen.shopping })
  })

  api.post('/shopping/recipes', (req, res) => {
    const recipe = findRecipe(kitchen.recipes, Number(req.body?.recipeId))
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' })
      return
    }
    const servings = Number(req.body?.servings) || recipe.servings
    const ingredients = scaleIngredients(recipe, servings)
    kitchen.shopping = mergeIngredients(kitchen.shopping, ingredients, kitchen.nextItemId, recipe.id)
    res.status(201).json({ items: kitchen.shopping })
  })

  api.patch('/shopping/items/:id', (req, res) => {
    const item = kitchen.shopping.find((entry) => entry.id === idParam(req))
    if (!item) {
      res.status(404).json({ error: 'Item not found' })
      return
    }
    if (typeof req.body?.checked === 'boolean') item.checked = req.body.checked
    res.json({ item })
  })

  api.delete('/shopping/items/:id', (req, res) => {
    kitchen.shopping = kitchen.shopping.filter((item) => item.id !== idParam(req))
    res.json({ items: kitchen.shopping })
  })

  api.delete('/shopping/checked', (_req, res) => {
    kitchen.shopping = removeChecked(kitchen.shopping)
    res.json({ items: kitchen.shopping })
  })

  api.get('/plan', (_req, res) => {
    res.json({ plan: kitchen.plan })
  })

  api.put('/plan/:date', (req, res) => {
    const { date } = req.params
    const recipe = findRecipe(kitchen.recipes, Number(req.body?.recipeId))
    if (!DATE_KEY.test(date) || !recipe) {
      res.status(422).json({ error: 'Pick a valid day and recipe.' })
      return
    }
    kitchen.plan[date] = recipe.id
    res.json({ plan: kitchen.plan })
  })

  api.delete('/plan/:date', (req, res) => {
    delete kitchen.plan[req.params.date]
    res.json({ plan: kitchen.plan })
  })

  return api
}

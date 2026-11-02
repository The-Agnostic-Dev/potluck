import type { Course, Ingredient, Recipe, ShoppingItem, Unit } from './types.ts'

type RecipeSeed = Omit<Recipe, 'totalMinutes' | 'ingredients'> & {
  ingredients: [string, number, Unit][]
}

const recipeSeeds: RecipeSeed[] = [
  {
    id: 1, title: 'Akara (Bean Fritters)', course: 'breakfast', servings: 4, prepMinutes: 15, cookMinutes: 15,
    summary: 'Crisp, fluffy black-eyed bean fritters with scotch bonnet and onion.',
    ingredients: [['black-eyed beans', 300, 'g'], ['onion', 1, 'pcs'], ['scotch bonnet', 1, 'pcs'], ['vegetable oil', 500, 'ml'], ['salt', 5, 'g']],
    steps: ['Soak and peel the beans.', 'Blend with onion and pepper to a thick batter.', 'Whisk in salt until airy.', 'Fry spoonfuls until golden.'],
  },
  {
    id: 2, title: 'Avocado Toast with Chilli', course: 'breakfast', servings: 2, prepMinutes: 5, cookMinutes: 5,
    summary: 'Sourdough, smashed avocado, lime and chilli flakes.',
    ingredients: [['sourdough bread', 2, 'pcs'], ['avocado', 1, 'pcs'], ['lime', 1, 'pcs'], ['chilli flakes', 2, 'g']],
    steps: ['Toast the bread.', 'Mash avocado with lime juice and salt.', 'Spread and finish with chilli.'],
  },
  {
    id: 3, title: 'Banana Oat Pancakes', course: 'breakfast', servings: 2, prepMinutes: 10, cookMinutes: 10,
    summary: 'Three-ingredient pancakes, naturally sweet.',
    ingredients: [['banana', 2, 'pcs'], ['eggs', 2, 'pcs'], ['rolled oats', 80, 'g'], ['milk', 60, 'ml']],
    steps: ['Blend everything until smooth.', 'Rest for five minutes.', 'Cook small pancakes in a hot pan.'],
  },
  {
    id: 4, title: 'Shakshuka', course: 'breakfast', servings: 2, prepMinutes: 10, cookMinutes: 25,
    summary: 'Eggs poached in a spiced tomato and pepper sauce.',
    ingredients: [['eggs', 4, 'pcs'], ['chopped tomatoes', 400, 'g'], ['red pepper', 1, 'pcs'], ['onion', 1, 'pcs'], ['ground cumin', 3, 'g']],
    steps: ['Soften onion and pepper.', 'Add cumin and tomatoes, simmer 10 minutes.', 'Make wells and crack in the eggs.', 'Cover until the whites set.'],
  },
  {
    id: 5, title: 'Chicken Tikka Masala', course: 'mains', servings: 4, prepMinutes: 20, cookMinutes: 40,
    summary: 'Charred yoghurt-marinated chicken in a creamy tomato sauce.',
    ingredients: [['chicken thighs', 600, 'g'], ['natural yoghurt', 150, 'g'], ['chopped tomatoes', 400, 'g'], ['double cream', 100, 'ml'], ['garam masala', 10, 'g'], ['onion', 1, 'pcs']],
    steps: ['Marinate chicken in yoghurt and spices.', 'Grill until charred.', 'Simmer onion and tomatoes into a sauce.', 'Stir in cream and chicken.'],
  },
  {
    id: 6, title: 'Lemon Herb Chicken Traybake', course: 'mains', servings: 4, prepMinutes: 15, cookMinutes: 75,
    summary: 'One-tray roast chicken legs with potatoes, lemon and thyme.',
    ingredients: [['chicken legs', 4, 'pcs'], ['potatoes', 800, 'g'], ['lemon', 1, 'pcs'], ['thyme', 10, 'g'], ['olive oil', 40, 'ml']],
    steps: ['Toss everything with oil and seasoning.', 'Roast at 200 C, turning once.'],
  },
  {
    id: 7, title: 'Jollof Rice', course: 'mains', servings: 6, prepMinutes: 15, cookMinutes: 60,
    summary: 'Smoky party-style jollof cooked in a rich pepper base.',
    ingredients: [['long grain rice', 500, 'g'], ['plum tomatoes', 400, 'g'], ['red pepper', 2, 'pcs'], ['scotch bonnet', 1, 'pcs'], ['onion', 2, 'pcs'], ['chicken stock', 600, 'ml']],
    steps: ['Blend tomatoes, peppers and one onion.', 'Fry the base until reduced.', 'Add rice and stock, cover tightly.', 'Cook low until fluffy.'],
  },
  {
    id: 8, title: 'Red Lentil Dal', course: 'mains', servings: 4, prepMinutes: 10, cookMinutes: 30,
    summary: 'Comforting spiced lentils finished with a garlic tarka.',
    ingredients: [['red lentils', 250, 'g'], ['coconut milk', 400, 'ml'], ['garlic', 3, 'pcs'], ['ground turmeric', 3, 'g'], ['spinach', 100, 'g']],
    steps: ['Rinse lentils.', 'Simmer with turmeric and coconut milk.', 'Fry garlic in oil and pour over.', 'Wilt in spinach.'],
  },
  {
    id: 9, title: 'Slow Beef Stew', course: 'mains', servings: 6, prepMinutes: 20, cookMinutes: 100,
    summary: 'Tender beef braised with carrots and onions.',
    ingredients: [['stewing beef', 1000, 'g'], ['carrots', 400, 'g'], ['onion', 2, 'pcs'], ['beef stock', 750, 'ml'], ['tomato puree', 30, 'g']],
    steps: ['Brown the beef in batches.', 'Add vegetables and stock.', 'Braise gently until tender.'],
  },
  {
    id: 10, title: 'Roasted Tomato Soup', course: 'soups', servings: 4, prepMinutes: 10, cookMinutes: 40,
    summary: 'Sweet roasted tomatoes blended with basil.',
    ingredients: [['plum tomatoes', 1000, 'g'], ['vegetable stock', 750, 'ml'], ['garlic', 2, 'pcs'], ['basil', 20, 'g'], ['olive oil', 30, 'ml']],
    steps: ['Roast tomatoes and garlic.', 'Blend with stock and basil.', 'Season and warm through.'],
  },
  {
    id: 11, title: 'Pepper Soup', course: 'soups', servings: 4, prepMinutes: 15, cookMinutes: 30,
    summary: 'Light, fiery broth with goat meat and uda spice.',
    ingredients: [['goat meat', 700, 'g'], ['pepper soup spice', 15, 'g'], ['scotch bonnet', 2, 'pcs'], ['scent leaves', 10, 'g'], ['water', 1500, 'ml']],
    steps: ['Simmer the meat with spice.', 'Add pepper and simmer until tender.', 'Finish with scent leaves.'],
  },
  {
    id: 12, title: 'Egusi Soup', course: 'soups', servings: 6, prepMinutes: 20, cookMinutes: 40,
    summary: 'Ground melon seed soup with leafy greens.',
    ingredients: [['ground egusi', 300, 'g'], ['palm oil', 100, 'ml'], ['spinach', 300, 'g'], ['beef', 500, 'g'], ['crayfish', 20, 'g']],
    steps: ['Cook the meat.', 'Fry egusi in palm oil.', 'Add stock and meat, simmer.', 'Stir in greens.'],
  },
  {
    id: 13, title: 'Greek Salad', course: 'salads', servings: 2, prepMinutes: 15, cookMinutes: 0,
    summary: 'Tomatoes, cucumber, olives and feta.',
    ingredients: [['tomatoes', 300, 'g'], ['cucumber', 1, 'pcs'], ['feta', 150, 'g'], ['kalamata olives', 60, 'g'], ['olive oil', 20, 'ml']],
    steps: ['Chop the vegetables.', 'Top with feta and olives.', 'Dress with oil.'],
  },
  {
    id: 14, title: 'Quinoa and Roast Veg Salad', course: 'salads', servings: 4, prepMinutes: 10, cookMinutes: 15,
    summary: 'Nutty quinoa with roast squash and a lemon dressing.',
    ingredients: [['quinoa', 200, 'g'], ['butternut squash', 600, 'g'], ['rocket', 60, 'g'], ['lemon', 1, 'pcs']],
    steps: ['Roast the squash.', 'Cook quinoa.', 'Toss with rocket and dressing.'],
  },
  {
    id: 15, title: 'Lemon Drizzle Cake', course: 'desserts', servings: 8, prepMinutes: 20, cookMinutes: 45,
    summary: 'Buttery loaf soaked in sharp lemon syrup.',
    ingredients: [['butter', 225, 'g'], ['caster sugar', 225, 'g'], ['self-raising flour', 225, 'g'], ['eggs', 4, 'pcs'], ['lemon', 2, 'pcs']],
    steps: ['Cream butter and sugar.', 'Beat in eggs, fold in flour.', 'Bake at 180 C.', 'Pour over lemon syrup while warm.'],
  },
  {
    id: 16, title: 'Chocolate Mousse', course: 'desserts', servings: 4, prepMinutes: 25, cookMinutes: 0,
    summary: 'Airy dark chocolate mousse, set overnight.',
    ingredients: [['dark chocolate', 200, 'g'], ['eggs', 4, 'pcs'], ['caster sugar', 30, 'g']],
    steps: ['Melt the chocolate.', 'Whisk whites to soft peaks.', 'Fold together and chill.'],
  },
  {
    id: 17, title: 'Puff-Puff', course: 'desserts', servings: 6, prepMinutes: 15, cookMinutes: 20,
    summary: 'Sweet fried dough balls, crisp outside and soft inside.',
    ingredients: [['plain flour', 500, 'g'], ['caster sugar', 100, 'g'], ['dried yeast', 7, 'g'], ['warm water', 350, 'ml'], ['vegetable oil', 750, 'ml']],
    steps: ['Mix the batter and leave to rise.', 'Drop small balls into hot oil.', 'Fry until golden and drain.'],
  },
]

function toIngredient([name, quantity, unit]: [string, number, Unit]): Ingredient {
  return { name, quantity, unit }
}

export function seedRecipes(): Recipe[] {
  return recipeSeeds.map((seed) => ({
    ...seed,
    course: seed.course as Course,
    totalMinutes: seed.prepMinutes + seed.cookMinutes,
    ingredients: seed.ingredients.map(toIngredient),
    steps: [...seed.steps],
  }))
}

export function seedShoppingList(): ShoppingItem[] {
  const rows: [string, number, ShoppingItem['unit'], boolean][] = [
    ['tomatoes', 500, 'g', false],
    ['milk', 1, 'l', false],
    ['eggs', 6, 'pcs', true],
    ['bread', 1, 'pcs', false],
    ['basil', 30, 'g', false],
    ['onion', 3, 'pcs', false],
  ]
  return rows.map(([name, quantity, unit, checked], index) => ({
    id: index + 1,
    name,
    quantity,
    unit,
    checked,
    recipeIds: [],
  }))
}

export const seedFavourites = [5, 15]

export function localDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function seedPlan(today = new Date()): Record<string, number> {
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  return {
    [localDateKey(today)]: 7,
    [localDateKey(tomorrow)]: 10,
  }
}

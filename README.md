# Potluck

Potluck is our household cooking app: browse and search recipes, scale ingredient
quantities to the number of people you are feeding, keep favourites, build a
shopping list straight from recipes, and plan dinners for the week.

All quantities are metric (g, kg, ml, l) or simple counts.

## Stack

- **Frontend:** Vue 3 (Composition API, `<script setup>`, TypeScript), Vite, Pinia, Vue Router
- **API:** a small Express 5 app in `server/`, run directly by Node's built-in TypeScript support
- **Data:** in memory, seeded with demo recipes, a shopping list, favourites and this week's plan.
  Restarting the server resets the data.
- **Tests:** Vitest

## Running it

Requires Node 22.18 or newer.

```bash
npm install
npm run dev          # http://localhost:5103, Vite with the API mounted at /api
```

Production-style build, served by the same Express app:

```bash
npm run build
npm start            # http://localhost:5103
```

With Docker:

```bash
docker compose up --build   # http://localhost:5103
```

## Tests

```bash
npm test
```

Tests live in `tests/` and cover the server modules (`server/recipes.ts`,
`server/shopping.ts`) and the frontend utilities in `src/utils/`.

## Project layout

```
server/
  index.ts       production entry: serves /api and the built SPA
  app.ts         API routes (createApi)
  recipes.ts     search, filter, sort, paging and scaling
  shopping.ts    shopping list validation and merging
  store.ts       in-memory household data
  seed.ts        demo data
src/
  api.ts         typed fetch wrappers for /api
  stores/        Pinia stores (favourites, shopping list)
  views/         one component per page
  components/    recipe card, serving stepper, add-item form
  utils/         unit formatting and date helpers
tests/           Vitest specs
```

## API overview

| Method | Path | Notes |
| ------ | ---- | ----- |
| GET | `/api/recipes?q=&category=&sort=title\|time&page=` | paged, 8 per page by default |
| GET | `/api/recipes/:id` | recipe plus related recipes |
| GET, PUT, DELETE | `/api/favourites[/:id]` | |
| GET | `/api/shopping` | |
| POST | `/api/shopping/items` | `{ name, quantity, unit }` |
| POST | `/api/shopping/recipes` | `{ recipeId, servings }`, merges with existing lines |
| PATCH, DELETE | `/api/shopping/items/:id` | tick or remove |
| DELETE | `/api/shopping/checked` | clear ticked items |
| GET, PUT, DELETE | `/api/plan[/:date]` | dates are `YYYY-MM-DD` |

## Conventions

- Ingredient names are stored lower case; the shopping list merges lines with the
  same name and unit.
- The meal planner weeks run Sunday to Saturday.

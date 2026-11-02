export type {
  Course,
  Ingredient,
  Recipe,
  RecipePage,
  ShoppingItem,
  Unit,
} from '../server/types.ts'

export interface RecipeDetail {
  recipe: import('../server/types.ts').Recipe
  related: import('../server/types.ts').Recipe[]
}

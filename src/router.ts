import { createRouter, createWebHistory } from 'vue-router'
import RecipeListView from '@/views/RecipeListView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'recipes', component: RecipeListView },
    {
      path: '/recipes/:id(\\d+)',
      name: 'recipe',
      component: () => import('@/views/RecipeDetailView.vue'),
    },
    {
      path: '/favourites',
      name: 'favourites',
      component: () => import('@/views/FavouritesView.vue'),
    },
    {
      path: '/shopping',
      name: 'shopping',
      component: () => import('@/views/ShoppingListView.vue'),
    },
    {
      path: '/planner',
      name: 'planner',
      component: () => import('@/views/PlannerView.vue'),
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

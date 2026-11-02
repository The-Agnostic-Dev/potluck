<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { fetchRecipe } from '@/api'
import RecipeCard from '@/components/RecipeCard.vue'
import { useFavouritesStore } from '@/stores/favourites'
import type { Recipe } from '@/types'

const favourites = useFavouritesStore()
const recipes = ref<Recipe[]>([])
const loading = ref(true)

async function loadRecipes(ids: number[]) {
  loading.value = true
  const details = await Promise.all(ids.map((id) => fetchRecipe(id).catch(() => null)))
  recipes.value = details.filter((detail) => detail !== null).map((detail) => detail.recipe)
  loading.value = false
}

watch(() => [...favourites.ids], loadRecipes)

onMounted(async () => {
  await favourites.load()
  await loadRecipes(favourites.ids)
})
</script>

<template>
  <section>
    <div class="page-head">
      <h1>Favourites</h1>
    </div>
    <p v-if="!loading && recipes.length === 0" class="empty">
      Nothing here yet. Tap the heart on any recipe to keep it close.
      <RouterLink to="/">Browse recipes</RouterLink>
    </p>
    <div class="grid">
      <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
    </div>
  </section>
</template>

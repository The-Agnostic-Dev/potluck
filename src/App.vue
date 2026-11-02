<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useFavouritesStore } from '@/stores/favourites'

const favourites = useFavouritesStore()

onMounted(() => {
  favourites.load()
})
</script>

<template>
  <header class="topbar">
    <RouterLink to="/" class="brand">Potluck</RouterLink>
    <nav aria-label="Main">
      <RouterLink to="/">Recipes</RouterLink>
      <RouterLink to="/favourites" data-testid="nav-favourites">
        Favourites <span class="badge" data-testid="favourites-count">{{ favourites.count }}</span>
      </RouterLink>
      <RouterLink to="/shopping">Shopping list</RouterLink>
      <RouterLink to="/planner">Meal planner</RouterLink>
    </nav>
  </header>
  <main class="page">
    <RouterView />
  </main>
</template>

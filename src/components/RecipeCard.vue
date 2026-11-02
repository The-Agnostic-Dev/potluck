<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { setFavourite } from '@/api'
import { useFavouritesStore } from '@/stores/favourites'
import type { Recipe } from '@/types'
import { formatMinutes } from '@/utils/units'

const props = defineProps<{ recipe: Recipe }>()

const favourites = useFavouritesStore()
const isFavourite = ref(favourites.isFavourite(props.recipe.id))
const saving = ref(false)

async function toggleFavourite() {
  saving.value = true
  try {
    await setFavourite(props.recipe.id, !isFavourite.value)
    isFavourite.value = !isFavourite.value
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <article class="card recipe-card" data-testid="recipe-card">
    <div class="card-head">
      <span class="course">{{ recipe.course }}</span>
      <button
        type="button"
        class="heart"
        :class="{ active: isFavourite }"
        :aria-pressed="isFavourite"
        :aria-label="isFavourite ? 'Remove from favourites' : 'Add to favourites'"
        :disabled="saving"
        @click="toggleFavourite"
      >
        {{ isFavourite ? '♥' : '♡' }}
      </button>
    </div>
    <h3>
      <RouterLink :to="{ name: 'recipe', params: { id: recipe.id } }">{{ recipe.title }}</RouterLink>
    </h3>
    <p class="summary">{{ recipe.summary }}</p>
    <p class="meta">
      <span data-testid="recipe-time">{{ formatMinutes(recipe.totalMinutes) }}</span>
      <span>Serves {{ recipe.servings }}</span>
    </p>
  </article>
</template>

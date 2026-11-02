<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { fetchRecipe } from '@/api'
import ServingStepper from '@/components/ServingStepper.vue'
import { useFavouritesStore } from '@/stores/favourites'
import { useShoppingStore } from '@/stores/shopping'
import type { Recipe } from '@/types'
import { formatIngredient, formatMinutes, scaleIngredients } from '@/utils/units'

const route = useRoute()
const favourites = useFavouritesStore()
const shopping = useShoppingStore()

const recipe = ref<Recipe | null>(null)
const related = ref<Recipe[]>([])
const servings = ref(1)
const error = ref('')
const notice = ref('')
const adding = ref(false)

const scaled = computed(() =>
  recipe.value ? scaleIngredients(recipe.value.ingredients, recipe.value.servings, servings.value) : [],
)

async function load() {
  error.value = ''
  notice.value = ''
  try {
    const data = await fetchRecipe(Number(route.params.id))
    recipe.value = data.recipe
    related.value = data.related
    servings.value = data.recipe.servings
  } catch (err) {
    recipe.value = null
    error.value = (err as Error).message
  }
}

async function addToList() {
  if (!recipe.value) return
  adding.value = true
  notice.value = ''
  try {
    await shopping.addRecipe(recipe.value.id, recipe.value.servings)
    notice.value = `Added ingredients for ${servings.value} to your shopping list.`
  } catch (err) {
    notice.value = (err as Error).message
  } finally {
    adding.value = false
  }
}

onMounted(load)
</script>

<template>
  <p v-if="error" class="error">{{ error }}</p>

  <article v-else-if="recipe" class="recipe">
    <RouterLink to="/" class="back">← All recipes</RouterLink>
    <div class="page-head">
      <h1 data-testid="recipe-title">{{ recipe.title }}</h1>
      <button
        type="button"
        class="heart large"
        :class="{ active: favourites.isFavourite(recipe.id) }"
        :aria-pressed="favourites.isFavourite(recipe.id)"
        aria-label="Favourite"
        @click="favourites.toggle(recipe.id)"
      >
        {{ favourites.isFavourite(recipe.id) ? '♥' : '♡' }}
      </button>
    </div>
    <p class="summary">{{ recipe.summary }}</p>
    <ul class="facts">
      <li>Prep {{ formatMinutes(recipe.prepMinutes) }}</li>
      <li>Cook {{ formatMinutes(recipe.cookMinutes) }}</li>
      <li>Total {{ formatMinutes(recipe.totalMinutes) }}</li>
    </ul>

    <div class="columns">
      <section class="card">
        <div class="section-head">
          <h2>Ingredients</h2>
          <ServingStepper v-model="servings" />
        </div>
        <ul class="ingredients" data-testid="ingredients">
          <li v-for="ingredient in scaled" :key="ingredient.name">{{ formatIngredient(ingredient) }}</li>
        </ul>
        <button type="button" class="primary" :disabled="adding" @click="addToList">
          Add to shopping list
        </button>
        <p v-if="notice" class="notice" role="status">{{ notice }}</p>
      </section>

      <section class="card">
        <h2>Method</h2>
        <ol class="steps">
          <li v-for="(step, index) in recipe.steps" :key="index">{{ step }}</li>
        </ol>
      </section>
    </div>

    <section v-if="related.length" class="related">
      <h2>You might also like</h2>
      <ul data-testid="related">
        <li v-for="other in related" :key="other.id">
          <RouterLink :to="{ name: 'recipe', params: { id: other.id } }">{{ other.title }}</RouterLink>
        </li>
      </ul>
    </section>
  </article>

  <p v-else class="muted">Loading recipe…</p>
</template>

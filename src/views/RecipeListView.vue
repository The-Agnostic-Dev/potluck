<script setup lang="ts">
import { ref, watch } from 'vue'
import { fetchRecipes } from '@/api'
import RecipeCard from '@/components/RecipeCard.vue'
import type { RecipePage } from '@/types'

const categories = [
  { value: '', label: 'All' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'mains', label: 'Mains' },
  { value: 'soups', label: 'Soups' },
  { value: 'salads', label: 'Salads' },
  { value: 'desserts', label: 'Desserts' },
]

const search = ref('')
const category = ref('')
const sort = ref('title')
const page = ref(1)

const result = ref<RecipePage | null>(null)
const error = ref('')
const loading = ref(false)

let requestId = 0

async function load() {
  const current = ++requestId
  loading.value = true
  error.value = ''
  try {
    const data = await fetchRecipes({
      q: search.value,
      category: category.value,
      sort: sort.value,
      page: page.value,
    })
    if (current === requestId) result.value = data
  } catch (err) {
    if (current === requestId) error.value = (err as Error).message
  } finally {
    if (current === requestId) loading.value = false
  }
}

let searchTimer: ReturnType<typeof setTimeout> | undefined

watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    load()
  }, 250)
})

watch([category, sort], () => {
  page.value = 1
  load()
})

watch(page, load)

load()
</script>

<template>
  <section>
    <div class="page-head">
      <h1>Recipes</h1>
      <p v-if="result" class="muted" data-testid="recipe-total">
        {{ result.total }} {{ result.total === 1 ? 'recipe' : 'recipes' }}
      </p>
    </div>

    <div class="toolbar">
      <input
        v-model="search"
        type="search"
        placeholder="Search recipes or ingredients"
        aria-label="Search recipes"
      />
      <label>
        Sort
        <select v-model="sort" aria-label="Sort recipes">
          <option value="title">A to Z</option>
          <option value="time">Quickest first</option>
        </select>
      </label>
    </div>

    <div class="chips" role="group" aria-label="Category">
      <button
        v-for="option in categories"
        :key="option.value"
        type="button"
        class="chip"
        :class="{ active: category === option.value }"
        :aria-pressed="category === option.value"
        @click="category = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <template v-if="result">
      <p v-if="result.items.length === 0" class="empty">No recipes match that search.</p>
      <div class="grid" :class="{ dim: loading }">
        <RecipeCard v-for="recipe in result.items" :key="recipe.id" :recipe="recipe" />
      </div>

      <nav v-if="result.pageCount > 1" class="pager" aria-label="Pagination">
        <button type="button" :disabled="page <= 1" @click="page--">Previous</button>
        <span data-testid="page-indicator">Page {{ result.page }} of {{ result.pageCount }}</span>
        <button type="button" :disabled="page >= result.pageCount" @click="page++">Next</button>
      </nav>
    </template>
  </section>
</template>

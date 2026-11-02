<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { clearPlannedDay, fetchPlan, fetchRecipes, setPlannedRecipe } from '@/api'
import type { Recipe } from '@/types'
import { addDays, dateKey, formatDayLabel, weekKeys } from '@/utils/dates'

const weekOffset = ref(0)
const plan = ref<Record<string, number>>({})
const recipes = ref<Recipe[]>([])
const error = ref('')

const todayKey = dateKey(new Date())

const days = computed(() =>
  weekKeys(addDays(new Date(), weekOffset.value * 7)).map((key) => ({
    key,
    ...formatDayLabel(key),
    isToday: key === todayKey,
  })),
)

const weekTitle = computed(() => {
  if (weekOffset.value === 0) return 'This week'
  if (weekOffset.value === 1) return 'Next week'
  if (weekOffset.value === -1) return 'Last week'
  const first = days.value[0]
  return `Week of ${first.date}`
})

function recipeTitle(id: number | undefined): string | undefined {
  return recipes.value.find((recipe) => recipe.id === id)?.title
}

async function choose(key: string, value: string) {
  error.value = ''
  try {
    plan.value = value ? await setPlannedRecipe(key, Number(value)) : await clearPlannedDay(key)
  } catch (err) {
    error.value = (err as Error).message
  }
}

onMounted(async () => {
  const [planData, recipePage] = await Promise.all([
    fetchPlan(),
    fetchRecipes({ sort: 'title', pageSize: 100 }),
  ])
  plan.value = planData
  recipes.value = recipePage.items
})
</script>

<template>
  <section>
    <div class="page-head">
      <h1>Meal planner</h1>
      <div class="week-nav">
        <button type="button" aria-label="Previous week" @click="weekOffset--">‹</button>
        <strong data-testid="week-title">{{ weekTitle }}</strong>
        <button type="button" aria-label="Next week" @click="weekOffset++">›</button>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <ol class="week" data-testid="week">
      <li v-for="day in days" :key="day.key" class="card day" :class="{ today: day.isToday }" data-testid="plan-day">
        <header>
          <span class="weekday" data-testid="day-weekday">{{ day.weekday }}</span>
          <span class="date" data-testid="day-date">{{ day.date }}</span>
          <span v-if="day.isToday" class="badge">Today</span>
        </header>
        <p class="planned">
          <RouterLink v-if="plan[day.key]" :to="{ name: 'recipe', params: { id: plan[day.key] } }">
            {{ recipeTitle(plan[day.key]) }}
          </RouterLink>
          <span v-else class="muted">Nothing planned</span>
        </p>
        <select
          :value="plan[day.key] ?? ''"
          :aria-label="`Dinner for ${day.weekday} ${day.date}`"
          @change="choose(day.key, ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Nothing planned</option>
          <option v-for="recipe in recipes" :key="recipe.id" :value="recipe.id">{{ recipe.title }}</option>
        </select>
      </li>
    </ol>
  </section>
</template>

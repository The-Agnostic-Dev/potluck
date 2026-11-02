<script setup lang="ts">
const servings = defineModel<number>({ required: true })

const props = withDefaults(defineProps<{ min?: number; max?: number }>(), {
  min: 1,
  max: 24,
})

function change(delta: number) {
  servings.value = Math.min(props.max, Math.max(props.min, servings.value + delta))
}
</script>

<template>
  <div class="stepper" role="group" aria-label="Servings">
    <button type="button" aria-label="Fewer servings" :disabled="servings <= min" @click="change(-1)">
      −
    </button>
    <output data-testid="servings">{{ servings }}</output>
    <button type="button" aria-label="More servings" :disabled="servings >= max" @click="change(1)">
      +
    </button>
  </div>
</template>

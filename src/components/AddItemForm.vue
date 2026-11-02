<script setup lang="ts">
import { ref } from 'vue'
import { useShoppingStore } from '@/stores/shopping'
import type { Unit } from '@/types'

const shopping = useShoppingStore()

const units: Unit[] = ['g', 'kg', 'ml', 'l', 'pcs']
const name = ref('')
const quantity = ref('1')
const unit = ref<Unit>('pcs')
const error = ref('')
const saving = ref(false)

async function submit() {
  error.value = ''
  const amount = Number(quantity.value)
  if (!name.value.trim()) {
    error.value = 'Please give the item a name.'
    return
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    error.value = 'Quantity must be a positive number.'
    return
  }
  saving.value = true
  try {
    await shopping.addItem(name.value, amount, unit.value)
    name.value = ''
    quantity.value = '1'
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="add-item" @submit.prevent="submit">
    <input v-model="name" aria-label="Item name" placeholder="Add an item, e.g. potatoes" />
    <input v-model="quantity" aria-label="Quantity" inputmode="decimal" class="qty" />
    <select v-model="unit" aria-label="Unit">
      <option v-for="option in units" :key="option" :value="option">{{ option }}</option>
    </select>
    <button type="submit" class="primary" :disabled="saving">Add</button>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AddItemForm from '@/components/AddItemForm.vue'
import { useShoppingStore } from '@/stores/shopping'
import { formatQuantity } from '@/utils/units'

const shopping = useShoppingStore()

const hasChecked = computed(() => shopping.items.some((item) => item.checked))

onMounted(() => {
  shopping.load()
})
</script>

<template>
  <section>
    <div class="page-head">
      <h1>Shopping list</h1>
      <p class="muted" data-testid="items-left">
        {{ shopping.remainingCount }} {{ shopping.remainingCount === 1 ? 'item' : 'items' }} left
      </p>
    </div>

    <AddItemForm />

    <p v-if="!shopping.loading && shopping.items.length === 0" class="empty">
      Your list is empty. Add items above or from any recipe.
    </p>

    <ul class="shopping card" data-testid="shopping-list">
      <li
        v-for="item in shopping.sortedItems"
        :key="item.id"
        :class="{ done: item.checked }"
        data-testid="shopping-item"
      >
        <label>
          <input type="checkbox" :checked="item.checked" @change="shopping.toggle(item)" />
          <span class="name">{{ item.name }}</span>
        </label>
        <span class="qty">{{ formatQuantity(item.quantity, item.unit) }}</span>
        <button type="button" class="link" :aria-label="`Remove ${item.name}`" @click="shopping.remove(item.id)">
          Remove
        </button>
      </li>
    </ul>

    <div class="actions">
      <button type="button" :disabled="!hasChecked" @click="shopping.clearChecked()">Clear ticked items</button>
    </div>
  </section>
</template>

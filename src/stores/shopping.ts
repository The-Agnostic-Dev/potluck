import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as api from '@/api'
import type { ShoppingItem, Unit } from '@/types'

export const useShoppingStore = defineStore('shopping', () => {
  const items = ref<ShoppingItem[]>([])
  const loading = ref(false)

  /** Unticked items first, then alphabetical, so the list reads like a trolley run. */
  const sortedItems = computed(() =>
    [...items.value].sort((a, b) => {
      if (a.checked !== b.checked) return a.checked ? 1 : -1
      return a.name.localeCompare(b.name)
    }),
  )

  const remainingCount = computed(() => items.value.filter((item) => !item.checked).length)

  async function load() {
    loading.value = true
    try {
      items.value = await api.fetchShoppingList()
    } finally {
      loading.value = false
    }
  }

  async function addItem(name: string, quantity: number, unit: Unit) {
    items.value = await api.addShoppingItem(name, quantity, unit)
  }

  async function addRecipe(recipeId: number, servings: number) {
    items.value = await api.addRecipeToList(recipeId, servings)
  }

  async function setChecked(id: number, checked: boolean) {
    const updated = await api.setItemChecked(id, checked)
    items.value = items.value.map((item) => (item.id === id ? updated : item))
  }

  function toggle(item: ShoppingItem) {
    return setChecked(item.id, !item.checked)
  }

  async function remove(id: number) {
    items.value = await api.deleteShoppingItem(id)
  }

  async function clearChecked() {
    items.value = await api.clearCheckedItems()
  }

  return {
    items,
    loading,
    sortedItems,
    remainingCount,
    load,
    addItem,
    addRecipe,
    setChecked,
    toggle,
    remove,
    clearChecked,
  }
})

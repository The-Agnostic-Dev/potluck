import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchFavourites, setFavourite } from '@/api'

export const useFavouritesStore = defineStore('favourites', () => {
  const ids = ref<number[]>([])
  const loaded = ref(false)

  const count = computed(() => ids.value.length)

  function isFavourite(id: number): boolean {
    return ids.value.includes(id)
  }

  async function load() {
    ids.value = await fetchFavourites()
    loaded.value = true
  }

  async function toggle(id: number) {
    ids.value = await setFavourite(id, !isFavourite(id))
  }

  return { ids, loaded, count, isFavourite, load, toggle }
})

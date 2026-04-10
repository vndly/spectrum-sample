<script setup lang="ts">
import { useFilters } from '@/application/use-filters'
import { useI18n } from 'vue-i18n'
import { X, ChevronDown } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'

const { filters, genres, clearAll } = useFilters()
const { t } = useI18n()

const isGenreOpen = ref(false)
const genreDropdownRef = ref<HTMLElement | null>(null)

/**
 * Toggles a genre ID in the filter state.
 */
function toggleGenre(id: number) {
  const index = filters.genres.indexOf(id)
  if (index === -1) {
    filters.genres.push(id)
  } else {
    filters.genres.splice(index, 1)
  }
}

/**
 * Closes the genre dropdown if clicking outside.
 */
function handleClickOutside(event: MouseEvent) {
  if (genreDropdownRef.value && !genreDropdownRef.value.contains(event.target as Node)) {
    isGenreOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-4 py-2">
    <!-- Genre Multi-Select -->
    <div ref="genreDropdownRef" class="relative">
      <button
        type="button"
        class="flex items-center gap-2 rounded-lg bg-surface px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-surface-hover"
        @click="isGenreOpen = !isGenreOpen"
      >
        <span>{{ t('home.filters.genre') }}</span>
        <span
          v-if="filters.genres.length > 0"
          class="flex size-5 items-center justify-center rounded-full bg-accent text-[10px]"
        >
          {{ filters.genres.length }}
        </span>
        <ChevronDown class="size-4 text-slate-400" />
      </button>

      <div
        v-if="isGenreOpen"
        class="absolute left-0 z-50 mt-2 max-h-64 w-56 overflow-y-auto rounded-lg border border-slate-700 bg-surface p-2 shadow-xl"
      >
        <div
          v-for="genre in genres"
          :key="genre.id"
          class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-slate-700"
          :class="{ 'bg-accent/20 text-accent': filters.genres.includes(genre.id) }"
          @click="toggleGenre(genre.id)"
        >
          <div
            class="size-4 rounded border border-slate-500"
            :class="{ 'bg-accent border-accent': filters.genres.includes(genre.id) }"
          >
            <svg
              v-if="filters.genres.includes(genre.id)"
              class="size-full text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span>{{ genre.name }}</span>
        </div>
      </div>
    </div>

    <!-- Media Type Toggle -->
    <div class="flex overflow-hidden rounded-lg bg-surface">
      <button
        v-for="type in ['all', 'movie', 'tv'] as const"
        :key="type"
        type="button"
        class="px-4 py-2 text-sm font-medium transition-colors"
        :class="[
          filters.mediaType === type
            ? 'bg-accent text-white'
            : 'text-slate-400 hover:text-white hover:bg-surface-hover',
        ]"
        @click="filters.mediaType = type"
      >
        {{ t(`home.filters.mediaType.${type}`) }}
      </button>
    </div>

    <!-- Year Range -->
    <div class="flex items-center gap-2">
      <input
        v-model.number="filters.yearFrom"
        type="number"
        :placeholder="t('home.filters.yearFrom')"
        class="w-24 rounded-lg bg-surface px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-accent focus:ring-2"
        min="1900"
        :max="new Date().getFullYear() + 5"
      />
      <span class="text-slate-500">-</span>
      <input
        v-model.number="filters.yearTo"
        type="number"
        :placeholder="t('home.filters.yearTo')"
        class="w-24 rounded-lg bg-surface px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-accent focus:ring-2"
        min="1900"
        :max="new Date().getFullYear() + 5"
      />
    </div>

    <!-- Clear All -->
    <button
      v-if="
        filters.genres.length > 0 ||
        filters.mediaType !== 'all' ||
        filters.yearFrom ||
        filters.yearTo
      "
      type="button"
      class="ml-auto flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-accent"
      @click="clearAll"
    >
      <X class="size-4" />
      <span>{{ t('home.filters.clear') }}</span>
    </button>
  </div>
</template>

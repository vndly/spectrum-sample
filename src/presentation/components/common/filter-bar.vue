<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { X, ChevronDown } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'

interface Genre {
  id: number
  name: string
}

interface CustomList {
  id: string
  name: string
}

interface FilterValues {
  genres: number[]
  mediaType: 'all' | 'movie' | 'tv'
  yearFrom?: number | null
  yearTo?: number | null
  ratingMin?: number
  ratingMax?: number
  status?: 'all' | 'watchlist' | 'watched' | 'none'
  listIds?: string[]
}

const props = defineProps<{
  genres: Genre[]
  lists?: CustomList[]
  modelValue: FilterValues
  activeFilterCount: number
  showGenre?: boolean
  showMediaType?: boolean
  showYearRange?: boolean
  showRatingRange?: boolean
  showWatchStatus?: boolean
  showCustomLists?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterValues): void
  (e: 'clear'): void
}>()

const { t } = useI18n()

const isGenreOpen = ref(false)
const genreDropdownRef = ref<HTMLElement | null>(null)

/**
 * Toggles a genre ID in the filter state.
 */
function toggleGenre(id: number) {
  const genres = [...props.modelValue.genres]
  const index = genres.indexOf(id)
  if (index === -1) {
    genres.push(id)
  } else {
    genres.splice(index, 1)
  }
  emit('update:modelValue', { ...props.modelValue, genres })
}

/**
 * Toggles a custom list ID in the filter state.
 */
function toggleList(id: string) {
  const listIds = [...(props.modelValue.listIds || [])]
  const index = listIds.indexOf(id)
  if (index === -1) {
    listIds.push(id)
  } else {
    listIds.splice(index, 1)
  }
  emit('update:modelValue', { ...props.modelValue, listIds })
}

/**
 * Closes the genre dropdown if clicking outside.
 */
function handleClickOutside(event: MouseEvent) {
  if (genreDropdownRef.value && !genreDropdownRef.value.contains(event.target as globalThis.Node)) {
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
    <div v-if="showGenre" ref="genreDropdownRef" class="relative">
      <button
        type="button"
        class="flex items-center gap-2 rounded-lg bg-surface px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-surface-hover"
        @click="isGenreOpen = !isGenreOpen"
      >
        <span>{{ t('home.filters.genre') }}</span>
        <span
          v-if="modelValue.genres.length > 0"
          class="flex size-5 items-center justify-center rounded-full bg-accent text-[10px]"
        >
          {{ modelValue.genres.length }}
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
          :class="{ 'bg-accent/20 text-accent': modelValue.genres.includes(genre.id) }"
          @click="toggleGenre(genre.id)"
        >
          <div
            class="size-4 rounded border border-slate-500"
            :class="{ 'bg-accent border-accent': modelValue.genres.includes(genre.id) }"
          >
            <svg
              v-if="modelValue.genres.includes(genre.id)"
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
    <div v-if="showMediaType" class="flex overflow-hidden rounded-lg bg-surface">
      <button
        v-for="type in ['all', 'movie', 'tv'] as const"
        :key="type"
        type="button"
        class="px-4 py-2 text-sm font-medium transition-colors"
        :class="[
          modelValue.mediaType === type
            ? 'bg-accent text-white'
            : 'text-slate-400 hover:text-white hover:bg-surface-hover',
        ]"
        @click="emit('update:modelValue', { ...modelValue, mediaType: type })"
      >
        {{ t(`home.filters.mediaType.${type}`) }}
      </button>
    </div>

    <!-- Year Range (Home Only) -->
    <div v-if="showYearRange" class="flex items-center gap-2">
      <input
        :value="modelValue.yearFrom"
        type="number"
        :placeholder="t('home.filters.yearFrom')"
        class="w-24 rounded-lg bg-surface px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-accent focus:ring-2"
        min="1900"
        :max="new Date().getFullYear() + 5"
        @input="
          (e) =>
            emit('update:modelValue', {
              ...modelValue,
              yearFrom: (e.target as HTMLInputElement).valueAsNumber,
            })
        "
      />
      <span class="text-slate-500">-</span>
      <input
        :value="modelValue.yearTo"
        type="number"
        :placeholder="t('home.filters.yearTo')"
        class="w-24 rounded-lg bg-surface px-3 py-2 text-sm text-white placeholder-slate-500 outline-none ring-accent focus:ring-2"
        min="1900"
        :max="new Date().getFullYear() + 5"
        @input="
          (e) =>
            emit('update:modelValue', {
              ...modelValue,
              yearTo: (e.target as HTMLInputElement).valueAsNumber,
            })
        "
      />
    </div>

    <!-- Rating Range (Library Only) -->
    <div v-if="showRatingRange" class="flex items-center gap-2">
      <span class="text-xs font-medium text-slate-400">{{ t('library.filters.rating') }}</span>
      <input
        :value="modelValue.ratingMin"
        type="number"
        step="0.5"
        min="0"
        max="5"
        class="w-16 rounded-lg bg-surface px-3 py-2 text-sm text-white outline-none ring-accent focus:ring-2"
        @input="
          (e) =>
            emit('update:modelValue', {
              ...modelValue,
              ratingMin: parseFloat((e.target as HTMLInputElement).value),
            })
        "
      />
      <span class="text-slate-500">-</span>
      <input
        :value="modelValue.ratingMax"
        type="number"
        step="0.5"
        min="0"
        max="5"
        class="w-16 rounded-lg bg-surface px-3 py-2 text-sm text-white outline-none ring-accent focus:ring-2"
        @input="
          (e) =>
            emit('update:modelValue', {
              ...modelValue,
              ratingMax: parseFloat((e.target as HTMLInputElement).value),
            })
        "
      />
    </div>

    <!-- Watch Status (Library Lists View Only) -->
    <div v-if="showWatchStatus" class="flex overflow-hidden rounded-lg bg-surface">
      <button
        v-for="status in ['all', 'watchlist', 'watched', 'none'] as const"
        :key="status"
        type="button"
        class="px-4 py-2 text-sm font-medium transition-colors"
        :class="[
          modelValue.status === status
            ? 'bg-accent text-white'
            : 'text-slate-400 hover:text-white hover:bg-surface-hover',
        ]"
        @click="emit('update:modelValue', { ...modelValue, status })"
      >
        {{ t(`library.filters.status.${status}`) }}
      </button>
    </div>

    <!-- Custom Lists Multi-Select (Library Watchlist/Watched Tabs Only) -->
    <div v-if="showCustomLists && lists" class="flex flex-wrap gap-2">
      <button
        v-for="list in lists"
        :key="list.id"
        class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
        :class="
          modelValue.listIds?.includes(list.id)
            ? 'bg-accent text-white'
            : 'bg-surface text-slate-400 hover:text-white'
        "
        @click="toggleList(list.id)"
      >
        {{ list.name }}
      </button>
    </div>

    <!-- Clear All -->
    <button
      v-if="activeFilterCount > 0"
      type="button"
      class="ml-auto flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-accent"
      @click="emit('clear')"
    >
      <X class="size-4" />
      <span>{{ t('home.filters.clear') }}</span>
    </button>
  </div>
</template>

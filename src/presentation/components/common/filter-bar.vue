<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { X, ChevronDown, Minus, Plus } from 'lucide-vue-next'
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
const MIN_YEAR = 1900
const MAX_YEAR = new Date().getFullYear() + 5

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

/**
 * Emits a normalized year value for the requested field.
 */
function updateYear(
  field: 'yearFrom' | 'yearTo',
  rawValue: number | null,
  options: { clamp?: boolean } = {},
) {
  const { clamp = true } = options
  const nextValue =
    rawValue === null || Number.isNaN(rawValue)
      ? null
      : clamp
        ? Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(rawValue)))
        : Math.round(rawValue)

  emit('update:modelValue', {
    ...props.modelValue,
    [field]: nextValue,
  })
}

/**
 * Handles direct typing into a year field.
 */
function handleYearInput(field: 'yearFrom' | 'yearTo', event: Event) {
  const input = event.target as HTMLInputElement
  updateYear(field, input.value === '' ? null : input.valueAsNumber, { clamp: false })
}

/**
 * Steps a year field up or down using the custom controls.
 */
function stepYear(field: 'yearFrom' | 'yearTo', delta: -1 | 1) {
  const currentValue = props.modelValue[field]
  const baseYear =
    currentValue === null || currentValue === undefined || Number.isNaN(currentValue)
      ? new Date().getFullYear()
      : currentValue

  updateYear(field, baseYear + delta)
}

/**
 * Returns the translated label for a year field.
 */
function getYearLabel(field: 'yearFrom' | 'yearTo') {
  return t(field === 'yearFrom' ? 'home.filters.yearFrom' : 'home.filters.yearTo')
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
        data-testid="genre-dropdown-menu"
        class="absolute left-0 z-50 mt-2 max-h-64 w-56 overflow-y-auto rounded-lg border border-slate-700 bg-surface p-2 shadow-xl [scrollbar-width:thin] [scrollbar-color:#14b8a6_#1e293b] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-teal-500/70 hover:[&::-webkit-scrollbar-thumb]:bg-teal-400"
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
      <div
        data-testid="year-from-control"
        class="flex items-center overflow-hidden rounded-lg border border-slate-700 bg-surface shadow-lg shadow-black/10"
      >
        <button
          data-testid="year-from-decrement"
          type="button"
          :aria-label="t('home.filters.year.decrement', { label: getYearLabel('yearFrom') })"
          class="flex size-10 items-center justify-center text-slate-300 transition-colors hover:bg-surface-hover hover:text-white"
          @click="stepYear('yearFrom', -1)"
        >
          <Minus class="size-4" />
        </button>
        <input
          data-testid="year-from-input"
          :value="modelValue.yearFrom ?? ''"
          type="number"
          :placeholder="t('home.filters.yearFrom')"
          class="w-20 border-x border-slate-700 bg-transparent px-2 py-2 text-center text-sm text-white placeholder-slate-500 outline-none ring-accent [appearance:textfield] focus:ring-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          :min="MIN_YEAR"
          :max="MAX_YEAR"
          @input="handleYearInput('yearFrom', $event)"
        />
        <button
          data-testid="year-from-increment"
          type="button"
          :aria-label="t('home.filters.year.increment', { label: getYearLabel('yearFrom') })"
          class="flex size-10 items-center justify-center text-slate-300 transition-colors hover:bg-surface-hover hover:text-white"
          @click="stepYear('yearFrom', 1)"
        >
          <Plus class="size-4" />
        </button>
      </div>
      <span class="text-slate-500">-</span>
      <div
        data-testid="year-to-control"
        class="flex items-center overflow-hidden rounded-lg border border-slate-700 bg-surface shadow-lg shadow-black/10"
      >
        <button
          data-testid="year-to-decrement"
          type="button"
          :aria-label="t('home.filters.year.decrement', { label: getYearLabel('yearTo') })"
          class="flex size-10 items-center justify-center text-slate-300 transition-colors hover:bg-surface-hover hover:text-white"
          @click="stepYear('yearTo', -1)"
        >
          <Minus class="size-4" />
        </button>
        <input
          data-testid="year-to-input"
          :value="modelValue.yearTo ?? ''"
          type="number"
          :placeholder="t('home.filters.yearTo')"
          class="w-20 border-x border-slate-700 bg-transparent px-2 py-2 text-center text-sm text-white placeholder-slate-500 outline-none ring-accent [appearance:textfield] focus:ring-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          :min="MIN_YEAR"
          :max="MAX_YEAR"
          @input="handleYearInput('yearTo', $event)"
        />
        <button
          data-testid="year-to-increment"
          type="button"
          :aria-label="t('home.filters.year.increment', { label: getYearLabel('yearTo') })"
          class="flex size-10 items-center justify-center text-slate-300 transition-colors hover:bg-surface-hover hover:text-white"
          @click="stepYear('yearTo', 1)"
        >
          <Plus class="size-4" />
        </button>
      </div>
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
      class="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-700 bg-surface px-4 py-2 text-sm font-medium text-white shadow-lg shadow-black/10 transition-colors hover:border-teal-500/60 hover:bg-surface-hover"
      @click="emit('clear')"
    >
      <X class="size-4 text-teal-400" />
      <span>{{ t('home.filters.clear') }}</span>
    </button>
  </div>
</template>

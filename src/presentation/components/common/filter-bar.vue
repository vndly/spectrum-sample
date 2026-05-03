<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { X, ChevronDown, Minus, Plus } from 'lucide-vue-next'
import { computed, nextTick, ref, onMounted, onUnmounted, watch } from 'vue'

interface Genre {
  id: number
  name: string
}

interface FilterValues {
  genres: number[]
  mediaType: 'all' | 'movie' | 'tv'
  yearFrom?: number | null
  yearTo?: number | null
  ratingMin?: number
  ratingMax?: number
}

const props = defineProps<{
  genres: Genre[]
  modelValue: FilterValues
  activeFilterCount: number
  showGenre?: boolean
  showMediaType?: boolean
  showYearRange?: boolean
  showRatingRange?: boolean
  compactClear?: boolean
  hideClear?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FilterValues): void
  (e: 'clear'): void
}>()

const { t } = useI18n()

const isGenreOpen = ref(false)
const genreSearch = ref('')
const genreFilterInputRef = ref<HTMLInputElement | null>(null)
const genreDropdownRef = ref<HTMLElement | null>(null)
const MIN_YEAR = 1900
const MAX_YEAR = new Date().getFullYear() + 5
const MIN_RATING = 0
const MAX_RATING = 5
const RATING_STEP = 0.5

type RatingField = 'ratingMin' | 'ratingMax'

const filteredGenres = computed(() => {
  const query = genreSearch.value.trim().toLocaleLowerCase()
  if (!query) return props.genres

  return props.genres.filter((genre) => genre.name.toLocaleLowerCase().includes(query))
})

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

function clearGenres() {
  emit('update:modelValue', { ...props.modelValue, genres: [] })
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

/**
 * Emits a normalized rating value for the requested field.
 */
function updateRating(field: RatingField, rawValue: number | null) {
  const fallback = field === 'ratingMin' ? MIN_RATING : MAX_RATING
  const roundedValue =
    rawValue === null || Number.isNaN(rawValue)
      ? fallback
      : Math.round(rawValue / RATING_STEP) * RATING_STEP
  const nextValue = Math.min(MAX_RATING, Math.max(MIN_RATING, roundedValue))

  emit('update:modelValue', {
    ...props.modelValue,
    [field]: nextValue,
  })
}

/**
 * Handles direct typing into a rating field.
 */
function handleRatingInput(field: RatingField, event: Event) {
  const input = event.target as HTMLInputElement
  updateRating(field, input.value === '' ? null : input.valueAsNumber)
}

/**
 * Steps a rating field up or down using the custom controls.
 */
function stepRating(field: RatingField, delta: -1 | 1) {
  const currentValue = props.modelValue[field]
  const fallback = field === 'ratingMin' ? MIN_RATING : MAX_RATING
  const baseRating =
    currentValue === null || currentValue === undefined || Number.isNaN(currentValue)
      ? fallback
      : currentValue

  updateRating(field, baseRating + RATING_STEP * delta)
}

/**
 * Returns the translated label for a rating field.
 */
function getRatingLabel(field: RatingField) {
  return t(field === 'ratingMin' ? 'library.filters.ratingMin' : 'library.filters.ratingMax')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(isGenreOpen, async (open) => {
  if (open) {
    await nextTick()
    genreFilterInputRef.value?.focus()
    return
  }

  genreSearch.value = ''
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-4 py-2">
    <!-- Genre Multi-Select -->
    <div v-if="showGenre" ref="genreDropdownRef" class="relative">
      <button
        type="button"
        class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-950 shadow-sm transition-colors hover:bg-slate-100 dark:border-transparent dark:bg-slate-800 dark:text-white dark:shadow-none dark:hover:bg-slate-700"
        @click="isGenreOpen = !isGenreOpen"
      >
        <span>{{ t('home.filters.genre') }}</span>
        <span
          v-if="modelValue.genres.length > 0"
          class="flex size-5 items-center justify-center rounded-full bg-accent text-[10px]"
        >
          {{ modelValue.genres.length }}
        </span>
        <ChevronDown class="size-4 text-slate-500 dark:text-slate-400" />
      </button>

      <div
        v-if="isGenreOpen"
        class="absolute left-0 z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800"
      >
        <div class="flex items-center gap-2">
          <input
            ref="genreFilterInputRef"
            v-model="genreSearch"
            data-testid="genre-filter-input"
            type="text"
            :placeholder="t('home.filters.genreSearch')"
            class="min-w-0 flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-950 placeholder-slate-500 outline-none ring-accent transition focus:border-teal-500/60 focus:ring-2 dark:border-slate-700 dark:bg-slate-900/80 dark:text-white"
          />
          <button
            v-if="modelValue.genres.length > 0"
            data-testid="genre-clear-button"
            type="button"
            class="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-slate-200 px-2.5 text-xs font-medium text-slate-700 transition-colors hover:border-teal-500/60 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
            @click="clearGenres"
          >
            <X class="size-3.5 text-teal-400" />
            <span>{{ t('home.filters.genreClear') }}</span>
          </button>
        </div>

        <div
          data-testid="genre-dropdown-menu"
          class="mt-2 max-h-52 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#14b8a6_#e2e8f0] dark:[scrollbar-color:#14b8a6_#1e293b] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-200 dark:[&::-webkit-scrollbar-track]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-teal-500/70 hover:[&::-webkit-scrollbar-thumb]:bg-teal-400"
        >
          <div
            v-for="genre in filteredGenres"
            :key="genre.id"
            data-testid="genre-option"
            class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
            :class="{
              'bg-accent/15 text-teal-700 dark:bg-accent/20 dark:text-accent':
                modelValue.genres.includes(genre.id),
            }"
            @click="toggleGenre(genre.id)"
          >
            <div
              class="size-4 rounded border border-slate-400 dark:border-slate-500"
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
    </div>

    <!-- Media Type Toggle -->
    <div
      v-if="showMediaType"
      class="flex overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-transparent dark:bg-slate-800 dark:shadow-none"
    >
      <button
        v-for="type in ['all', 'movie', 'tv'] as const"
        :key="type"
        type="button"
        class="px-4 py-2 text-sm font-medium transition-colors"
        :class="[
          modelValue.mediaType === type
            ? 'bg-accent text-white'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white',
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
        class="flex h-9 items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-transparent dark:bg-slate-800 dark:shadow-none"
      >
        <button
          data-testid="year-from-decrement"
          type="button"
          :aria-label="t('home.filters.year.decrement', { label: getYearLabel('yearFrom') })"
          class="flex h-full w-9 items-center justify-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          @click="stepYear('yearFrom', -1)"
        >
          <Minus class="size-4" />
        </button>
        <input
          data-testid="year-from-input"
          :value="modelValue.yearFrom ?? ''"
          type="number"
          :placeholder="t('home.filters.yearFrom')"
          class="h-full w-16 border-x border-slate-200 bg-transparent px-2 text-center text-sm text-slate-950 placeholder-slate-500 outline-none ring-accent [appearance:textfield] focus:ring-2 dark:border-slate-700 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          :min="MIN_YEAR"
          :max="MAX_YEAR"
          @input="handleYearInput('yearFrom', $event)"
        />
        <button
          data-testid="year-from-increment"
          type="button"
          :aria-label="t('home.filters.year.increment', { label: getYearLabel('yearFrom') })"
          class="flex h-full w-9 items-center justify-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          @click="stepYear('yearFrom', 1)"
        >
          <Plus class="size-4" />
        </button>
      </div>
      <span class="text-slate-400 dark:text-slate-500">-</span>
      <div
        data-testid="year-to-control"
        class="flex h-9 items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-transparent dark:bg-slate-800 dark:shadow-none"
      >
        <button
          data-testid="year-to-decrement"
          type="button"
          :aria-label="t('home.filters.year.decrement', { label: getYearLabel('yearTo') })"
          class="flex h-full w-9 items-center justify-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          @click="stepYear('yearTo', -1)"
        >
          <Minus class="size-4" />
        </button>
        <input
          data-testid="year-to-input"
          :value="modelValue.yearTo ?? ''"
          type="number"
          :placeholder="t('home.filters.yearTo')"
          class="h-full w-16 border-x border-slate-200 bg-transparent px-2 text-center text-sm text-slate-950 placeholder-slate-500 outline-none ring-accent [appearance:textfield] focus:ring-2 dark:border-slate-700 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          :min="MIN_YEAR"
          :max="MAX_YEAR"
          @input="handleYearInput('yearTo', $event)"
        />
        <button
          data-testid="year-to-increment"
          type="button"
          :aria-label="t('home.filters.year.increment', { label: getYearLabel('yearTo') })"
          class="flex h-full w-9 items-center justify-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          @click="stepYear('yearTo', 1)"
        >
          <Plus class="size-4" />
        </button>
      </div>
    </div>

    <!-- Rating Range (Library Only) -->
    <div v-if="showRatingRange" class="flex items-center gap-2">
      <span class="text-xs font-medium text-slate-600 dark:text-slate-400">
        {{ t('library.filters.rating') }}
      </span>
      <div
        data-testid="rating-min-control"
        class="flex h-9 items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-transparent dark:bg-slate-800 dark:shadow-none"
      >
        <button
          data-testid="rating-min-decrement"
          type="button"
          :aria-label="t('home.filters.year.decrement', { label: getRatingLabel('ratingMin') })"
          class="flex h-full w-9 items-center justify-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          @click="stepRating('ratingMin', -1)"
        >
          <Minus class="size-4" />
        </button>
        <input
          data-testid="rating-min-input"
          :value="modelValue.ratingMin"
          type="number"
          step="0.5"
          :min="MIN_RATING"
          :max="MAX_RATING"
          class="h-full w-12 border-x border-slate-200 bg-transparent px-2 text-center text-sm text-slate-950 placeholder-slate-500 outline-none ring-accent [appearance:textfield] focus:ring-2 dark:border-slate-700 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          @input="handleRatingInput('ratingMin', $event)"
        />
        <button
          data-testid="rating-min-increment"
          type="button"
          :aria-label="t('home.filters.year.increment', { label: getRatingLabel('ratingMin') })"
          class="flex h-full w-9 items-center justify-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          @click="stepRating('ratingMin', 1)"
        >
          <Plus class="size-4" />
        </button>
      </div>
      <span class="text-slate-400 dark:text-slate-500">-</span>
      <div
        data-testid="rating-max-control"
        class="flex h-9 items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-transparent dark:bg-slate-800 dark:shadow-none"
      >
        <button
          data-testid="rating-max-decrement"
          type="button"
          :aria-label="t('home.filters.year.decrement', { label: getRatingLabel('ratingMax') })"
          class="flex h-full w-9 items-center justify-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          @click="stepRating('ratingMax', -1)"
        >
          <Minus class="size-4" />
        </button>
        <input
          data-testid="rating-max-input"
          :value="modelValue.ratingMax"
          type="number"
          step="0.5"
          :min="MIN_RATING"
          :max="MAX_RATING"
          class="h-full w-12 border-x border-slate-200 bg-transparent px-2 text-center text-sm text-slate-950 placeholder-slate-500 outline-none ring-accent [appearance:textfield] focus:ring-2 dark:border-slate-700 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          @input="handleRatingInput('ratingMax', $event)"
        />
        <button
          data-testid="rating-max-increment"
          type="button"
          :aria-label="t('home.filters.year.increment', { label: getRatingLabel('ratingMax') })"
          class="flex h-full w-9 items-center justify-center text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          @click="stepRating('ratingMax', 1)"
        >
          <Plus class="size-4" />
        </button>
      </div>
    </div>

    <!-- Clear All -->
    <button
      v-if="!hideClear && activeFilterCount > 0"
      type="button"
      class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white font-medium text-slate-950 shadow-sm transition-colors hover:border-teal-500/60 hover:bg-slate-100 dark:border-transparent dark:bg-slate-800 dark:text-white dark:shadow-none dark:hover:bg-slate-700"
      :class="compactClear ? 'h-8 px-3 text-xs' : 'ml-auto px-4 py-2 text-sm'"
      @click="emit('clear')"
    >
      <X class="text-teal-400" :class="compactClear ? 'size-3.5' : 'size-4'" />
      <span>{{ t('home.filters.clear') }}</span>
    </button>
  </div>
</template>

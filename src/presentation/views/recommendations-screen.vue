<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRecommendations } from '@/application/use-recommendations'
import { useRecommendationFilters } from '@/application/use-recommendation-filters'
import { useGenres } from '@/application/use-genres'
import { useSettings } from '@/application/use-settings'
import { filterResults } from '@/domain/filter.logic'
import FilterBar from '@/presentation/components/common/filter-bar.vue'
import RecommendationCarousel from '@/presentation/components/recommendations/RecommendationCarousel.vue'

const { t } = useI18n()
const { sections, loading, fetchSection } = useRecommendations()
const { filters, activeFilterCount, clearFilters } = useRecommendationFilters()
const { genres, fetchGenres } = useGenres()
const { language } = useSettings()

onMounted(() => {
  fetchGenres(language.value)
})

/**
 * Sections with filtered results, preserving original index for intersection handling.
 */
const filteredSections = computed(() =>
  sections.value.map((section, originalIndex) => ({
    ...section,
    originalIndex,
    filteredResults: filterResults(section.results, filters.value),
  })),
)

/**
 * Sections that have at least one result after filtering.
 * Empty sections are hidden from view.
 */
const visibleSections = computed(() =>
  filteredSections.value.filter(
    (section) =>
      section.filteredResults.length > 0 || section.loading || !section.fetched || section.error,
  ),
)

/**
 * True when all sections have been fetched but all are empty after filtering.
 */
const allSectionsEmpty = computed(() => {
  const allFetched = sections.value.every((s) => s.fetched)
  if (!allFetched) return false
  return filteredSections.value.every((s) => s.filteredResults.length === 0)
})

function handleIntersect(originalIndex: number) {
  fetchSection(originalIndex)
}
</script>

<template>
  <div class="space-y-8 px-2 pb-8 pt-2 md:px-3 md:pb-10">
    <header class="space-y-2">
      <h2 class="text-2xl font-bold text-slate-950 dark:text-white">
        {{ t('recommendations.title') }}
      </h2>
    </header>

    <div class="sticky top-0 z-20 -mx-2 bg-background px-2 md:-mx-3 md:px-3">
      <FilterBar
        v-model="filters"
        :genres="genres"
        :active-filter-count="activeFilterCount"
        show-genre
        show-media-type
        @clear="clearFilters"
      />
    </div>

    <div v-if="loading" class="space-y-10">
      <div v-for="n in 3" :key="n" class="space-y-4">
        <div class="h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-surface"></div>
        <div class="flex gap-4 overflow-hidden">
          <div
            v-for="i in 6"
            :key="i"
            class="aspect-[2/3] w-32 md:w-40 flex-shrink-0 animate-pulse rounded-lg bg-slate-200 dark:bg-surface"
          ></div>
        </div>
      </div>
    </div>

    <div v-else-if="allSectionsEmpty && activeFilterCount > 0" class="py-16 text-center">
      <p class="text-slate-500 dark:text-slate-400">
        {{ t('recommendations.noFilterResults') }}
      </p>
      <button
        type="button"
        class="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
        @click="clearFilters"
      >
        {{ t('home.filters.clear') }}
      </button>
    </div>

    <div v-else class="space-y-10">
      <RecommendationCarousel
        v-for="section in visibleSections"
        :key="section.seed ? `seed-${section.seed.id}` : section.titleKey"
        :title-key="section.titleKey!"
        :title-params="section.titleParams"
        :items="section.filteredResults"
        :loading="section.loading"
        :error="section.error"
        :fetched="section.fetched"
        @intersect="handleIntersect(section.originalIndex)"
      />
    </div>
  </div>
</template>

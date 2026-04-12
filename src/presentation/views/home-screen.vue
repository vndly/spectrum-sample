<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AlertCircle } from 'lucide-vue-next'
import { useSearch } from '@/application/use-search'
import { useBrowse, type MediaResult } from '@/application/use-browse'
import { useFilters } from '@/application/use-filters'
import { useSettings } from '@/application/use-settings'
import { filterResults } from '@/domain/filter.logic'
import SearchBar from '@/presentation/components/home/search-bar.vue'
import FilterBar from '@/presentation/components/home/filter-bar.vue'
import ViewToggle from '@/presentation/components/home/view-toggle.vue'
import SearchResults from '@/presentation/components/home/search-results.vue'
import TrendingCarousel from '@/presentation/components/home/trending-carousel.vue'
import PopularGrid from '@/presentation/components/home/popular-grid.vue'

const { t } = useI18n()
const {
  query,
  results,
  loading: searchLoading,
  error: searchError,
  isSearchMode,
  retry: retrySearch,
} = useSearch()
const {
  trending,
  popularMovies,
  popularShows,
  loading: browseLoading,
  error: browseError,
  retry: retryBrowse,
} = useBrowse()

const { filters, clearAll } = useFilters()
const { layoutMode } = useSettings()

/** Filtered trending results. */
const filteredTrending = computed(
  () => filterResults(trending.value, filters.value) as MediaResult[],
)

/** Filtered popular movies. */
const filteredPopularMovies = computed(
  () => filterResults(popularMovies.value, filters.value) as MediaResult[],
)

/** Filtered popular shows. */
const filteredPopularShows = computed(
  () => filterResults(popularShows.value, filters.value) as MediaResult[],
)

/** Reset filters when entering search mode. */
watch(query, (newQuery) => {
  if (newQuery.trim().length > 0) {
    clearAll()
  }
})

/**
 * Handles retry event from SearchResults.
 */
function handleSearchRetry() {
  retrySearch()
}

/**
 * Handles retry event from Browse error state.
 */
function handleBrowseRetry() {
  retryBrowse()
}
</script>

<template>
  <div class="space-y-8">
    <!-- Search and Filters Section -->
    <div class="sticky top-0 z-40 space-y-4 bg-background pb-2">
      <SearchBar v-model="query" />

      <div v-if="!isSearchMode" class="flex flex-col gap-2 md:flex-row md:items-center">
        <FilterBar class="flex-1" />
        <ViewToggle class="self-end md:self-auto" />
      </div>
    </div>

    <!-- Search Mode: Show results -->
    <SearchResults
      v-if="isSearchMode"
      :results="results"
      :loading="searchLoading"
      :error="searchError"
      :query="query"
      @retry="handleSearchRetry"
    />

    <!-- Browse Mode: Show trending and popular -->
    <div v-else data-testid="browse-sections" class="space-y-10">
      <!-- Error state for browse -->
      <div
        v-if="browseError"
        data-testid="browse-error"
        class="flex flex-col items-center gap-4 py-8"
      >
        <AlertCircle class="size-8 text-red-500" aria-hidden="true" />
        <p class="text-red-500">{{ t('home.browse.error.message') }}</p>
        <button
          class="cursor-pointer rounded-md bg-accent px-4 py-2 text-white transition-colors hover:bg-accent/80"
          @click="handleBrowseRetry"
        >
          {{ t('home.browse.error.retry') }}
        </button>
      </div>

      <template v-else>
        <!-- Trending Section -->
        <TrendingCarousel
          v-if="browseLoading || filteredTrending.length > 0"
          :items="filteredTrending"
          :loading="browseLoading"
        />

        <!-- Popular Movies -->
        <PopularGrid
          v-if="browseLoading || filteredPopularMovies.length > 0"
          :title="t('home.browse.popularMovies')"
          :items="filteredPopularMovies"
          :loading="browseLoading"
          :variant="layoutMode"
        />

        <!-- Popular Shows -->
        <PopularGrid
          v-if="browseLoading || filteredPopularShows.length > 0"
          :title="t('home.browse.popularShows')"
          :items="filteredPopularShows"
          :loading="browseLoading"
          :variant="layoutMode"
        />

        <!-- Empty state when filters return nothing -->
        <div
          v-if="
            !browseLoading &&
            filteredTrending.length === 0 &&
            filteredPopularMovies.length === 0 &&
            filteredPopularShows.length === 0
          "
          class="flex flex-col items-center gap-2 py-20 text-slate-400"
        >
          <p class="text-lg font-medium text-white">{{ t('home.search.empty.title') }}</p>
          <p>{{ t('home.search.empty.subtitle') }}</p>
          <button class="mt-4 text-accent hover:underline font-medium" @click="clearAll">
            {{ t('home.filters.clear') }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

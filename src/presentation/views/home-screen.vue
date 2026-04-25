<script setup lang="ts">
import { computed, nextTick, onActivated } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { AlertCircle } from 'lucide-vue-next'
import { useSearch } from '@/application/use-search'
import { useBrowse, type MediaResult } from '@/application/use-browse'
import { useFilters } from '@/application/use-filters'
import { filterResults } from '@/domain/filter.logic'
import SearchBar from '@/presentation/components/home/search-bar.vue'
import FilterBar from '@/presentation/components/home/filter-bar.vue'
import SearchResults from '@/presentation/components/home/search-results.vue'
import TrendingCarousel from '@/presentation/components/home/trending-carousel.vue'
import PopularGrid from '@/presentation/components/home/popular-grid.vue'

defineOptions({
  name: 'HomeScreen',
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const {
  query,
  results,
  loading: searchLoading,
  error: searchError,
  hasSearched,
  isSearchMode,
  retry: retrySearch,
  clear: clearSearch,
} = useSearch()
const {
  trending,
  popularMovies,
  popularShows,
  loading: browseLoading,
  error: browseError,
  retry: retryBrowse,
} = useBrowse()

const { filters, clearAll: clearFilters } = useFilters()

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

/** Filtered search results (persons excluded by filterResults). */
const filteredSearchResults = computed(
  () => filterResults(results.value, filters.value) as MediaResult[],
)

/**
 * Clears all filters and search input.
 */
function clearAll() {
  clearFilters()
  clearSearch()
}

/**
 * Reset state when navigating from sidebar (detected via reset query param).
 */
onActivated(async () => {
  if (route.query.reset) {
    clearAll()
    await nextTick()
    router.replace({ query: {} })
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
  <div class="space-y-8 px-2 pb-8 pt-2 md:px-3 md:pb-10">
    <!-- Search and Filters Section -->
    <div class="sticky top-0 z-40 space-y-4 bg-slate-50 pb-2 dark:bg-bg-primary">
      <SearchBar v-model="query" autofocus />

      <FilterBar />
    </div>

    <!-- Search Mode: Show results -->
    <SearchResults
      v-if="isSearchMode"
      :results="filteredSearchResults"
      :loading="searchLoading"
      :error="searchError"
      :has-searched="hasSearched"
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
          variant="grid"
        />

        <!-- Popular Shows -->
        <PopularGrid
          v-if="browseLoading || filteredPopularShows.length > 0"
          :title="t('home.browse.popularShows')"
          :items="filteredPopularShows"
          :loading="browseLoading"
          variant="grid"
        />

        <!-- Empty state when filters return nothing -->
        <div
          v-if="
            !browseLoading &&
            filteredTrending.length === 0 &&
            filteredPopularMovies.length === 0 &&
            filteredPopularShows.length === 0
          "
          class="flex flex-col items-center gap-2 py-20 text-slate-600 dark:text-slate-400"
        >
          <p class="text-lg font-medium text-slate-950 dark:text-white">
            {{ t('home.search.empty.title') }}
          </p>
          <p>{{ t('home.search.empty.subtitle') }}</p>
          <button class="mt-4 text-accent hover:underline font-medium" @click="clearAll">
            {{ t('home.filters.clear') }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

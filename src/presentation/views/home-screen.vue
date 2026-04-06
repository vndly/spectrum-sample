<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { AlertCircle } from 'lucide-vue-next'
import { useSearch } from '@/application/use-search'
import { useBrowse } from '@/application/use-browse'
import SearchBar from '@/presentation/components/home/search-bar.vue'
import SearchResults from '@/presentation/components/home/search-results.vue'
import TrendingCarousel from '@/presentation/components/home/trending-carousel.vue'
import PopularGrid from '@/presentation/components/home/popular-grid.vue'

const { t } = useI18n()
const { query, results, loading: searchLoading, error: searchError, isSearchMode, retry: retrySearch } = useSearch()
const {
  trending,
  popularMovies,
  popularShows,
  loading: browseLoading,
  error: browseError,
  retry: retryBrowse,
} = useBrowse()

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
    <!-- Search Bar -->
    <SearchBar v-model="query" />

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
        <TrendingCarousel :items="trending" :loading="browseLoading" />

        <!-- Popular Movies -->
        <PopularGrid
          :title="t('home.browse.popularMovies')"
          :items="popularMovies"
          :loading="browseLoading"
        />

        <!-- Popular Shows -->
        <PopularGrid
          :title="t('home.browse.popularShows')"
          :items="popularShows"
          :loading="browseLoading"
        />
      </template>
    </div>
  </div>
</template>

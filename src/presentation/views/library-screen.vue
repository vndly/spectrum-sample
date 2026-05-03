<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Bookmark, Eye, Search } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useLibraryEntries } from '@/application/use-library-entries'
import { useLibraryFilters } from '@/application/use-library-filters'
import { useSort } from '@/application/use-sort'
import { useGenres } from '@/application/use-genres'
import { useSettings } from '@/application/use-settings'
import { useLibrarySearch } from '@/application/use-library-search'
import TabToggle from '@/presentation/components/common/tab-toggle.vue'
import EntryGrid from '@/presentation/components/common/entry-grid.vue'
import EmptyState from '@/presentation/components/common/empty-state.vue'
import FilterBar from '@/presentation/components/common/filter-bar.vue'
import SortDropdown from '@/presentation/components/common/sort-dropdown.vue'
import SearchBar from '@/presentation/components/common/search-bar.vue'

const { t } = useI18n()
const { filters, activeFilterCount, clearFilters } = useLibraryFilters()
const { sortField, sortOrder } = useSort()
const { query, appliedQuery, hasSearchQuery, clearSearch } = useLibrarySearch()
const { entries, allEntries } = useLibraryEntries(filters, sortField, sortOrder, appliedQuery)
const { genres, fetchGenres } = useGenres()
const { language } = useSettings()

type TabId = 'watchlist' | 'watched'
const activeTab = ref<TabId>('watchlist')

const tabs = computed(() => [
  { id: 'watchlist', label: t('library.tabs.watchlist') },
  { id: 'watched', label: t('library.tabs.watched') },
])

/**
 * Computed entries based on active tab and selected list.
 */
const filteredEntries = computed(() => {
  if (activeTab.value === 'watchlist') {
    return entries.value.filter((e) => e.status === 'watchlist')
  }

  return entries.value.filter((e) => e.status === 'watched')
})

/**
 * Checks if the current base scope (tab/list) is empty before filters are applied.
 */
const isBaseScopeEmpty = computed(() => {
  const allData = allEntries.value // Use already fetched entries
  if (activeTab.value === 'watchlist') {
    return !allData.some((e) => e.status === 'watchlist')
  }

  return !allData.some((e) => e.status === 'watched')
})

/**
 * Empty state titles and descriptions.
 */
const emptyStateInfo = computed(() => {
  if (isBaseScopeEmpty.value) {
    if (activeTab.value === 'watchlist') {
      return {
        icon: Bookmark,
        title: t('library.empty.watchlist.title'),
        description: t('library.empty.watchlist.description'),
      }
    }
    return {
      icon: Eye,
      title: t('library.empty.watched.title'),
      description: t('library.empty.watched.description'),
    }
  }

  // Filtered/Searched empty state
  return {
    icon: Search,
    title: t('library.empty.filtered.title'),
    description: t('library.empty.filtered.description'),
  }
})

/**
 * CTA button text for filtered empty state.
 */
const emptyStateCta = computed(() => {
  if (hasSearchQuery.value && activeFilterCount.value > 0) {
    return t('library.search.clearAll')
  }
  if (hasSearchQuery.value) {
    return t('library.search.clear')
  }
  return t('home.filters.clear')
})

onMounted(() => {
  fetchGenres(language.value)
})

/**
 * Handles tab change.
 */
function handleTabChange(tabId: string) {
  activeTab.value = tabId as TabId
}

/**
 * Clears search, filters, or both based on state.
 */
function handleClearAll() {
  if (hasSearchQuery.value) clearSearch()
  if (activeFilterCount.value > 0) clearFilters()
}
</script>

<template>
  <div class="flex flex-col gap-6 px-4 pb-4 pt-2 md:px-6 md:pb-6">
    <!-- Library Controls -->
    <div
      class="sticky top-0 z-40 -mx-4 flex flex-col gap-4 bg-slate-50 px-4 pb-4 md:-mx-6 md:px-6 dark:bg-bg-primary"
    >
      <!-- Full-width Search -->
      <SearchBar v-model="query" @clear="clearSearch" />

      <!-- Other Controls Row -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Left: Genre and Media Type -->
        <div class="flex flex-wrap items-center gap-4">
          <FilterBar
            v-model="filters"
            :genres="genres"
            :active-filter-count="activeFilterCount"
            show-genre
            show-media-type
            compact-clear
            hide-clear
            @clear="clearFilters"
          />
        </div>

        <!-- Right: Sort and Rating (Other Filters) -->
        <div class="ml-auto flex flex-wrap items-center gap-4">
          <SortDropdown v-model="sortField" v-model:order="sortOrder" />

          <FilterBar
            v-model="filters"
            :genres="genres"
            :active-filter-count="activeFilterCount"
            show-rating-range
            compact-clear
            @clear="clearFilters"
          />

          <div class="w-full sm:w-64">
            <TabToggle :tabs="tabs" :active-tab="activeTab" @update:active-tab="handleTabChange" />
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main>
      <div v-if="filteredEntries.length > 0">
        <EntryGrid :entries="filteredEntries as any[]" />
      </div>

      <!-- Empty States -->
      <div v-else>
        <div class="py-12 text-center">
          <EmptyState
            :icon="emptyStateInfo.icon"
            :title="emptyStateInfo.title"
            :description="emptyStateInfo.description"
          >
            <button
              v-if="!isBaseScopeEmpty"
              type="button"
              class="mt-6 rounded-lg bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/80"
              @click="handleClearAll"
            >
              {{ emptyStateCta }}
            </button>
          </EmptyState>
        </div>
      </div>
    </main>
  </div>
</template>

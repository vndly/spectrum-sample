<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Bookmark, Eye, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useLibraryEntries } from '@/application/use-library-entries'
import { useLibraryFilters } from '@/application/use-library-filters'
import { useSort } from '@/application/use-sort'
import { useGenres } from '@/application/use-genres'
import { useSettings } from '@/application/use-settings'
import TabToggle from '@/presentation/components/common/tab-toggle.vue'
import EntryGrid from '@/presentation/components/common/entry-grid.vue'
import EmptyState from '@/presentation/components/common/empty-state.vue'
import FilterBar from '@/presentation/components/common/filter-bar.vue'
import SortDropdown from '@/presentation/components/common/sort-dropdown.vue'

const { t } = useI18n()
const { filters, activeFilterCount, clearFilters } = useLibraryFilters()
const { sortField, sortOrder } = useSort()
const { entries, allEntries } = useLibraryEntries(filters, sortField, sortOrder)
const { genres, fetchGenres } = useGenres()
const { language } = useSettings()

type TabId = 'watchlist' | 'watched'
const activeTab = ref<TabId>('watchlist')

const tabs = [
  { id: 'watchlist', label: t('library.tabs.watchlist') },
  { id: 'watched', label: t('library.tabs.watched') },
]

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

onMounted(() => {
  fetchGenres(language.value)
})

/**
 * Handles tab change.
 */
function handleTabChange(tabId: string) {
  activeTab.value = tabId as TabId
}
</script>

<template>
  <div class="flex flex-col gap-6 p-4 md:p-6">
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-2xl font-bold text-white">{{ t('page.library.title') }}</h1>
      <div class="flex flex-col items-end gap-4 sm:flex-row sm:items-center">
        <SortDropdown v-model="sortField" v-model:order="sortOrder" />
        <div class="w-full sm:w-64">
          <TabToggle :tabs="tabs" :active-tab="activeTab" @update:active-tab="handleTabChange" />
        </div>
      </div>
    </header>

    <!-- Filter Bar -->
    <div class="sticky top-0 z-40 -mx-4 bg-background px-4 py-2 md:-mx-6 md:px-6">
      <FilterBar
        v-model="filters"
        :genres="genres"
        :active-filter-count="activeFilterCount"
        show-genre
        show-media-type
        show-rating-range
        @clear="clearFilters"
      />
    </div>

    <!-- Main Content -->
    <main>
      <div v-if="filteredEntries.length > 0">
        <EntryGrid :entries="filteredEntries as any[]" />
      </div>

      <!-- Empty States -->
      <div v-else>
        <!-- Filtered Empty State -->
        <div v-if="!isBaseScopeEmpty" class="py-12 text-center">
          <EmptyState
            :icon="X"
            :title="t('library.empty.filtered.title')"
            :description="t('library.empty.filtered.description')"
          >
            <button
              type="button"
              class="mt-6 rounded-lg bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/80"
              @click="clearFilters"
            >
              {{ t('home.filters.clear') }}
            </button>
          </EmptyState>
        </div>

        <!-- Base Empty States -->
        <template v-else>
          <!-- Watchlist Empty -->
          <EmptyState
            v-if="activeTab === 'watchlist'"
            :icon="Bookmark"
            :title="t('library.empty.watchlist.title')"
            :description="t('library.empty.watchlist.description')"
          />

          <!-- Watched Empty -->
          <EmptyState
            v-else-if="activeTab === 'watched'"
            :icon="Eye"
            :title="t('library.empty.watched.title')"
            :description="t('library.empty.watched.description')"
          />
        </template>
      </div>
    </main>
  </div>
</template>

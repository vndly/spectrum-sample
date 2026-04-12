<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Bookmark, Eye, List as ListIcon, Plus, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useLibraryEntries } from '@/application/use-library-entries'
import { useLists } from '@/application/use-lists'
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
const { entries, refresh, allEntries } = useLibraryEntries(filters, sortField, sortOrder)
const { lists, createList } = useLists()
const { genres, fetchGenres } = useGenres()
const { language } = useSettings()

type TabId = 'watchlist' | 'watched' | 'lists'
const activeTab = ref<TabId>('watchlist')
const selectedListId = ref<string | null>(null)

const tabs = [
  { id: 'watchlist', label: t('library.tabs.watchlist') },
  { id: 'watched', label: t('library.tabs.watched') },
  { id: 'lists', label: t('library.tabs.lists') },
]

/**
 * Computed entries based on active tab and selected list.
 */
const filteredEntries = computed(() => {
  if (activeTab.value === 'watchlist') {
    return entries.value.filter((e) => e.status === 'watchlist')
  } else if (activeTab.value === 'watched') {
    return entries.value.filter((e) => e.status === 'watched')
  } else if (activeTab.value === 'lists' && selectedListId.value) {
    const listId = selectedListId.value
    return entries.value.filter((e) => e.listIds.includes(listId))
  }
  return []
})

/**
 * Checks if the current base scope (tab/list) is empty before filters are applied.
 */
const isBaseScopeEmpty = computed(() => {
  const allData = allEntries.value // Use already fetched entries
  if (activeTab.value === 'watchlist') {
    return !allData.some((e) => e.status === 'watchlist')
  } else if (activeTab.value === 'watched') {
    return !allData.some((e) => e.status === 'watched')
  } else if (activeTab.value === 'lists' && selectedListId.value) {
    const listId = selectedListId.value
    return !allData.some((e) => e.lists.includes(listId))
  }
  return true
})

// Set initial list if lists exist and tab is 'lists'
watch(
  [activeTab, lists],
  ([newTab, newLists]) => {
    if (newTab === 'lists' && !selectedListId.value && newLists.length > 0) {
      selectedListId.value = newLists[0].id
    }
  },
  { immediate: true },
)

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
 * Handles list selection.
 */
function selectList(id: string) {
  selectedListId.value = id
}

const newListName = ref('')

/**
 * Handles creating a new list.
 */
function handleCreateList() {
  const name = newListName.value.trim()
  if (!name) return
  createList(name)
  newListName.value = ''
  refresh()
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
        :lists="lists"
        :active-filter-count="activeFilterCount"
        show-genre
        show-media-type
        show-rating-range
        :show-watch-status="activeTab === 'lists'"
        :show-custom-lists="activeTab !== 'lists'"
        @clear="clearFilters"
      />
    </div>

    <!-- Custom Lists Selector (only visible in 'lists' tab) -->
    <div v-if="activeTab === 'lists' && lists.length > 0" class="flex flex-wrap gap-2">
      <button
        v-for="list in lists"
        :key="list.id"
        class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
        :class="
          selectedListId === list.id
            ? 'bg-accent text-white'
            : 'bg-surface text-slate-400 hover:text-white'
        "
        @click="selectList(list.id)"
      >
        {{ list.name }}
      </button>
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

          <!-- List Empty (specific list) -->
          <EmptyState
            v-else-if="activeTab === 'lists' && selectedListId"
            :icon="ListIcon"
            :title="t('library.empty.list.title')"
            :description="t('library.empty.list.description')"
          />

          <!-- No Lists at all -->
          <div v-else-if="activeTab === 'lists' && lists.length === 0" class="py-12">
            <EmptyState
              :icon="ListIcon"
              :title="t('library.empty.allLists.title')"
              :description="t('library.empty.allLists.description')"
            >
              <form class="mt-6 flex w-full max-w-xs gap-2" @submit.prevent="handleCreateList">
                <input
                  v-model="newListName"
                  type="text"
                  class="flex-1 rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-accent focus:outline-none"
                  :placeholder="t('library.lists.newNamePlaceholder')"
                />
                <button
                  type="submit"
                  class="flex size-10 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent/80"
                  :disabled="!newListName.trim()"
                >
                  <Plus class="size-5" />
                </button>
              </form>
            </EmptyState>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

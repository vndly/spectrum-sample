<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useShowDetail } from '@/application/use-show-detail'
import { useLibraryEntry } from '@/application/use-library-entry'
import { useSettings } from '@/application/use-settings'
import { useToast } from '@/presentation/composables/use-toast'
import HeroBackdrop from '@/presentation/components/details/hero-backdrop.vue'
import MetadataPanel from '@/presentation/components/details/metadata-panel.vue'
import CastCarousel from '@/presentation/components/details/cast-carousel.vue'
import TrailerEmbed from '@/presentation/components/details/trailer-embed.vue'
import StreamingBadges from '@/presentation/components/details/streaming-badges.vue'
import ProviderRatingBadge from '@/presentation/components/details/provider-rating-badge.vue'
import Synopsis from '@/presentation/components/details/synopsis.vue'
import RatingStars from '@/presentation/components/details/rating-stars.vue'
import ActionButtons from '@/presentation/components/details/action-buttons.vue'
import ListManagerModal from '@/presentation/components/details/list-manager-modal.vue'
import DetailSkeleton from '@/presentation/components/details/detail-skeleton.vue'
import EmptyState from '@/presentation/components/common/empty-state.vue'
import { AlertCircle } from 'lucide-vue-next'
import { updateEntryLists } from '@/infrastructure/storage.service'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { addToast } = useToast()
const { preferredRegion } = useSettings()

const showId = computed(() => Number(route.params.id))
const { data: show, loading, error, refresh } = useShowDetail(showId)

// Library entry composable - initialized once show data is available
const libraryEntryRef = ref<ReturnType<typeof useLibraryEntry> | null>(null)
const isListModalOpen = ref(false)

watch(
  show,
  (newShow) => {
    if (newShow) {
      libraryEntryRef.value = useLibraryEntry(
        newShow.id,
        'tv',
        newShow.name,
        newShow.poster_path,
        newShow.vote_average,
        newShow.first_air_date,
        newShow.episode_run_time?.[0],
      )
    } else {
      libraryEntryRef.value = null
    }
  },
  { immediate: true },
)

// Computed properties for safe template access
const userRating = computed(() => {
  const entry = libraryEntryRef.value?.entry
  return entry?.rating ?? 0
})
const isFavorite = computed(() => {
  const entry = libraryEntryRef.value?.entry
  return entry?.favorite ?? false
})
const watchStatus = computed(() => {
  const entry = libraryEntryRef.value?.entry
  return entry?.status ?? 'none'
})
const entryLists = computed(() => {
  const entry = libraryEntryRef.value?.entry
  return entry?.lists ?? []
})

/** Whether this is a 404 error. */
const isNotFound = computed(() => error.value?.message?.includes('404'))

/** Share URL for this show. */
const shareUrl = computed(() => {
  return `${window.location.origin}/show/${showId.value}`
})

/** Handles rating change. */
function handleRatingChange(value: number) {
  libraryEntryRef.value?.setRating(value)
}

/** Handles favorite toggle. */
function handleToggleFavorite() {
  libraryEntryRef.value?.toggleFavorite()
}

/** Handles status change. */
function handleUpdateStatus(status: 'watchlist' | 'watched' | 'none') {
  libraryEntryRef.value?.setStatus(status)
}

/** Handles list update. */
function handleUpdateLists(lists: string[]) {
  // Ensure entry exists before updating lists
  libraryEntryRef.value?.setStatus(watchStatus.value)
  updateEntryLists(showId.value, 'tv', lists)
  libraryEntryRef.value?.loadEntry() // Reload from storage
}

/** Handles share action. */
async function handleShare() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: show.value?.name,
        url: shareUrl.value,
      })
    } catch {
      // User cancelled or error - ignore
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl.value)
      addToast({
        message: t('details.share.copied'),
        type: 'success',
      })
    } catch {
      addToast({
        message: 'Failed to copy link',
        type: 'error',
      })
    }
  }
}

/** Navigates back to home. */
function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen">
    <!-- Loading state -->
    <DetailSkeleton v-if="loading" />

    <!-- Error state -->
    <div v-else-if="error" class="flex min-h-[50vh] items-center justify-center px-4">
      <EmptyState
        v-if="isNotFound"
        :icon="AlertCircle"
        :title="t('details.notFound.title')"
        :description="t('details.notFound.message')"
        data-testid="not-found"
      >
        <button
          class="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
          @click="goHome"
        >
          {{ t('details.notFound.home') }}
        </button>
      </EmptyState>
      <EmptyState
        v-else
        :icon="AlertCircle"
        :title="t('details.error.title')"
        :description="error.message"
        data-testid="error-state"
      >
        <button
          class="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
          data-testid="retry-button"
          @click="refresh"
        >
          {{ t('details.error.retry') }}
        </button>
      </EmptyState>
    </div>

    <!-- Content -->
    <template v-else-if="show">
      <HeroBackdrop
        :backdrop-path="show.backdrop_path"
        :title="show.name"
        :tagline="show.tagline"
      />

      <div class="space-y-6 px-4 py-6 md:px-6">
        <!-- Rating badge and user rating -->
        <div class="flex flex-wrap items-center gap-4">
          <ProviderRatingBadge :vote-average="show.vote_average" />
          <RatingStars :model-value="userRating" @update:model-value="handleRatingChange" />
        </div>

        <!-- Metadata -->
        <MetadataPanel
          :first-air-date="show.first_air_date"
          :number-of-seasons="show.number_of_seasons"
          :number-of-episodes="show.number_of_episodes"
          :genres="show.genres"
          :crew="show.credits.crew"
          :spoken-languages="show.spoken_languages"
        />

        <!-- Synopsis -->
        <Synopsis :overview="show.overview" />

        <!-- Action buttons (no IMDB for TV shows) -->
        <ActionButtons
          :favorite="isFavorite"
          :status="watchStatus"
          :imdb-id="null"
          :share-url="shareUrl"
          :share-title="show.name"
          :has-lists="entryLists.length > 0"
          @toggle-favorite="handleToggleFavorite"
          @update-status="handleUpdateStatus"
          @manage-lists="isListModalOpen = true"
          @share="handleShare"
        />

        <!-- Cast carousel -->
        <CastCarousel :cast="show.credits.cast" />

        <!-- Trailer -->
        <TrailerEmbed :videos="show.videos.results" />

        <!-- Streaming providers -->
        <StreamingBadges :providers="show['watch/providers'].results" :region="preferredRegion" />
      </div>

      <!-- Modals -->
      <ListManagerModal
        v-model="isListModalOpen"
        :entry-lists="entryLists"
        @update:entry-lists="handleUpdateLists"
      />
    </template>
  </div>
</template>

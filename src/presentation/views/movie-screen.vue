<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMovieDetail } from '@/application/use-movie-detail'
import { useLibraryEntry } from '@/application/use-library-entry'
import { useSettings } from '@/application/use-settings'
import { useToast } from '@/presentation/composables/use-toast'
import HeroBackdrop from '@/presentation/components/details/hero-backdrop.vue'
import MetadataPanel from '@/presentation/components/details/metadata-panel.vue'
import CastCarousel from '@/presentation/components/details/cast-carousel.vue'
import TrailerEmbed from '@/presentation/components/details/trailer-embed.vue'
import StreamingBadges from '@/presentation/components/details/streaming-badges.vue'
import BoxOffice from '@/presentation/components/details/box-office.vue'
import ProviderRatingBadge from '@/presentation/components/details/provider-rating-badge.vue'
import Synopsis from '@/presentation/components/details/synopsis.vue'
import ActionButtons from '@/presentation/components/details/action-buttons.vue'
import DetailSkeleton from '@/presentation/components/details/detail-skeleton.vue'
import EmptyState from '@/presentation/components/common/empty-state.vue'
import { AlertCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { addToast } = useToast()
const { preferredRegion } = useSettings()

const movieId = computed(() => Number(route.params.id))
const { data: movie, loading, error, refresh } = useMovieDetail(movieId)

// Library entry composable - initialized once movie data is available
const libraryEntryRef = ref<ReturnType<typeof useLibraryEntry> | null>(null)

watch(
  movie,
  (newMovie) => {
    if (newMovie) {
      libraryEntryRef.value = useLibraryEntry(
        newMovie.id,
        'movie',
        newMovie.title,
        newMovie.poster_path,
        newMovie.vote_average,
        newMovie.release_date,
        newMovie.runtime ?? undefined,
      )
    } else {
      libraryEntryRef.value = null
    }
  },
  { immediate: true },
)

// Computed properties for safe template access
const watchStatus = computed(() => {
  const entry = libraryEntryRef.value?.entry
  return entry?.status ?? 'none'
})

/** Whether this is a 404 error. */
const isNotFound = computed(() => error.value?.message?.includes('404'))

/** Share URL for this movie. */
const shareUrl = computed(() => {
  return `${window.location.origin}/movie/${movieId.value}`
})

/** Handles status change. */
function handleUpdateStatus(status: 'watchlist' | 'watched' | 'none') {
  libraryEntryRef.value?.setStatus(status)
}

/** Handles share action. */
async function handleShare() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: movie.value?.title,
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
    <template v-else-if="movie">
      <HeroBackdrop
        :backdrop-path="movie.backdrop_path"
        :title="movie.title"
        :tagline="movie.tagline"
      />

      <div class="space-y-6 px-4 py-4 md:px-6 md:py-6">
        <!-- Rating badge -->
        <ProviderRatingBadge :vote-average="movie.vote_average" />

        <!-- Metadata -->
        <MetadataPanel
          :release-date="movie.release_date"
          :runtime="movie.runtime"
          :genres="movie.genres"
          :crew="movie.credits.crew"
          :spoken-languages="movie.spoken_languages"
        />

        <!-- Synopsis -->
        <Synopsis :overview="movie.overview" />

        <!-- Box Office -->
        <BoxOffice :budget="movie.budget" :revenue="movie.revenue" />

        <!-- Action buttons -->
        <ActionButtons
          :status="watchStatus"
          :imdb-id="movie.imdb_id"
          :share-url="shareUrl"
          :share-title="movie.title"
          @update-status="handleUpdateStatus"
          @share="handleShare"
        />

        <!-- Cast carousel -->
        <CastCarousel :cast="movie.credits.cast" />

        <!-- Trailer -->
        <TrailerEmbed :videos="movie.videos.results" />

        <!-- Streaming providers -->
        <StreamingBadges :providers="movie['watch/providers'].results" :region="preferredRegion" />
      </div>
    </template>
  </div>
</template>

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
import ContentRatingBadge from '@/presentation/components/details/content-rating-badge.vue'
import Synopsis from '@/presentation/components/details/synopsis.vue'
import ActionButtons from '@/presentation/components/details/action-buttons.vue'
import ExternalLinks from '@/presentation/components/details/external-links.vue'
import ImagesGallery from '@/presentation/components/details/images-gallery.vue'
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

/** Extracts content rating (certification) for the preferred region. */
const contentRating = computed(() => {
  if (!movie.value) return null
  const regionData = movie.value.release_dates.results.find(
    (r) => r.iso_3166_1 === preferredRegion.value,
  )
  if (!regionData) return null
  // Find the first release with a certification
  const releaseWithCert = regionData.release_dates.find((rd) => rd.certification)
  return releaseWithCert?.certification ?? null
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
      >
        <template #actions>
          <ActionButtons
            :status="watchStatus"
            :share-url="shareUrl"
            :share-title="movie.title"
            @update-status="handleUpdateStatus"
            @share="handleShare"
          />
        </template>
      </HeroBackdrop>

      <div class="space-y-6 px-4 py-4 md:px-6 md:py-6">
        <!-- Rating badges -->
        <div class="flex flex-wrap items-center gap-2">
          <ProviderRatingBadge :vote-average="movie.vote_average" />
          <ContentRatingBadge :rating="contentRating" />
        </div>

        <!-- Metadata -->
        <MetadataPanel
          :release-date="movie.release_date"
          :runtime="movie.runtime"
          :genres="movie.genres"
          :crew="movie.credits.crew"
          :spoken-languages="movie.spoken_languages"
          :original-language="movie.original_language"
        />

        <!-- Synopsis -->
        <Synopsis :overview="movie.overview" />

        <!-- Box Office -->
        <BoxOffice :budget="movie.budget" :revenue="movie.revenue" />

        <!-- Cast carousel -->
        <CastCarousel :cast="movie.credits.cast" />

        <!-- Trailer -->
        <TrailerEmbed :videos="movie.videos.results" />

        <!-- Streaming providers -->
        <StreamingBadges :providers="movie['watch/providers'].results" :region="preferredRegion" />

        <!-- External links -->
        <ExternalLinks
          :imdb-id="movie.imdb_id"
          :homepage="movie.homepage"
          :facebook-id="movie.external_ids.facebook_id"
          :instagram-id="movie.external_ids.instagram_id"
          :twitter-id="movie.external_ids.twitter_id"
        />

        <!-- Images gallery -->
        <ImagesGallery :posters="movie.images.posters" :backdrops="movie.images.backdrops" />
      </div>
    </template>
  </div>
</template>

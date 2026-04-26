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

const showId = computed(() => Number(route.params.id))
const { data: show, loading, error, refresh } = useShowDetail(showId)

// Library entry composable - initialized once show data is available
const libraryEntryRef = ref<ReturnType<typeof useLibraryEntry> | null>(null)

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
const watchStatus = computed(() => {
  const entry = libraryEntryRef.value?.entry
  return entry?.status ?? 'none'
})

/** Whether this is a 404 error. */
const isNotFound = computed(() => error.value?.message?.includes('404'))

/** Share URL for this show. */
const shareUrl = computed(() => {
  return `${window.location.origin}/show/${showId.value}`
})

/** Extracts content rating for the preferred region. */
const contentRating = computed(() => {
  if (!show.value) return null
  const regionRating = show.value.content_ratings.results.find(
    (r) => r.iso_3166_1 === preferredRegion.value,
  )
  return regionRating?.rating ?? null
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
      <HeroBackdrop :backdrop-path="show.backdrop_path" :title="show.name" :tagline="show.tagline">
        <template #actions>
          <ActionButtons
            :status="watchStatus"
            :share-url="shareUrl"
            :share-title="show.name"
            @update-status="handleUpdateStatus"
            @share="handleShare"
          />
        </template>
      </HeroBackdrop>

      <div class="space-y-6 px-4 py-4 md:px-6 md:py-6">
        <!-- Rating badges -->
        <div class="flex flex-wrap items-center gap-2">
          <ProviderRatingBadge :vote-average="show.vote_average" />
          <ContentRatingBadge :rating="contentRating" />
        </div>

        <!-- Metadata -->
        <MetadataPanel
          :first-air-date="show.first_air_date"
          :number-of-seasons="show.number_of_seasons"
          :number-of-episodes="show.number_of_episodes"
          :genres="show.genres"
          :crew="show.credits.crew"
          :spoken-languages="show.spoken_languages"
          :original-language="show.original_language"
        />

        <!-- Synopsis -->
        <Synopsis :overview="show.overview" />

        <!-- Cast carousel -->
        <CastCarousel :cast="show.credits.cast" />

        <!-- Trailer -->
        <TrailerEmbed :videos="show.videos.results" />

        <!-- Streaming providers -->
        <StreamingBadges :providers="show['watch/providers'].results" :region="preferredRegion" />

        <!-- External links -->
        <ExternalLinks
          :imdb-id="show.external_ids.imdb_id"
          :homepage="show.homepage"
          :facebook-id="show.external_ids.facebook_id"
          :instagram-id="show.external_ids.instagram_id"
          :twitter-id="show.external_ids.twitter_id"
        />

        <!-- Images gallery -->
        <ImagesGallery :posters="show.images.posters" :backdrops="show.images.backdrops" />
      </div>
    </template>
  </div>
</template>

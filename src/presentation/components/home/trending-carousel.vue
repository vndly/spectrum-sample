<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight, Film, Star } from 'lucide-vue-next'
import type { MediaResult } from '@/application/use-browse'
import { buildImageSrcSet, buildImageUrl } from '@/infrastructure/image.helper'
import { IMAGE_SIZES } from '@/domain/constants'

defineProps<{
  items: MediaResult[]
  loading: boolean
}>()

const router = useRouter()
const { t } = useI18n()
const carouselRef = ref<HTMLElement | null>(null)

/**
 * Navigates to the detail page for the given item.
 */
function handleItemClick(item: MediaResult) {
  const path = item.media_type === 'movie' ? `/movie/${item.id}` : `/show/${item.id}`
  router.push(path)
}

/**
 * Opens the detail page in a new tab on middle click.
 */
function handleMiddleClick(event: MouseEvent, item: MediaResult) {
  if (event.button !== 1) return
  event.preventDefault()
  const path = item.media_type === 'movie' ? `/movie/${item.id}` : `/show/${item.id}`
  window.open(path, '_blank')
}

/**
 * Returns the title for movies or name for TV shows.
 */
function getTitle(item: MediaResult) {
  return 'title' in item ? item.title : item.name
}

/**
 * Returns the poster URL for the item.
 */
function getPosterUrl(item: MediaResult) {
  return buildImageUrl(item.poster_path, IMAGE_SIZES.poster.medium)
}

/**
 * Returns responsive poster candidates for sharper carousel cards.
 */
function getPosterSrcSet(item: MediaResult) {
  return buildImageSrcSet(item.poster_path, [
    IMAGE_SIZES.poster.small,
    IMAGE_SIZES.poster.medium,
    IMAGE_SIZES.poster.large,
  ])
}

/**
 * Returns the release year for a movie or show.
 */
function getYear(item: MediaResult) {
  const date = 'release_date' in item ? item.release_date : item.first_air_date

  if (!date) {
    return ''
  }

  const year = new Date(date).getFullYear()
  return Number.isNaN(year) ? '' : String(year)
}

/**
 * Returns the formatted rating for the item.
 */
function getRating(item: MediaResult) {
  if (!item.vote_average || item.vote_average <= 0) return null
  return item.vote_average.toFixed(1)
}

/**
 * Returns the media type translation key.
 */
function getMediaTypeKey(item: MediaResult) {
  return item.media_type === 'movie' ? 'page.movie.title' : 'page.show.title'
}

/**
 * Scrolls the carousel in the requested direction.
 */
function scrollCarousel(direction: 'previous' | 'next') {
  if (!carouselRef.value) {
    return
  }

  const offset = Math.max(carouselRef.value.clientWidth * 0.85, 280)
  carouselRef.value.scrollBy({
    left: direction === 'next' ? offset : -offset,
    behavior: 'smooth',
  })
}
</script>

<template>
  <section class="space-y-4">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
        {{ t('home.browse.trending') }}
      </h2>

      <div v-if="!loading && items.length > 1" class="flex items-center gap-2">
        <button
          data-testid="trending-scroll-previous"
          type="button"
          :aria-label="t('home.browse.scrollPrevious')"
          class="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-teal-500/50 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-surface dark:text-slate-300 dark:shadow-none dark:hover:bg-surface-hover dark:hover:text-white"
          @click="scrollCarousel('previous')"
        >
          <ChevronLeft class="size-5" />
        </button>
        <button
          data-testid="trending-scroll-next"
          type="button"
          :aria-label="t('home.browse.scrollNext')"
          class="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-teal-500/50 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-surface dark:text-slate-300 dark:shadow-none dark:hover:bg-surface-hover dark:hover:text-white"
          @click="scrollCarousel('next')"
        >
          <ChevronRight class="size-5" />
        </button>
      </div>
    </div>

    <!-- Skeleton loader during initial fetch -->
    <div v-if="loading" class="flex gap-4 overflow-hidden">
      <div v-for="n in 6" :key="n" class="w-32 md:w-40 flex-shrink-0 space-y-2">
        <div
          class="aspect-[2/3] w-full animate-pulse rounded-lg bg-slate-200 dark:bg-surface"
        ></div>
        <div class="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-surface"></div>
        <div class="h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-surface"></div>
      </div>
    </div>

    <!-- Scrollable carousel -->
    <div
      v-else
      ref="carouselRef"
      data-testid="trending-carousel"
      class="flex gap-4 overflow-x-auto pb-4 pr-2 snap-x scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        v-for="item in items"
        :key="`${item.media_type}-${item.id}`"
        class="w-32 md:w-40 flex-shrink-0 cursor-pointer snap-start group"
        role="button"
        tabindex="0"
        :aria-label="getTitle(item)"
        @click="handleItemClick(item)"
        @auxclick="handleMiddleClick($event, item)"
        @keydown.enter.prevent="handleItemClick(item)"
        @keydown.space.prevent="handleItemClick(item)"
      >
        <div
          class="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-slate-200 transition-transform duration-200 ease-in-out group-hover:scale-105 dark:bg-surface"
        >
          <img
            v-if="getPosterUrl(item)"
            :src="getPosterUrl(item)!"
            :srcset="getPosterSrcSet(item) || undefined"
            sizes="(max-width: 768px) 128px, 160px"
            :alt="getTitle(item)"
            class="size-full object-cover"
            loading="lazy"
          />
          <div
            v-else
            class="flex size-full items-center justify-center text-slate-400 dark:text-slate-500"
          >
            <Film class="size-12" aria-hidden="true" />
          </div>
          <div
            v-if="getRating(item)"
            class="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white"
          >
            <Star class="size-3 fill-current" aria-hidden="true" />
            <span>{{ getRating(item) }}</span>
          </div>
        </div>

        <div class="mt-2 space-y-0.5">
          <h3 class="truncate text-sm font-medium text-slate-950 dark:text-white">
            {{ getTitle(item) }}
          </h3>
          <p class="text-xs text-slate-400">
            <span>{{ t(getMediaTypeKey(item)) }}</span>
            <template v-if="getYear(item)">
              <span class="mx-1">·</span>
              <span>{{ getYear(item) }}</span>
            </template>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

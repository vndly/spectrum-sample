<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
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
 * Returns the title for movies or name for TV shows.
 */
function getTitle(item: MediaResult) {
  return 'title' in item ? item.title : item.name
}

/**
 * Returns the backdrop URL with fallbacks.
 */
function getBackdropUrl(item: MediaResult) {
  if (item.backdrop_path) {
    return buildImageUrl(item.backdrop_path, IMAGE_SIZES.backdrop.large)
  }

  return buildImageUrl(item.poster_path, IMAGE_SIZES.poster.large)
}

/**
 * Returns responsive backdrop candidates for sharper carousel cards.
 */
function getBackdropSrcSet(item: MediaResult) {
  if (item.backdrop_path) {
    return buildImageSrcSet(item.backdrop_path, [
      IMAGE_SIZES.backdrop.small,
      IMAGE_SIZES.backdrop.medium,
      IMAGE_SIZES.backdrop.large,
    ])
  }

  return buildImageSrcSet(item.poster_path, [IMAGE_SIZES.poster.medium, IMAGE_SIZES.poster.large])
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
      <div
        v-for="n in 3"
        :key="n"
        class="aspect-video w-64 flex-shrink-0 animate-pulse rounded-lg bg-slate-200 dark:bg-surface"
      ></div>
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
        class="group relative aspect-video w-64 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl bg-slate-200 transition-transform duration-200 ease-in-out hover:scale-[1.02] snap-start dark:bg-surface"
        role="button"
        tabindex="0"
        :aria-label="getTitle(item)"
        @click="handleItemClick(item)"
        @keydown.enter.prevent="handleItemClick(item)"
        @keydown.space.prevent="handleItemClick(item)"
      >
        <img
          :src="getBackdropUrl(item) || ''"
          :srcset="getBackdropSrcSet(item) || undefined"
          sizes="256px"
          :alt="getTitle(item)"
          class="size-full object-cover"
          loading="lazy"
        />
        <div
          class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/15 to-transparent p-4"
        >
          <h3 class="truncate text-sm font-bold tracking-tight text-white">{{ getTitle(item) }}</h3>
          <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300">
            {{ t(item.media_type === 'movie' ? 'page.movie.title' : 'page.show.title') }}
            <span v-if="getYear(item)" class="text-slate-400">· {{ getYear(item) }}</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

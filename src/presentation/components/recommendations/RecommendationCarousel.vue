<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useIntersectionObserver } from '@/presentation/composables/use-intersection-observer'
import { buildImageSrcSet, buildImageUrl } from '@/infrastructure/image.helper'
import { IMAGE_SIZES } from '@/domain/constants'
import type { SearchResultItem } from '@/domain/search.schema'

defineProps<{
  titleKey: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  titleParams?: Record<string, any>
  items: SearchResultItem[]
  loading: boolean
  error: Error | null
  fetched: boolean
}>()

const emit = defineEmits<{
  (e: 'intersect'): void
}>()

const router = useRouter()
const { t } = useI18n()
const sectionRef = ref<HTMLElement | null>(null)
const carouselRef = ref<HTMLElement | null>(null)
const { observe, isIntersecting } = useIntersectionObserver(sectionRef)

onMounted(() => {
  observe()
})

// When the component is about to enter viewport, emit intersect to parent
watch(isIntersecting, (val) => {
  if (val) {
    emit('intersect')
  }
})

function handleItemClick(item: SearchResultItem) {
  const path = item.media_type === 'movie' ? `/movie/${item.id}` : `/show/${item.id}`
  router.push(path)
}

function getTitle(item: SearchResultItem) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'title' in item ? (item as any).title : (item as any).name
}

function getPosterUrl(item: SearchResultItem) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return buildImageUrl((item as any).poster_path, IMAGE_SIZES.poster.medium)
}

function getPosterSrcSet(item: SearchResultItem) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return buildImageSrcSet((item as any).poster_path, [
    IMAGE_SIZES.poster.medium,
    IMAGE_SIZES.poster.large,
  ])
}

function getYear(item: SearchResultItem) {
  const dateStr =
    item.media_type === 'movie' ? (item as any).release_date : (item as any).first_air_date
  if (!dateStr) return null
  const year = dateStr.slice(0, 4)
  return year && year !== '0000' ? year : null
}

function getMediaTypeKey(item: SearchResultItem) {
  return item.media_type === 'movie'
    ? 'recommendations.mediaType.movie'
    : 'recommendations.mediaType.tv'
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
  <section ref="sectionRef" class="space-y-4">
    <div class="flex items-center justify-between gap-4">
      <h3 class="text-lg font-bold text-slate-950 dark:text-white">
        <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
        {{ t(titleKey, titleParams as any) }}
      </h3>

      <div v-if="!loading && !error && fetched && items.length > 1" class="flex items-center gap-2">
        <button
          data-testid="recommendation-scroll-previous"
          type="button"
          :aria-label="t('recommendations.scrollPrevious')"
          class="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-teal-500/50 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-surface dark:text-slate-300 dark:shadow-none dark:hover:bg-surface-hover dark:hover:text-white"
          @click="scrollCarousel('previous')"
        >
          <ChevronLeft class="size-5" />
        </button>
        <button
          data-testid="recommendation-scroll-next"
          type="button"
          :aria-label="t('recommendations.scrollNext')"
          class="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-teal-500/50 hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-surface dark:text-slate-300 dark:shadow-none dark:hover:bg-surface-hover dark:hover:text-white"
          @click="scrollCarousel('next')"
        >
          <ChevronRight class="size-5" />
        </button>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-if="error"
      class="flex flex-col items-center justify-center p-8 rounded-lg border border-red-200 bg-white text-center shadow-sm dark:border-red-500/20 dark:bg-surface dark:shadow-none"
    >
      <p class="text-slate-600 mb-4 dark:text-slate-400">{{ t('errors.generic') }}</p>
      <button
        class="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
        @click="$emit('intersect')"
      >
        {{ t('common.retry') }}
      </button>
    </div>

    <!-- Skeleton loader (while loading OR waiting for first fetch) -->
    <div v-else-if="loading || (!fetched && !error)" class="flex gap-4 overflow-hidden">
      <div v-for="n in 6" :key="n" class="w-32 md:w-40 flex-shrink-0 space-y-2">
        <div
          class="aspect-[2/3] w-full animate-pulse rounded-lg bg-slate-200 dark:bg-surface"
        ></div>
        <div class="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-surface"></div>
        <div class="h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-surface"></div>
      </div>
    </div>

    <!-- Empty/No Results (after successful fetch) -->
    <div v-else-if="items.length === 0" class="h-4"></div>

    <!-- Scrollable carousel -->
    <div
      v-else
      ref="carouselRef"
      data-testid="recommendation-carousel"
      class="flex gap-4 overflow-x-auto pb-4 pr-2 snap-x scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        v-for="item in items as any[]"
        :key="`${item.media_type}-${item.id}`"
        class="w-32 md:w-40 flex-shrink-0 cursor-pointer snap-start group"
        role="button"
        tabindex="0"
        @click="handleItemClick(item)"
        @keydown.enter.prevent="handleItemClick(item)"
        @keydown.space.prevent="handleItemClick(item)"
      >
        <div
          class="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-slate-200 transition-transform duration-200 group-hover:scale-105 dark:bg-surface"
        >
          <img
            v-if="item.poster_path"
            :src="getPosterUrl(item)!"
            :srcset="getPosterSrcSet(item)!"
            sizes="(max-width: 768px) 128px, 160px"
            :alt="getTitle(item)"
            class="size-full object-cover"
            loading="lazy"
          />
          <div
            v-else
            class="size-full flex items-center justify-center bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-500"
          >
            <span class="text-xs text-center px-2">{{ getTitle(item) }}</span>
          </div>
        </div>

        <div class="mt-2 space-y-0.5">
          <h4 class="truncate text-sm font-medium text-white">
            {{ getTitle(item) }}
          </h4>
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
